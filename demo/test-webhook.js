/**
 * Nirman Mitra — Webhook Test Script
 * Simulates WhatsApp webhook payloads to test the message handler locally.
 *
 * Usage: node demo/test-webhook.js [step]
 *
 * Steps: greeting | name | aadhaar | selfie | passbook | all
 * Default: all (runs full registration flow)
 *
 * Requires: sam local start-api running on port 3000
 * Or: set WEBHOOK_URL env var to your deployed endpoint
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://127.0.0.1:3000/webhook/whatsapp';

// Load mock payloads
const payloads = JSON.parse(readFileSync(join(__dirname, 'mock-whatsapp-payloads.json'), 'utf-8'));

// ─────────────────────────────────────────────────────────
// Test Runner
// ─────────────────────────────────────────────────────────

async function sendWebhook(name, payload) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📤 Sending: ${name}`);
  console.log(`${'─'.repeat(60)}`);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = body;
    }

    console.log(`📥 Status: ${response.status}`);
    console.log(`📥 Response:`, JSON.stringify(parsed, null, 2));
    return { status: response.status, body: parsed };
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    return { status: 0, error: err.message };
  }
}

async function testWebhookVerification() {
  console.log(`\n${'═'.repeat(60)}`);
  console.log('🔐 Testing Webhook Verification (GET)');
  console.log(`${'─'.repeat(60)}`);

  const url = `${WEBHOOK_URL}?hub.mode=subscribe&hub.verify_token=nirman-mitra-verify-token&hub.challenge=test_challenge_123`;

  try {
    const response = await fetch(url, { method: 'GET' });
    const body = await response.text();
    console.log(`📥 Status: ${response.status}`);
    console.log(`📥 Challenge: ${body}`);

    if (body === 'test_challenge_123') {
      console.log('✅ Webhook verification PASSED');
    } else {
      console.log('❌ Webhook verification FAILED — challenge mismatch');
    }
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────
// Registration Flow Steps
// ─────────────────────────────────────────────────────────

const steps = {
  verification: async () => {
    await testWebhookVerification();
  },

  greeting: async () => {
    await sendWebhook('Hindi Greeting (Namaste)', payloads.text_greeting_hi);
  },

  name: async () => {
    await sendWebhook('Name via Text (Ram Kumar Singh)', payloads.text_name);
  },

  aadhaar: async () => {
    await sendWebhook('Aadhaar Card Image', payloads.image_aadhaar);
  },

  selfie: async () => {
    await sendWebhook('Selfie Image', payloads.image_selfie);
  },

  passbook: async () => {
    await sendWebhook('Bank Passbook Image', payloads.image_passbook);
  },

  status: async () => {
    await sendWebhook('Status Update (non-message)', payloads.status_update);
  },
};

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

async function main() {
  const step = process.argv[2] || 'all';

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       Nirman Mitra — WhatsApp Webhook Test Runner         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`Step: ${step}`);

  if (step === 'all') {
    console.log('\n🚀 Running full registration flow...\n');

    // 0. Verify webhook
    await steps.verification();
    await delay(500);

    // 1. Status update (should be ignored)
    await steps.status();
    await delay(500);

    // 2. Greeting — starts registration
    await steps.greeting();
    await delay(1000);

    // 3. Send name
    await steps.name();
    await delay(1000);

    // 4. Send Aadhaar image
    await steps.aadhaar();
    await delay(1500);

    // 5. Send selfie
    await steps.selfie();
    await delay(1500);

    // 6. Send bank passbook
    await steps.passbook();
    await delay(1000);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ Full registration flow test complete!');
    console.log('═'.repeat(60));
  } else if (steps[step]) {
    await steps[step]();
  } else {
    console.error(`Unknown step: ${step}`);
    console.log('Available steps: verification, greeting, name, aadhaar, selfie, passbook, status, all');
    process.exit(1);
  }
}

main().catch(console.error);
