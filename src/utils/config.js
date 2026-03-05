/**
 * Nirman Mitra — Configuration Manager
 * Reads all environment variables from SAM template globals.
 * Provides demo mode toggle and utility helpers.
 */

const config = Object.freeze({
  // Environment
  environment: process.env.ENVIRONMENT || 'dev',
  certificateThreshold: parseInt(process.env.CERTIFICATE_THRESHOLD || '3', 10),

  // DynamoDB Tables
  tables: {
    workers: process.env.WORKERS_TABLE || 'NirmanMitra-Workers-dev',
    attendance: process.env.ATTENDANCE_TABLE || 'NirmanMitra-AttendanceLogs-dev',
    sites: process.env.SITES_TABLE || 'NirmanMitra-Sites-dev',
    certificates: process.env.CERTIFICATES_TABLE || 'NirmanMitra-Certificates-dev',
    documents: process.env.DOCUMENTS_TABLE || 'NirmanMitra-Documents-dev',
    conversation: process.env.CONVERSATION_TABLE || 'NirmanMitra-ConversationState-dev',
  },

  // S3 Buckets
  buckets: {
    mediaRaw: process.env.MEDIA_RAW_BUCKET || 'nirman-mitra-media-raw',
    mediaProcessed: process.env.MEDIA_PROCESSED_BUCKET || 'nirman-mitra-media-processed',
    certificates: process.env.CERTIFICATES_BUCKET || 'nirman-mitra-certificates',
  },

  // KMS
  aadhaarKmsKey: process.env.AADHAAR_KMS_KEY || '',

  // WhatsApp
  whatsapp: {
    apiToken: process.env.WHATSAPP_API_TOKEN || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'nirman-mitra-verify-token',
    apiBaseUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  },

  // SQS
  queues: {
    processing: process.env.PROCESSING_QUEUE_URL || '',
    dlq: process.env.DLQ_URL || '',
  },

  // Step Functions
  stepFunctions: {
    onboardingFlow: process.env.ONBOARDING_FLOW_ARN || '',
    attendanceFlow: process.env.ATTENDANCE_FLOW_ARN || '',
    certificateFlow: process.env.CERTIFICATE_FLOW_ARN || '',
  },

  // Rekognition
  rekognitionCollectionId: process.env.REKOGNITION_COLLECTION_ID || 'nirman-mitra-workers',

  // Bedrock
  bedrock: {
    modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
    region: process.env.AWS_REGION || 'ap-south-1',
  },

  // Polly language → voice mapping (Neural voices for Indian languages)
  pollyVoices: {
    hi: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' },
    en: { voiceId: 'Kajal', engine: 'neural', languageCode: 'en-IN' },
    ta: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' }, // fallback
    te: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' }, // fallback
    kn: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' }, // fallback
    bn: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' }, // fallback
    mr: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' }, // fallback
    gu: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' }, // fallback
    ml: { voiceId: 'Kajal', engine: 'neural', languageCode: 'hi-IN' }, // fallback
  },
});

/** Check if running in demo/dev mode (only true when running locally, not on Lambda) */
export function isDemoMode() {
  return !process.env.AWS_LAMBDA_FUNCTION_NAME && config.environment === 'dev';
}

/** Get certificate threshold (3 for demo, 90 for prod) */
export function getCertificateThreshold() {
  return config.certificateThreshold;
}

/** Build standard CORS headers for API responses */
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Content-Type': 'application/json',
  };
}

/** Build a standard API response */
export function apiResponse(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body),
  };
}

export default config;
