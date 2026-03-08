/**
 * WhatsApp Business API Setup Helper for Nirman Mitra
 * Run: node scripts/setup-whatsapp.js
 *
 * Validates your Meta credentials and deploys them to the SAM stack.
 * Requires: WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN
 */

import axios from 'axios';

const API_TOKEN = process.env.WHATSAPP_API_TOKEN || '';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'nirman-mitra-verify-token';
const API_BASE = 'https://graph.facebook.com/v18.0';

async function main() {
  console.log('=== Nirman Mitra — WhatsApp Business API Setup ===\n');

  // Step 1: Check env vars
  if (!API_TOKEN) {
    console.log('MISSING: WHATSAPP_API_TOKEN');
    console.log('  Get it from: Meta Developer Console > Your App > WhatsApp > API Setup');
    console.log('  Set it:      export WHATSAPP_API_TOKEN="your-token-here"\n');
    process.exit(1);
  }

  if (!PHONE_NUMBER_ID) {
    console.log('MISSING: WHATSAPP_PHONE_NUMBER_ID');
    console.log('  Get it from: Meta Developer Console > Your App > WhatsApp > API Setup > Phone Number ID');
    console.log('  Set it:      export WHATSAPP_PHONE_NUMBER_ID="123456789"\n');
    process.exit(1);
  }

  console.log(`API Token:        ${API_TOKEN.substring(0, 10)}...${API_TOKEN.substring(API_TOKEN.length - 5)}`);
  console.log(`Phone Number ID:  ${PHONE_NUMBER_ID}`);
  console.log(`Verify Token:     ${VERIFY_TOKEN}\n`);

  // Step 2: Validate token by fetching phone number info
  console.log('Validating credentials...');
  try {
    const res = await axios.get(`${API_BASE}/${PHONE_NUMBER_ID}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    console.log(`  Phone number: ${res.data.display_phone_number || res.data.verified_name || 'OK'}`);
    console.log(`  Quality rating: ${res.data.quality_rating || 'N/A'}`);
    console.log('  Credentials are VALID!\n');
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    console.error(`  FAILED: ${msg}`);
    console.error('  Check your API token and Phone Number ID.\n');
    process.exit(1);
  }

  // Step 3: Print deploy command
  console.log('=== Deploy to AWS ===\n');
  console.log('Run the following command to deploy with your WhatsApp credentials:\n');
  console.log(`sam deploy \\`);
  console.log(`  --parameter-overrides \\`);
  console.log(`    WhatsAppApiToken="${API_TOKEN}" \\`);
  console.log(`    WhatsAppPhoneNumberId="${PHONE_NUMBER_ID}" \\`);
  console.log(`    WhatsAppVerifyToken="${VERIFY_TOKEN}"\n`);

  // Step 4: Print Meta webhook config
  console.log('=== Configure Meta Webhook ===\n');
  console.log('In Meta Developer Console > Your App > WhatsApp > Configuration:');
  console.log('  1. Click "Edit" on Webhook');
  console.log('  2. Callback URL:  <your-api-gateway-url>/webhook/whatsapp');
  console.log('  3. Verify Token:  ' + VERIFY_TOKEN);
  console.log('  4. Subscribe to:  messages\n');
  console.log('Your API Gateway URL is in the SAM deploy output (WhatsAppWebhookUrl).\n');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
