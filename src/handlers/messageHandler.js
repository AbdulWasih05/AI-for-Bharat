/**
 * Nirman Mitra — Message Handler (WhatsApp Webhook)
 * Central router: receives all WhatsApp messages and routes to appropriate flows.
 * Per PRD §7.3: POST /webhook/whatsapp → MessageHandler
 *
 * Routing logic:
 * 1. New worker (no phone match) → Registration flow
 * 2. Onboarding worker → Route by conversation state step
 * 3. Active worker → Attendance check-in (Triple Verification) / progress queries
 */

import config, { apiResponse } from '../utils/config.js';
import { getWorkerByPhone, getConversationState, saveConversationState, getItem } from '../utils/dynamodb.js';
import { parseWebhookMessage, downloadMedia, sendTextMessage, sendAudioMessage } from '../utils/whatsapp.js';
import { uploadWorkerMedia } from '../utils/s3.js';
import {
  handleGreeting,
  handleNameCapture,
  handleAadhaarUpload,
  handleSelfieCapture,
  handleBankPassbook,
  finalizeRegistration,
} from '../services/registration.js';
import { transcribeVoice, generateAndUploadVoice } from '../services/voiceProcessor.js';
import { handler as attendanceHandler } from './attendanceProcessor.js';
import { handler as certificateHandler } from './certificateGenerator.js';

export const handler = async (event) => {
  const method = event.httpMethod || event.requestContext?.http?.method;

  try {
    if (method === 'GET') {
      return handleWebhookVerification(event);
    }

    if (method === 'POST') {
      return await handleIncomingMessage(event);
    }

    return apiResponse(405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('MessageHandler error:', err);
    return apiResponse(500, { error: 'Internal server error' });
  }
};

// ─────────────────────────────────────────────────────────
// GET — WhatsApp Webhook Verification
// ─────────────────────────────────────────────────────────

function handleWebhookVerification(event) {
  const params = event.queryStringParameters || {};
  const mode = params['hub.mode'];
  const token = params['hub.verify_token'];
  const challenge = params['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    console.log('Webhook verification successful');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: challenge,
    };
  }

  console.warn('Webhook verification failed — token mismatch');
  return apiResponse(403, { error: 'Verification failed' });
}

// ─────────────────────────────────────────────────────────
// POST — Incoming WhatsApp Message
// ─────────────────────────────────────────────────────────

async function handleIncomingMessage(event) {
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  // Parse the WhatsApp webhook payload
  const message = parseWebhookMessage(body);
  if (!message) {
    // Not a message event (could be status update) — acknowledge
    return apiResponse(200, { status: 'not_a_message' });
  }

  console.log(`Incoming ${message.type} from ${message.from}:`, JSON.stringify(message).substring(0, 200));

  const phoneNumber = message.from;

  // Look up worker by phone number
  const existingWorker = await getWorkerByPhone(phoneNumber);

  if (!existingWorker) {
    // New worker — start registration
    return await handleNewWorker(phoneNumber, message);
  }

  // Existing worker — route based on profile status
  const { profile_status, worker_id: workerId } = existingWorker;

  if (profile_status === 'onboarding') {
    return await handleOnboardingWorker(workerId, existingWorker, message);
  }

  if (profile_status === 'active') {
    return await handleActiveWorker(workerId, existingWorker, message);
  }

  // Unknown status
  return apiResponse(200, { status: 'unknown_profile_status' });
}

// ─────────────────────────────────────────────────────────
// Route: New Worker (Registration Start)
// ─────────────────────────────────────────────────────────

async function handleNewWorker(phoneNumber, message) {
  const textContent = message.text || message.caption || '';

  const result = await handleGreeting(phoneNumber, textContent);

  // Send response via WhatsApp
  await sendTextMessage(phoneNumber, result.responseText);
  if (result.audioUrl) {
    await sendAudioMessage(phoneNumber, result.audioUrl);
  }

  return apiResponse(200, {
    status: 'greeting_sent',
    workerId: result.workerId,
    isExisting: result.isExisting,
  });
}

// ─────────────────────────────────────────────────────────
// Route: Onboarding Worker (In-Progress Registration)
// ─────────────────────────────────────────────────────────

async function handleOnboardingWorker(workerId, worker, message) {
  const phoneNumber = message.from;
  const language = worker.preferred_language || 'hi';

  // Get current conversation state
  const state = await getConversationState(workerId);
  const currentStep = state?.current_step || 'awaiting_name';
  const retryCount = state?.retry_count || 0;
  const sessionId = state?.session_id || worker.worker_id;

  console.log(`Onboarding step for ${workerId}: ${currentStep}, message type: ${message.type}`);

  let result;

  try {
    switch (currentStep) {
      case 'awaiting_name':
        result = await processNameStep(workerId, message, language);
        break;

      case 'awaiting_aadhaar':
        result = await processAadhaarStep(workerId, message, language, retryCount);
        break;

      case 'awaiting_selfie':
        result = await processSelfieStep(workerId, message, language);
        break;

      case 'awaiting_passbook':
        result = await processPassbookStep(workerId, message, language);
        break;

      case 'finalizing':
        result = await finalizeRegistration(workerId, language);
        result.nextStep = 'completed';
        break;

      default:
        result = {
          responseText: language === 'en'
            ? 'Please send your name to continue registration.'
            : 'Kripya apna naam bhejiye registration jari rakhne ke liye.',
          nextStep: 'awaiting_name',
        };
    }

    // Update conversation state with next step
    if (result.nextStep && result.nextStep !== 'completed') {
      await saveConversationState(workerId, sessionId, {
        current_step: result.nextStep,
        preferred_language: language,
        retry_count: result.nextStep === currentStep ? retryCount + 1 : 0,
      });
    }

    // Send response
    await sendTextMessage(phoneNumber, result.responseText);
    if (result.audioUrl) {
      await sendAudioMessage(phoneNumber, result.audioUrl);
    }

    return apiResponse(200, {
      status: 'onboarding_step_processed',
      step: currentStep,
      nextStep: result.nextStep,
    });
  } catch (err) {
    console.error(`Error in onboarding step ${currentStep}:`, err);

    const errorText = language === 'en'
      ? 'Something went wrong. Please try again.'
      : 'Kuch problem ho gayi. Kripya dobara koshish karein.';
    await sendTextMessage(phoneNumber, errorText);

    return apiResponse(200, { status: 'error', step: currentStep, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────
// Step Processors
// ─────────────────────────────────────────────────────────

async function processNameStep(workerId, message, language) {
  let audioBuffer = null;
  let textMessage = null;

  if (message.type === 'audio') {
    const media = await downloadMedia(message.mediaId);
    audioBuffer = media.buffer;
  } else if (message.type === 'text') {
    textMessage = message.text;
  } else {
    // Unsupported type for this step
    return {
      responseText: language === 'en'
        ? 'Please say or type your name.'
        : 'Kripya apna naam boliye ya type kariye.',
      nextStep: 'awaiting_name',
    };
  }

  return handleNameCapture(workerId, audioBuffer, textMessage, language);
}

async function processAadhaarStep(workerId, message, language, retryCount) {
  if (message.type !== 'image') {
    return {
      responseText: language === 'en'
        ? 'Please send a photo of your Aadhaar card.'
        : 'Kripya apne Aadhaar card ka photo bhejiye.',
      nextStep: 'awaiting_aadhaar',
    };
  }

  const media = await downloadMedia(message.mediaId);
  return handleAadhaarUpload(workerId, media.buffer, language, retryCount);
}

async function processSelfieStep(workerId, message, language) {
  if (message.type !== 'image') {
    return {
      responseText: language === 'en'
        ? 'Please send a selfie photo.'
        : 'Kripya apna selfie photo bhejiye.',
      nextStep: 'awaiting_selfie',
    };
  }

  const media = await downloadMedia(message.mediaId);
  return handleSelfieCapture(workerId, media.buffer, language);
}

async function processPassbookStep(workerId, message, language) {
  if (message.type !== 'image') {
    return {
      responseText: language === 'en'
        ? 'Please send a photo of your bank passbook.'
        : 'Kripya apne bank passbook ka photo bhejiye.',
      nextStep: 'awaiting_passbook',
    };
  }

  const media = await downloadMedia(message.mediaId);
  return handleBankPassbook(workerId, media.buffer, language);
}

// ─────────────────────────────────────────────────────────
// Route: Active Worker — Attendance Check-In & Queries
// ─────────────────────────────────────────────────────────

async function handleActiveWorker(workerId, worker, message) {
  const phoneNumber = message.from;
  const language = worker.preferred_language || 'hi';

  // Text messages: progress queries / help
  if (message.type === 'text') {
    return await handleActiveWorkerText(workerId, worker, message);
  }

  // Image + optional audio: attendance check-in (Triple Verification)
  if (message.type === 'image') {
    return await handleAttendanceCheckIn(workerId, worker, message, language);
  }

  // Audio only: voice query or partial check-in
  if (message.type === 'audio') {
    const responseText = language === 'en'
      ? 'To log attendance, please send a selfie along with a voice note describing your work today.'
      : 'Attendance log karne ke liye, kripya apna selfie aur aaj ke kaam ka voice note bhejiye.';
    await sendTextMessage(phoneNumber, responseText);
    return apiResponse(200, { status: 'guidance_sent', workerId });
  }

  // Location message: acknowledge and ask for selfie
  if (message.type === 'location') {
    const responseText = language === 'en'
      ? 'Location received! Now send a selfie and voice note to complete attendance.'
      : 'Location mil gaya! Ab selfie aur voice note bhejiye attendance poora karne ke liye.';
    await sendTextMessage(phoneNumber, responseText);
    return apiResponse(200, { status: 'location_received', workerId });
  }

  const responseText = language === 'en'
    ? 'Send a selfie + voice note to log attendance, or type "progress" to check your status.'
    : 'Attendance ke liye selfie + voice note bhejiye, ya "progress" type karein apna status dekhne ke liye.';
  await sendTextMessage(phoneNumber, responseText);
  return apiResponse(200, { status: 'guidance_sent', workerId });
}

// ─────────────────────────────────────────────────────────
// Active Worker: Text Message Handler (Progress / Help)
// ─────────────────────────────────────────────────────────

async function handleActiveWorkerText(workerId, worker, message) {
  const phoneNumber = message.from;
  const language = worker.preferred_language || 'hi';
  const text = (message.text || '').toLowerCase().trim();

  const daysLogged = worker.total_days_logged || 0;
  const threshold = config.certificateThreshold;
  const daysRemaining = Math.max(0, threshold - daysLogged);

  // Progress query
  if (text.includes('progress') || text.includes('status') || text.includes('kitne din') || text.includes('days')) {
    const responseText = language === 'en'
      ? `${worker.name || ''}, you have logged ${daysLogged} of ${threshold} days (${Math.round((daysLogged / threshold) * 100)}%). ${daysRemaining > 0 ? `${daysRemaining} days remaining.` : 'Certificate eligible!'}`
      : `${worker.name || ''}, aapne ${threshold} mein se ${daysLogged} din log kiye hain (${Math.round((daysLogged / threshold) * 100)}%). ${daysRemaining > 0 ? `${daysRemaining} din aur baaki hain.` : 'Certificate ke liye eligible hain!'}`;
    await sendTextMessage(phoneNumber, responseText);
    return apiResponse(200, { status: 'progress_sent', workerId, daysLogged, daysRemaining });
  }

  // Help / default
  const responseText = language === 'en'
    ? `Hello ${worker.name || ''}! You have ${daysLogged} days logged. Send a selfie + voice note to log today's attendance. Type "progress" to check status.`
    : `Namaskar ${worker.name || ''}! Aapke ${daysLogged} din log hain. Aaj ki attendance ke liye selfie + voice note bhejiye. "progress" type karein status dekhne ke liye.`;
  await sendTextMessage(phoneNumber, responseText);
  return apiResponse(200, { status: 'help_sent', workerId });
}

// ─────────────────────────────────────────────────────────
// Active Worker: Attendance Check-In (Triple Verification)
// ─────────────────────────────────────────────────────────

async function handleAttendanceCheckIn(workerId, worker, message, language) {
  const phoneNumber = message.from;

  try {
    // Step 1: Download and upload selfie to S3
    const media = await downloadMedia(message.mediaId);
    const uploadResult = await uploadWorkerMedia(workerId, 'checkin-selfie', media.buffer, 'image/jpeg');

    // Step 2: Extract voice transcription from caption (if present)
    // In real usage, worker sends image with voice note caption or separate audio
    const voiceTranscription = message.caption || '';

    // Step 3: Extract GPS (from message location or demo defaults)
    const latitude = message.latitude || (config.environment === 'dev' ? 28.6139 : null);
    const longitude = message.longitude || (config.environment === 'dev' ? 77.2090 : null);

    // Step 4: Run Triple Verification locally (in production, Step Functions orchestrates this)
    // Run face + geo in parallel, then voice, then merge
    const [faceResult, geoResult, voiceResult] = await Promise.all([
      attendanceHandler({ task: 'face_verify', workerId, selfieKey: uploadResult.key, bucket: config.buckets.mediaRaw }),
      attendanceHandler({ task: 'geo_verify', workerId, latitude, longitude }),
      attendanceHandler({ task: 'voice_verify', workerId, voiceTranscription: voiceTranscription || 'construction work at site', language }),
    ]);

    // Step 5: Merge and decide
    const decision = await attendanceHandler({
      task: 'merge_decision',
      workerId,
      faceResult,
      geoResult,
      voiceResult,
      language,
    });

    // Step 6: Send appropriate response
    let responseText;

    if (decision.status === 'duplicate') {
      responseText = language === 'en'
        ? 'Your attendance is already logged for today.'
        : 'Aapki aaj ki attendance pehle se log ho chuki hai.';
    } else if (decision.status === 'auto_approved') {
      responseText = language === 'en'
        ? `Attendance verified! Day ${decision.totalDaysLogged} logged. ${decision.daysRemaining} days remaining.${decision.certificateEligible ? ' Certificate eligible!' : ''}`
        : `Attendance verified! Din ${decision.totalDaysLogged} log hua. ${decision.daysRemaining} din aur baaki.${decision.certificateEligible ? ' Certificate ke liye eligible!' : ''}`;
    } else if (decision.status === 'pending_review') {
      responseText = language === 'en'
        ? 'Attendance submitted for admin review. You will be notified once reviewed.'
        : 'Attendance admin review ke liye bhej di gayi hai. Review hone par aapko bataya jayega.';
    } else {
      responseText = language === 'en'
        ? 'Attendance could not be verified. Please send a clearer selfie and voice note.'
        : 'Attendance verify nahi ho saki. Kripya clear selfie aur voice note dobara bhejiye.';
    }

    await sendTextMessage(phoneNumber, responseText);

    // Generate voice confirmation for approved
    if (decision.status === 'auto_approved') {
      const audioUrl = await generateAndUploadVoice(workerId, responseText, language, 'attendance-confirmed');
      if (audioUrl) {
        await sendAudioMessage(phoneNumber, audioUrl);
      }

      // Check if worker is now eligible for certificate
      if (decision.certificateEligible) {
        await triggerCertificateGeneration(workerId, phoneNumber, language);
      }
    }

    return apiResponse(200, {
      status: 'attendance_processed',
      workerId,
      verificationStatus: decision.status,
      confidence: decision.confidence,
      daysLogged: decision.totalDaysLogged,
      daysRemaining: decision.daysRemaining,
      certificateEligible: decision.certificateEligible || false,
    });
  } catch (err) {
    console.error('Attendance check-in error:', err);
    const errorText = language === 'en'
      ? 'Something went wrong with attendance. Please try again.'
      : 'Attendance mein kuch problem ho gayi. Kripya dobara koshish karein.';
    await sendTextMessage(phoneNumber, errorText);
    return apiResponse(200, { status: 'error', workerId, error: err.message });
  }
}

// ─────────────────────────────────────────────────────────
// Certificate Generation Trigger
// ─────────────────────────────────────────────────────────

async function triggerCertificateGeneration(workerId, phoneNumber, language) {
  try {
    console.log(`Triggering certificate generation for ${workerId}`);

    const result = await certificateHandler({ task: 'generate', workerId, language });

    if (result.success) {
      const certText = language === 'en'
        ? `Congratulations! Your Smart Certificate is ready! BOCW Ref: ${result.bocwReference}. Download: ${result.downloadUrl}`
        : `Badhai ho! Aapka Smart Certificate taiyar hai! BOCW Ref: ${result.bocwReference}. Download: ${result.downloadUrl}`;
      await sendTextMessage(phoneNumber, certText);

      const audioUrl = await generateAndUploadVoice(workerId, certText, language, 'certificate-ready');
      if (audioUrl) {
        await sendAudioMessage(phoneNumber, audioUrl);
      }
    }
  } catch (err) {
    console.error('Certificate generation failed:', err.message);
    // Non-blocking: attendance is already logged, certificate can be retried
  }
}
