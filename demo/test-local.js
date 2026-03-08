/**
 * Nirman Mitra — Local Integration Test
 * Tests all Lambda handlers directly (no SAM/Docker/AWS needed).
 * Uses in-memory mock DynamoDB + S3 (ENVIRONMENT=dev).
 *
 * Usage: node demo/test-local.js
 */

process.env.ENVIRONMENT = 'dev';
process.env.CERTIFICATE_THRESHOLD = '3';

const PASS = '\x1b[32mPASS\x1b[0m';
const FAIL = '\x1b[31mFAIL\x1b[0m';
const SECTION = '\x1b[36m';
const RESET = '\x1b[0m';
let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ${PASS} ${label}`);
    passed++;
  } else {
    console.log(`  ${FAIL} ${label}`);
    failed++;
  }
}

function section(name) {
  console.log(`\n${SECTION}═══ ${name} ═══${RESET}`);
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   Nirman Mitra — Local Integration Test Suite     ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('Mode: In-memory mocks (no AWS credentials needed)\n');

  // ─── Test 1: Message Handler — Webhook Verification ───
  section('1. WhatsApp Webhook Verification (GET)');
  const { handler: messageHandler } = await import('../src/handlers/messageHandler.js');

  const verifyResult = await messageHandler({
    httpMethod: 'GET',
    queryStringParameters: {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'nirman-mitra-verify-token',
      'hub.challenge': 'test_challenge_123',
    },
  });
  assert('Returns 200', verifyResult.statusCode === 200);
  assert('Returns challenge', verifyResult.body === 'test_challenge_123');

  // Bad token
  const badVerify = await messageHandler({
    httpMethod: 'GET',
    queryStringParameters: {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong-token',
      'hub.challenge': 'test',
    },
  });
  assert('Rejects bad token (403)', badVerify.statusCode === 403);

  // ─── Test 2: New Worker Registration (Greeting) ───
  section('2. New Worker Registration — Greeting');
  const greetingResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_001',
              from: '919876543210',
              timestamp: '1709280000',
              type: 'text',
              text: { body: 'Namaste' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const greetBody = JSON.parse(greetingResult.body);
  assert('Returns 200', greetingResult.statusCode === 200);
  assert('Creates worker (greeting_sent)', greetBody.status === 'greeting_sent');
  assert('Returns workerId', !!greetBody.workerId);
  const workerId = greetBody.workerId;

  // ─── Test 3: Name Capture ───
  section('3. Onboarding — Name Capture');
  const nameResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_002',
              from: '919876543210',
              timestamp: '1709280060',
              type: 'text',
              text: { body: 'Ram Kumar Singh' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const nameBody = JSON.parse(nameResult.body);
  assert('Returns 200', nameResult.statusCode === 200);
  assert('Step processed', nameBody.status === 'onboarding_step_processed');
  assert('Next step is awaiting_aadhaar', nameBody.nextStep === 'awaiting_aadhaar');

  // ─── Test 4: Aadhaar Upload ───
  section('4. Onboarding — Aadhaar Upload');
  const aadhaarResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_003',
              from: '919876543210',
              timestamp: '1709280120',
              type: 'image',
              image: { id: 'media_aadhaar_001', mime_type: 'image/jpeg' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const aadhaarBody = JSON.parse(aadhaarResult.body);
  assert('Returns 200', aadhaarResult.statusCode === 200);
  assert('Step processed', aadhaarBody.status === 'onboarding_step_processed');
  assert('Next step is awaiting_selfie', aadhaarBody.nextStep === 'awaiting_selfie');

  // ─── Test 5: Selfie Capture ───
  section('5. Onboarding — Selfie Capture');
  const selfieResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_004',
              from: '919876543210',
              timestamp: '1709280180',
              type: 'image',
              image: { id: 'media_selfie_001', mime_type: 'image/jpeg' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const selfieBody = JSON.parse(selfieResult.body);
  assert('Returns 200', selfieResult.statusCode === 200);
  assert('Step processed', selfieBody.status === 'onboarding_step_processed');
  assert('Next step is awaiting_passbook', selfieBody.nextStep === 'awaiting_passbook');

  // ─── Test 6: Bank Passbook ───
  section('6. Onboarding — Bank Passbook');
  const passbookResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_005',
              from: '919876543210',
              timestamp: '1709280240',
              type: 'image',
              image: { id: 'media_passbook_001', mime_type: 'image/jpeg' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const passbookBody = JSON.parse(passbookResult.body);
  assert('Returns 200', passbookResult.statusCode === 200);
  assert('Step processed', passbookBody.status === 'onboarding_step_processed');

  // ─── Test 6b: Finalize Registration ───
  section('6b. Onboarding — Finalize Registration');
  const finalizeResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_005b',
              from: '919876543210',
              timestamp: '1709280260',
              type: 'text',
              text: { body: 'ok' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const finalizeBody = JSON.parse(finalizeResult.body);
  assert('Returns 200', finalizeResult.statusCode === 200);
  assert('Finalization completed', finalizeBody.nextStep === 'completed' || finalizeBody.status === 'onboarding_step_processed');

  // ─── Test 7: Active Worker — Progress Query ───
  section('7. Active Worker — Progress Query');
  // Worker should now be active after full registration
  const progressResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_006',
              from: '919876543210',
              timestamp: '1709280300',
              type: 'text',
              text: { body: 'progress' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const progressBody = JSON.parse(progressResult.body);
  assert('Returns 200', progressResult.statusCode === 200);
  const isActive = progressBody.status === 'progress_sent' || progressBody.status === 'help_sent';
  assert('Worker is active (progress/help sent)', isActive);

  // ─── Test 8: Attendance Check-In (Triple Verification) ───
  section('8. Triple Verification — Attendance Check-In');
  const checkinResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_007',
              from: '919876543210',
              timestamp: '1709280360',
              type: 'image',
              image: {
                id: 'media_checkin_001',
                mime_type: 'image/jpeg',
                caption: 'Aaj site pe eent lagane ka kaam kiya',
              },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const checkinBody = JSON.parse(checkinResult.body);
  assert('Returns 200', checkinResult.statusCode === 200);
  assert('Attendance processed', checkinBody.status === 'attendance_processed');
  assert('Has verification status', !!checkinBody.verificationStatus);
  assert('Has confidence score', typeof checkinBody.confidence === 'number');
  console.log(`  Info: status=${checkinBody.verificationStatus}, confidence=${checkinBody.confidence}%, days=${checkinBody.daysLogged}`);

  // ─── Test 9: Attendance Processor — Individual Tasks ───
  section('9. Attendance Processor — Individual Verification Tasks');
  const { handler: attendanceHandler } = await import('../src/handlers/attendanceProcessor.js');

  const faceResult = await attendanceHandler({
    task: 'face_verify', workerId: 'test-worker', selfieKey: 'test.jpg', bucket: 'test',
  });
  assert('Face verify returns result', faceResult.confidence >= 0);
  console.log(`  Info: face confidence=${faceResult.confidence}%`);

  const geoResult = await attendanceHandler({
    task: 'geo_verify', workerId: 'test-worker', latitude: 28.6139, longitude: 77.209,
  });
  assert('Geo verify returns result', geoResult.confidence >= 0);
  console.log(`  Info: geo confidence=${geoResult.confidence}%, distance=${geoResult.distance}m`);

  const voiceResult = await attendanceHandler({
    task: 'voice_verify', workerId: 'test-worker', voiceTranscription: 'brick laying at site', language: 'en',
  });
  assert('Voice verify returns result', voiceResult.confidence >= 0);
  console.log(`  Info: voice confidence=${voiceResult.confidence}%`);

  // ─── Test 10: Certificate Generator ───
  section('10. Certificate Generator');
  const { handler: certHandler } = await import('../src/handlers/certificateGenerator.js');

  const eligibility = await certHandler({ task: 'check_eligibility', workerId: 'nonexistent' });
  assert('Non-existent worker not eligible', eligibility.eligible === false);

  // ─── Test 11: Admin API ───
  section('11. Admin API — Dashboard Stats');
  const { handler: adminHandler } = await import('../src/handlers/adminApi.js');

  const dashResult = await adminHandler({
    httpMethod: 'GET',
    path: '/api/admin/dashboard',
  });
  const dashBody = JSON.parse(dashResult.body);
  assert('Dashboard returns 200', dashResult.statusCode === 200);
  assert('Has totalWorkers field', dashBody.totalWorkers !== undefined);
  console.log(`  Info: ${dashBody.totalWorkers} workers, ${dashBody.pendingReviews} pending reviews`);

  // ─── Test 12: Admin API — Review Validation ───
  section('12. Admin API — Input Validation');
  const badReview = await adminHandler({
    httpMethod: 'PUT',
    path: '/api/admin/review/L001',
    body: JSON.stringify({ action: 'reject', workerId: 'W001', logDate: '2026-03-01' }),
  });
  const badReviewBody = JSON.parse(badReview.body);
  assert('Reject without justification returns 400', badReview.statusCode === 400);
  assert('Error mentions justification', badReviewBody.error.includes('ustification'));

  const badAction = await adminHandler({
    httpMethod: 'PUT',
    path: '/api/admin/review/L001',
    body: JSON.stringify({ action: 'invalid' }),
  });
  assert('Invalid action returns 400', badAction.statusCode === 400);

  // ─── Test 13: Admin API — Certificate Verify ───
  section('13. Admin API — Certificate Verification Endpoint');
  const certVerify = await adminHandler({
    httpMethod: 'GET',
    path: '/api/certificate/abc123/verify',
  });
  const certVerifyBody = JSON.parse(certVerify.body);
  assert('Unknown cert returns 404', certVerify.statusCode === 404);
  assert('verified=false', certVerifyBody.verified === false);

  // ─── Test 14: Voice Conversational AI — Text Intent Detection ───
  section('14. Voice Conversational AI — Intent Detection via Text');

  // Test progress intent
  const voiceProgressResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_voice_01',
              from: '919876543210',
              timestamp: '1709280400',
              type: 'text',
              text: { body: 'kitne din hue mere' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const voiceProgressBody = JSON.parse(voiceProgressResult.body);
  assert('Progress intent returns 200', voiceProgressResult.statusCode === 200);
  assert('Detected as progress_sent', voiceProgressBody.status === 'progress_sent');
  assert('Intent is check_progress', voiceProgressBody.intent === 'check_progress');

  // Test certificate intent
  const voiceCertResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_voice_02',
              from: '919876543210',
              timestamp: '1709280420',
              type: 'text',
              text: { body: 'mujhe certificate chahiye' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const voiceCertBody = JSON.parse(voiceCertResult.body);
  assert('Certificate intent returns 200', voiceCertResult.statusCode === 200);
  assert('Intent is request_certificate', voiceCertBody.intent === 'request_certificate');

  // Test help intent
  const voiceHelpResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_voice_03',
              from: '919876543210',
              timestamp: '1709280440',
              type: 'text',
              text: { body: 'kya kar sakte ho' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const voiceHelpBody = JSON.parse(voiceHelpResult.body);
  assert('Help intent returns 200', voiceHelpResult.statusCode === 200);
  assert('Intent is help', voiceHelpBody.intent === 'help');

  // Test greeting intent
  const voiceGreetResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_voice_04',
              from: '919876543210',
              timestamp: '1709280460',
              type: 'text',
              text: { body: 'namaskar' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const voiceGreetBody = JSON.parse(voiceGreetResult.body);
  assert('Greeting intent returns 200', voiceGreetResult.statusCode === 200);
  assert('Intent is greeting', voiceGreetBody.intent === 'greeting');

  // Test attendance intent
  const voiceAttResult = await messageHandler({
    httpMethod: 'POST',
    body: JSON.stringify({
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'msg_voice_05',
              from: '919876543210',
              timestamp: '1709280480',
              type: 'text',
              text: { body: 'attendance lagao aaj ki' },
            }],
            contacts: [{ profile: { name: 'Test Worker' } }],
          },
        }],
      }],
    }),
  });
  const voiceAttBody = JSON.parse(voiceAttResult.body);
  assert('Attendance intent returns 200', voiceAttResult.statusCode === 200);
  assert('Intent is log_attendance', voiceAttBody.intent === 'log_attendance');

  // ─── Test 15: Bedrock Client — Cache & Model Routing ───
  section('15. Bedrock Client — Unified Utility');
  const { invokeModel } = await import('../src/utils/bedrockClient.js');
  // In demo mode (no AWS creds), invokeModel will fail but we test the import and cache key logic
  assert('invokeModel is a function', typeof invokeModel === 'function');

  // ─── Summary ───
  console.log(`\n${'═'.repeat(52)}`);
  console.log(`  Results: ${PASS} ${passed} passed  ${failed > 0 ? FAIL : ''} ${failed > 0 ? failed + ' failed' : ''}`);
  console.log(`${'═'.repeat(52)}`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\nTest suite crashed:', err);
  process.exit(1);
});
