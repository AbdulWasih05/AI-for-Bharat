/**
 * Nirman Mitra — KMS Utility
 * Aadhaar encrypt/decrypt using dedicated CMK.
 * Per PRD §8: Only encrypted binary + last 4 digits stored.
 */

import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';
import config, { isDemoMode } from './config.js';

const IS_DEMO = isDemoMode();
const kmsClient = IS_DEMO ? null : new KMSClient({ region: config.bedrock.region });

/**
 * Encrypt a full Aadhaar number using the dedicated CMK
 * @param {string} aadhaarNumber - 12-digit Aadhaar number (plain text)
 * @returns {Promise<string>} Base64-encoded ciphertext
 */
export async function encryptAadhaar(aadhaarNumber) {
  if (IS_DEMO) {
    // Demo: simulate encryption with base64 encoding (NOT secure — demo only)
    console.log('[MockKMS] Encrypting Aadhaar');
    return Buffer.from(`demo-encrypted:${aadhaarNumber}`).toString('base64');
  }

  const plaintext = new TextEncoder().encode(aadhaarNumber);

  const result = await kmsClient.send(
    new EncryptCommand({
      KeyId: config.aadhaarKmsKey,
      Plaintext: plaintext,
    }),
  );

  // Convert ciphertext to base64 for DynamoDB storage
  return Buffer.from(result.CiphertextBlob).toString('base64');
}

/**
 * Decrypt an Aadhaar ciphertext back to plain text
 * @param {string} ciphertextBase64 - Base64-encoded ciphertext
 * @returns {Promise<string>} Decrypted 12-digit Aadhaar number
 */
export async function decryptAadhaar(ciphertextBase64) {
  if (IS_DEMO) {
    const decoded = Buffer.from(ciphertextBase64, 'base64').toString();
    return decoded.replace('demo-encrypted:', '');
  }

  const ciphertext = Buffer.from(ciphertextBase64, 'base64');

  const result = await kmsClient.send(
    new DecryptCommand({
      CiphertextBlob: ciphertext,
    }),
  );

  return new TextDecoder().decode(result.Plaintext);
}

/**
 * Mask Aadhaar number showing only last 4 digits
 * @param {string} aadhaarNumber - Full 12-digit number
 * @returns {string} Masked format: XXXX-XXXX-1234
 */
export function maskAadhaar(aadhaarNumber) {
  const clean = aadhaarNumber.replace(/\s|-/g, '');
  if (clean.length !== 12) return 'XXXX-XXXX-XXXX';
  const last4 = clean.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

/**
 * Extract last 4 digits from Aadhaar number
 * @param {string} aadhaarNumber
 * @returns {string}
 */
export function getAadhaarLast4(aadhaarNumber) {
  const clean = aadhaarNumber.replace(/\s|-/g, '');
  return clean.slice(-4);
}

export default {
  encryptAadhaar,
  decryptAadhaar,
  maskAadhaar,
  getAadhaarLast4,
};
