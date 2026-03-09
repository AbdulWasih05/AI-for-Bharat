/**
 * Nirman Mitra — Unified Bedrock Client
 * Cache + Retry with backoff + LLM fallback + Model tier routing.
 *
 * Usage:
 *   import { invokeModel } from '../utils/bedrockClient.js';
 *   const text = await invokeModel(prompt, { tier: 'light', cacheTtlSeconds: 86400 });
 */

import { createHash } from 'crypto';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import config from './config.js';

const bedrockClient = new BedrockRuntimeClient({ region: config.bedrock.region });
const ddbDocClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: config.bedrock.region }),
);

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// ─────────────────────────────────────────────────────────
// Cache helpers
// ─────────────────────────────────────────────────────────

function buildCacheKey(modelId, prompt, maxTokens) {
  return createHash('sha256')
    .update(`${modelId}|${prompt}|${maxTokens}`)
    .digest('hex');
}

async function cacheGet(hash) {
  try {
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: config.tables.bedrockCache,
        Key: { input_hash: hash },
      }),
    );
    if (result.Item && result.Item.ttl > Math.floor(Date.now() / 1000)) {
      return result.Item.response_text;
    }
  } catch (err) {
    console.warn('[BedrockClient] Cache read failed:', err.message);
  }
  return null;
}

async function cachePut(hash, responseText, ttlSeconds) {
  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: config.tables.bedrockCache,
        Item: {
          input_hash: hash,
          response_text: responseText,
          ttl: Math.floor(Date.now() / 1000) + ttlSeconds,
          created_at: new Date().toISOString(),
        },
      }),
    );
  } catch (err) {
    console.warn('[BedrockClient] Cache write failed:', err.message);
  }
}

// ─────────────────────────────────────────────────────────
// Model invocation helpers
// ─────────────────────────────────────────────────────────

function isClaudeModel(modelId) {
  return modelId.startsWith('anthropic.');
}

function buildRequestBody(modelId, prompt, maxTokens) {
  if (isClaudeModel(modelId)) {
    return JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });
  }
  // Amazon Nova / other models
  return JSON.stringify({
    messages: [{ role: 'user', content: [{ text: prompt }] }],
    inferenceConfig: { maxNewTokens: maxTokens },
  });
}

function extractResponseText(modelId, responseBody) {
  if (isClaudeModel(modelId)) {
    return responseBody.content?.[0]?.text || '';
  }
  // Amazon Nova format
  return responseBody.output?.message?.content?.[0]?.text || '';
}

// ─────────────────────────────────────────────────────────
// Retry with exponential backoff
// ─────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function invokeWithRetry(modelId, prompt, maxTokens) {
  const body = buildRequestBody(modelId, prompt, maxTokens);
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await bedrockClient.send(
        new InvokeModelCommand({
          modelId,
          body,
          contentType: 'application/json',
          accept: 'application/json',
        }),
      );
      const parsed = JSON.parse(new TextDecoder().decode(response.body));
      return extractResponseText(modelId, parsed);
    } catch (err) {
      lastError = err;
      const isThrottling =
        err.name === 'ThrottlingException' ||
        err.name === 'TooManyRequestsException' ||
        err.$metadata?.httpStatusCode === 429;
      if (!isThrottling || attempt === MAX_RETRIES - 1) throw err;
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(`[BedrockClient] Throttled, retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`);
      await sleep(delay);
    }
  }
  throw lastError;
}

// ─────────────────────────────────────────────────────────
// OpenAI fallback (optional)
// ─────────────────────────────────────────────────────────

async function invokeFallbackOpenAI(prompt, maxTokens) {
  const apiKey = config.llmFallback.fallbackApiKey;
  if (!apiKey) throw new Error('No fallback API key configured');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI fallback failed: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────

/**
 * Invoke an LLM with caching, retry, and fallback.
 * @param {string} prompt - The prompt text
 * @param {object} [options]
 * @param {'heavy'|'light'} [options.tier='heavy'] - 'heavy' = Claude 3.5 Sonnet, 'light' = Nova Lite
 * @param {number} [options.maxTokens=500]
 * @param {number} [options.cacheTtlSeconds=0] - 0 = no caching
 * @returns {Promise<string>} Response text
 */
export async function invokeModel(prompt, options = {}) {
  const { tier = 'heavy', maxTokens = 500, cacheTtlSeconds = 0 } = options;
  const modelId = tier === 'light' ? config.bedrock.lightModelId : config.bedrock.modelId;

  // 1. Cache check
  let cacheKey = null;
  if (cacheTtlSeconds > 0) {
    cacheKey = buildCacheKey(modelId, prompt, maxTokens);
    const cached = await cacheGet(cacheKey);
    if (cached) {
      console.log('[BedrockClient] Cache HIT');
      return cached;
    }
  }

  // 2. Invoke with retry
  let responseText;
  try {
    responseText = await invokeWithRetry(modelId, prompt, maxTokens);
  } catch (err) {
    console.error(`[BedrockClient] Bedrock failed after ${MAX_RETRIES} attempts:`, err.message);

    // 3. Fallback to OpenAI if configured
    if (config.llmFallback.fallbackProvider === 'openai' && config.llmFallback.fallbackApiKey) {
      console.warn('[BedrockClient] Falling back to OpenAI');
      try {
        responseText = await invokeFallbackOpenAI(prompt, maxTokens);
      } catch (fallbackErr) {
        console.error('[BedrockClient] OpenAI fallback also failed:', fallbackErr.message);
        throw err; // throw original Bedrock error
      }
    } else {
      console.warn('[BedrockClient] No fallback LLM configured — returning graceful error');
      return '[AI service temporarily unavailable. Please try again.]';
    }
  }

  // 4. Cache write
  if (cacheTtlSeconds > 0 && cacheKey && responseText) {
    await cachePut(cacheKey, responseText, cacheTtlSeconds);
  }

  return responseText;
}

export default { invokeModel };
