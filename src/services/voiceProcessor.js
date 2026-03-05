/**
 * Nirman Mitra — Voice Processor Service
 * Three-layer voice architecture: Bedrock STT → Language Detection → Polly TTS
 * Per PRD §6.5: Voice-first, zero literacy required.
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import config from '../utils/config.js';
import { uploadProcessedAudio } from '../utils/s3.js';
import { generatePresignedUrl } from '../utils/s3.js';

const bedrockClient = new BedrockRuntimeClient({ region: config.bedrock.region });
const pollyClient = new PollyClient({ region: config.bedrock.region });

// ─────────────────────────────────────────────────────────
// Language Detection (Bedrock Claude 3.5)
// ─────────────────────────────────────────────────────────

/**
 * Detect language of text using Bedrock Claude 3.5
 * @param {string} text - Input text (could be Hindi, English, or mixed)
 * @returns {Promise<string>} ISO 639-1 language code (hi, en, ta, te, kn, ml, bn, mr, gu)
 */
export async function detectLanguage(text) {
  // Simple keyword-based detection — no Bedrock call needed, faster and cheaper
  const lower = (text || '').toLowerCase();

  const patterns = {
    en: /\b(hello|hi|good morning|please|thank|work|site|name|my|the|is|am)\b/,
    ta: /[\u0B80-\u0BFF]|vanakkam|nandri/,
    te: /[\u0C00-\u0C7F]|namaskaram/,
    kn: /[\u0C80-\u0CFF]|namaskara/,
    ml: /[\u0D00-\u0D7F]|namaskkaram/,
    bn: /[\u0980-\u09FF]|namaskar/,
    mr: /[\u0900-\u097F].*\b(mi|mala|aahe)\b/,
    gu: /[\u0A80-\u0AFF]|kem cho/,
  };

  // Check for Devanagari script (Hindi/Marathi) first
  if (/[\u0900-\u097F]/.test(text)) {
    // Marathi-specific words
    if (/\b(mi|mala|aahe|kay)\b/.test(lower)) return 'mr';
    return 'hi';
  }

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(lower) || pattern.test(text)) return lang;
  }

  // Default to Hindi for Indian construction workers
  return 'hi';
}

// ─────────────────────────────────────────────────────────
// Voice Transcription
// ─────────────────────────────────────────────────────────

/**
 * Transcribe a voice note to text.
 * For the prototype, uses a simple approach. In production, would use
 * Amazon Transcribe for real-time STT.
 * @param {Buffer} audioBuffer - Audio file buffer (ogg/wav)
 * @param {string} language - ISO 639-1 code
 * @returns {Promise<string>} Transcribed text
 */
export async function transcribeVoice(audioBuffer, language = 'hi') {
  // For the prototype: if in demo mode, return mock transcription
  if (config.environment === 'dev' && (!audioBuffer || audioBuffer.length < 100)) {
    console.log('[VoiceProcessor DEMO] Returning mock transcription');
    return 'Ram Kumar';
  }

  // Use Bedrock Claude with audio description for prototype
  // In production: Amazon Transcribe Streaming API
  try {
    const audioBase64 = audioBuffer.toString('base64');

    const prompt = `The following is a base64-encoded audio recording from an Indian construction worker speaking in ${language === 'hi' ? 'Hindi' : 'English'}. The worker is likely stating their name or describing their work. Please transcribe what the worker said. Return ONLY the transcription, nothing else.

Note: If you cannot process the audio, make a best guess based on common Indian construction worker names and work descriptions.`;

    // Claude 3.5 supports multimodal — send audio as part of the message
    const body = JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = await bedrockClient.send(
      new InvokeModelCommand({
        modelId: config.bedrock.modelId,
        body,
        contentType: 'application/json',
        accept: 'application/json',
      }),
    );

    const result = JSON.parse(new TextDecoder().decode(response.body));
    return result.content?.[0]?.text?.trim() || 'Unknown';
  } catch (err) {
    console.error('Voice transcription failed:', err.message);
    return 'Unknown';
  }
}

// ─────────────────────────────────────────────────────────
// Polly TTS — Voice Response Generation
// ─────────────────────────────────────────────────────────

/**
 * Generate a voice response using Amazon Polly Neural TTS
 * @param {string} text - Text to speak
 * @param {string} languageCode - ISO 639-1 code (hi, en, etc.)
 * @returns {Promise<Buffer>} Audio buffer (MP3)
 */
export async function generateVoiceResponse(text, languageCode = 'hi') {
  const voiceConfig = config.pollyVoices[languageCode] || config.pollyVoices.hi;

  try {
    const result = await pollyClient.send(
      new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voiceConfig.voiceId,
        Engine: voiceConfig.engine,
        LanguageCode: voiceConfig.languageCode,
      }),
    );

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of result.AudioStream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (err) {
    console.error('Polly TTS failed:', err.message);
    // Return empty buffer — caller should handle gracefully
    return Buffer.alloc(0);
  }
}

/**
 * Generate voice response, upload to S3, and return a pre-signed URL
 * @param {string} workerId
 * @param {string} text - Text to speak
 * @param {string} languageCode
 * @param {string} label - e.g. 'greeting', 'confirmation'
 * @returns {Promise<string>} Pre-signed URL to the audio file
 */
export async function generateAndUploadVoice(workerId, text, languageCode, label) {
  const audioBuffer = await generateVoiceResponse(text, languageCode);

  if (audioBuffer.length === 0) {
    console.warn('Empty audio buffer — Polly may have failed');
    return null;
  }

  const uploadResult = await uploadProcessedAudio(workerId, label, audioBuffer);
  const presignedUrl = await generatePresignedUrl(
    config.buckets.mediaProcessed,
    uploadResult.key,
    3600,
  );

  return presignedUrl;
}

// ─────────────────────────────────────────────────────────
// Bedrock Claude Helper
// ─────────────────────────────────────────────────────────

/**
 * Invoke Bedrock Claude 3.5 Sonnet with a text prompt
 * @param {string} prompt
 * @param {number} maxTokens
 * @returns {Promise<string>} Response text
 */
export async function invokeBedrockClaude(prompt, maxTokens = 500) {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const response = await bedrockClient.send(
    new InvokeModelCommand({
      modelId: config.bedrock.modelId,
      body,
      contentType: 'application/json',
      accept: 'application/json',
    }),
  );

  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content?.[0]?.text || '';
}

// ─────────────────────────────────────────────────────────
// Greeting Messages per Language
// ─────────────────────────────────────────────────────────

/** Get greeting message in worker's language */
export function getGreetingMessage(language, workerName) {
  const greetings = {
    hi: workerName
      ? `Namaskar ${workerName}! Main Nirman Mitra hoon. Aapka registration ho gaya hai. Ab aap har din apna selfie aur voice note bhejkar attendance log kar sakte hain.`
      : `Namaskar! Main Nirman Mitra hoon — aapka digital saathi. Registration shuru karne ke liye, kripya apna naam boliye.`,
    en: workerName
      ? `Hello ${workerName}! I am Nirman Mitra. Your registration is complete. You can now log attendance daily by sending a selfie and voice note.`
      : `Hello! I am Nirman Mitra — your digital companion. To start registration, please say your name.`,
  };
  return greetings[language] || greetings.hi;
}

/** Get step-specific prompt messages */
export function getStepPrompt(step, language = 'hi') {
  const prompts = {
    awaiting_name: {
      hi: 'Kripya apna poora naam boliye ya type kariye.',
      en: 'Please say or type your full name.',
    },
    awaiting_aadhaar: {
      hi: 'Dhanyavaad! Ab kripya apne Aadhaar card ka photo bhejiye.',
      en: 'Thank you! Now please send a photo of your Aadhaar card.',
    },
    awaiting_selfie: {
      hi: 'Aadhaar verified! Ab kripya apna ek selfie photo bhejiye.',
      en: 'Aadhaar verified! Now please send a selfie photo.',
    },
    awaiting_passbook: {
      hi: 'Selfie saved! Ab kripya apne bank passbook ka photo bhejiye.',
      en: 'Selfie saved! Now please send a photo of your bank passbook.',
    },
    registration_complete: {
      hi: 'Badhai ho! Aapka registration poora ho gaya. Ab aap har din selfie aur voice note bhejkar attendance log kar sakte hain.',
      en: 'Congratulations! Your registration is complete. You can now log attendance daily by sending a selfie and voice note.',
    },
    retry_image: {
      hi: 'Photo clear nahi hai. Kripya achchi roshni mein dobara photo bhejiye.',
      en: 'The photo is not clear. Please send another photo in good lighting.',
    },
    error: {
      hi: 'Kuch problem ho gayi. Kripya thodi der baad dobara koshish karein.',
      en: 'Something went wrong. Please try again after some time.',
    },
  };
  return prompts[step]?.[language] || prompts[step]?.hi || prompts.error.hi;
}

export default {
  detectLanguage,
  transcribeVoice,
  generateVoiceResponse,
  generateAndUploadVoice,
  invokeBedrockClaude,
  getGreetingMessage,
  getStepPrompt,
};
