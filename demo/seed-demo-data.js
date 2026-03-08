/**
 * Nirman Mitra — Demo Seed Data Script
 *
 * Seeds DynamoDB tables with rich demo data.
 * Run with: node demo/seed-demo-data.js
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION || 'ap-south-1';

const TABLE_NAMES = {
  sites: process.env.SITES_TABLE || 'NirmanMitra-Sites-dev',
  workers: process.env.WORKERS_TABLE || 'NirmanMitra-Workers-dev',
  attendance: process.env.ATTENDANCE_TABLE || 'NirmanMitra-AttendanceLogs-dev',
};

const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

async function putItem(tableName, item) {
  console.log(`  -> ${tableName}: ${item.name || item.site_name || item.worker_id || item.log_date}`);
  await docClient.send(new PutCommand({ TableName: tableName, Item: item }));
}

// --- Sites ---

const sites = [
  {
    site_id: 'site-001',
    site_name: 'Metro Phase-III Corridor, Delhi',
    geo_location: { latitude: 28.6139, longitude: 77.209 },
    radius_meters: 500,
    is_active: 'true',
    address: 'Janakpuri West, New Delhi',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    site_id: 'site-002',
    site_name: 'NH-48 Flyover Extension, Gurugram',
    geo_location: { latitude: 28.4595, longitude: 77.0266 },
    radius_meters: 600,
    is_active: 'true',
    address: 'Sector 29, Gurugram',
    created_at: '2026-01-20T00:00:00.000Z',
  },
  {
    site_id: 'site-003',
    site_name: 'Smart City Housing Block 7, Pune',
    geo_location: { latitude: 18.5204, longitude: 73.8567 },
    radius_meters: 400,
    is_active: 'true',
    address: 'Hinjewadi, Pune',
    created_at: '2026-02-01T00:00:00.000Z',
  },
];

// --- Workers ---

const workers = [
  {
    worker_id: 'W-1001',
    phone_number: '919876543210',
    name: 'Ram Kumar Singh',
    preferred_language: 'hi',
    profile_status: 'active',
    total_days_logged: 45,
    aadhaar_last4: '4321',
    face_vector: 'enrolled-face-W1001',
    bank_account_hash: 'hash-bank-W1001',
    registration_started: '2026-01-16T09:00:00.000Z',
    registration_completed: '2026-01-16T09:20:00.000Z',
    created_at: '2026-01-16T09:00:00.000Z',
  },
  {
    worker_id: 'W-1002',
    phone_number: '919876543211',
    name: 'Suresh Yadav',
    preferred_language: 'hi',
    profile_status: 'active',
    total_days_logged: 78,
    aadhaar_last4: '8765',
    face_vector: 'enrolled-face-W1002',
    bank_account_hash: 'hash-bank-W1002',
    registration_started: '2026-01-18T08:30:00.000Z',
    registration_completed: '2026-01-18T08:45:00.000Z',
    created_at: '2026-01-18T08:30:00.000Z',
  },
  {
    worker_id: 'W-1003',
    phone_number: '919876543212',
    name: 'Priya Devi',
    preferred_language: 'hi',
    profile_status: 'active',
    total_days_logged: 91,
    aadhaar_last4: '2345',
    face_vector: 'enrolled-face-W1003',
    bank_account_hash: 'hash-bank-W1003',
    registration_started: '2026-01-20T07:45:00.000Z',
    registration_completed: '2026-01-20T08:00:00.000Z',
    created_at: '2026-01-20T07:45:00.000Z',
  },
  {
    worker_id: 'W-1004',
    phone_number: '919876543213',
    name: 'Mohan Lal',
    preferred_language: 'te',
    profile_status: 'onboarding',
    total_days_logged: 0,
    aadhaar_last4: '6789',
    registration_started: '2026-03-05T10:00:00.000Z',
    created_at: '2026-03-05T10:00:00.000Z',
  },
  {
    worker_id: 'W-1005',
    phone_number: '919876543214',
    name: 'Sunita Ben',
    preferred_language: 'gu',
    profile_status: 'active',
    total_days_logged: 3,
    aadhaar_last4: '1122',
    face_vector: 'enrolled-face-W1005',
    bank_account_hash: 'hash-bank-W1005',
    registration_started: '2026-02-10T09:15:00.000Z',
    registration_completed: '2026-02-10T09:30:00.000Z',
    created_at: '2026-02-10T09:15:00.000Z',
  },
  {
    worker_id: 'W-1006',
    phone_number: '919876543215',
    name: 'Arjun Meena',
    preferred_language: 'hi',
    profile_status: 'active',
    total_days_logged: 22,
    aadhaar_last4: '3344',
    face_vector: 'enrolled-face-W1006',
    bank_account_hash: 'hash-bank-W1006',
    registration_started: '2026-02-15T08:00:00.000Z',
    registration_completed: '2026-02-15T08:15:00.000Z',
    created_at: '2026-02-15T08:00:00.000Z',
  },
  {
    worker_id: 'W-1007',
    phone_number: '919876543216',
    name: 'Lakshmi Naidu',
    preferred_language: 'te',
    profile_status: 'active',
    total_days_logged: 56,
    aadhaar_last4: '5566',
    face_vector: 'enrolled-face-W1007',
    bank_account_hash: 'hash-bank-W1007',
    registration_started: '2026-01-25T09:30:00.000Z',
    registration_completed: '2026-01-25T09:45:00.000Z',
    created_at: '2026-01-25T09:30:00.000Z',
  },
  {
    worker_id: 'W-1008',
    phone_number: '919876543217',
    name: 'Deepak Sharma',
    preferred_language: 'hi',
    profile_status: 'active',
    total_days_logged: 89,
    aadhaar_last4: '7788',
    face_vector: 'enrolled-face-W1008',
    bank_account_hash: 'hash-bank-W1008',
    registration_started: '2026-01-17T08:15:00.000Z',
    registration_completed: '2026-01-17T08:30:00.000Z',
    created_at: '2026-01-17T08:15:00.000Z',
  },
  {
    worker_id: 'W-1009',
    phone_number: '919876543218',
    name: 'Kavitha Rajan',
    preferred_language: 'ta',
    profile_status: 'active',
    total_days_logged: 34,
    aadhaar_last4: '9900',
    face_vector: 'enrolled-face-W1009',
    bank_account_hash: 'hash-bank-W1009',
    registration_started: '2026-02-05T07:30:00.000Z',
    registration_completed: '2026-02-05T07:45:00.000Z',
    created_at: '2026-02-05T07:30:00.000Z',
  },
  {
    worker_id: 'W-1010',
    phone_number: '919876543219',
    name: 'Rajesh Patil',
    preferred_language: 'mr',
    profile_status: 'onboarding',
    total_days_logged: 0,
    aadhaar_last4: '1234',
    registration_started: '2026-03-07T11:00:00.000Z',
    created_at: '2026-03-07T11:00:00.000Z',
  },
];

// --- Attendance Logs ---

function makeLog(workerId, date, siteId, siteName, status, faceConf, gpsDist, gpsOk, voiceOk, reason) {
  return {
    worker_id: workerId,
    log_date: date,
    site_id: siteId,
    site_name: siteName,
    verification_status: status,
    face_confidence: faceConf,
    gps_within_fence: gpsOk,
    gps_distance_meters: gpsDist,
    voice_confirmation: voiceOk,
    triple_verified: status === 'auto_approved',
    check_in_time: `${date}T08:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}:00.000Z`,
    created_at: `${date}T08:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}:00.000Z`,
    timestamp: `${date}T08:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}:00.000Z`,
    ...(reason && { review_reason: reason }),
  };
}

const attendanceLogs = [
  // Ram Kumar - mix of approved
  makeLog('W-1001', '2026-03-01', 'site-001', 'Metro Phase-III Corridor, Delhi', 'auto_approved', 96.2, 35, true, true),
  makeLog('W-1001', '2026-03-02', 'site-001', 'Metro Phase-III Corridor, Delhi', 'auto_approved', 94.8, 42, true, true),
  makeLog('W-1001', '2026-03-03', 'site-001', 'Metro Phase-III Corridor, Delhi', 'auto_approved', 91.5, 28, true, true),
  makeLog('W-1001', '2026-03-04', 'site-001', 'Metro Phase-III Corridor, Delhi', 'pending_review', 72.1, 85, true, false, 'Face confidence in review range: 72%'),
  makeLog('W-1001', '2026-03-05', 'site-001', 'Metro Phase-III Corridor, Delhi', 'auto_approved', 88.3, 50, true, true),

  // Suresh Yadav - mostly approved
  makeLog('W-1002', '2026-03-01', 'site-002', 'NH-48 Flyover Extension, Gurugram', 'auto_approved', 93.7, 22, true, true),
  makeLog('W-1002', '2026-03-02', 'site-002', 'NH-48 Flyover Extension, Gurugram', 'auto_approved', 89.1, 48, true, true),
  makeLog('W-1002', '2026-03-03', 'site-002', 'NH-48 Flyover Extension, Gurugram', 'pending_review', 65.4, 85, true, false, 'GPS near boundary: 85m'),
  makeLog('W-1002', '2026-03-05', 'site-002', 'NH-48 Flyover Extension, Gurugram', 'auto_approved', 97.2, 15, true, true),

  // Priya Devi - high performer, one pending
  makeLog('W-1003', '2026-03-01', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 98.1, 10, true, true),
  makeLog('W-1003', '2026-03-02', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 95.6, 18, true, true),
  makeLog('W-1003', '2026-03-03', 'site-003', 'Smart City Housing Block 7, Pune', 'pending_review', 58.2, 120, false, false, 'Low face confidence: 58% | Off-hours submission'),
  makeLog('W-1003', '2026-03-04', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 92.4, 25, true, true),
  makeLog('W-1003', '2026-03-05', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 96.8, 12, true, true),

  // Arjun Meena
  makeLog('W-1006', '2026-03-03', 'site-001', 'Metro Phase-III Corridor, Delhi', 'auto_approved', 87.5, 65, true, true),
  makeLog('W-1006', '2026-03-04', 'site-001', 'Metro Phase-III Corridor, Delhi', 'pending_review', 78.3, 95, true, true, 'Image quality in review range'),
  makeLog('W-1006', '2026-03-05', 'site-001', 'Metro Phase-III Corridor, Delhi', 'auto_approved', 90.1, 40, true, true),

  // Lakshmi Naidu
  makeLog('W-1007', '2026-03-01', 'site-002', 'NH-48 Flyover Extension, Gurugram', 'auto_approved', 94.3, 30, true, true),
  makeLog('W-1007', '2026-03-04', 'site-002', 'NH-48 Flyover Extension, Gurugram', 'auto_approved', 91.7, 55, true, true),
  makeLog('W-1007', '2026-03-05', 'site-002', 'NH-48 Flyover Extension, Gurugram', 'pending_review', 61.2, 120, false, true, 'GPS outside radius: 120m'),

  // Deepak Sharma - close to certificate
  makeLog('W-1008', '2026-03-01', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 95.0, 20, true, true),
  makeLog('W-1008', '2026-03-02', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 93.8, 32, true, true),
  makeLog('W-1008', '2026-03-03', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 88.6, 45, true, true),
  makeLog('W-1008', '2026-03-04', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 96.1, 18, true, true),
  makeLog('W-1008', '2026-03-05', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 91.2, 28, true, true),

  // Sunita Ben
  makeLog('W-1005', '2026-03-05', 'site-001', 'Metro Phase-III Corridor, Delhi', 'auto_approved', 85.4, 70, true, true),
  makeLog('W-1005', '2026-03-06', 'site-001', 'Metro Phase-III Corridor, Delhi', 'pending_review', 68.9, 110, true, false, 'Voice confirmation failed'),

  // Kavitha Rajan
  makeLog('W-1009', '2026-03-03', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 92.8, 38, true, true),
  makeLog('W-1009', '2026-03-04', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 90.5, 42, true, true),
  makeLog('W-1009', '2026-03-05', 'site-003', 'Smart City Housing Block 7, Pune', 'auto_approved', 88.1, 55, true, true),
];

// --- Main ---

async function main() {
  console.log('=== Nirman Mitra Demo Data Seeder ===');
  console.log(`Region: ${REGION}\n`);

  try {
    console.log('[1/3] Seeding sites...');
    for (const site of sites) await putItem(TABLE_NAMES.sites, site);

    console.log('\n[2/3] Seeding workers...');
    for (const worker of workers) await putItem(TABLE_NAMES.workers, worker);

    console.log('\n[3/3] Seeding attendance logs...');
    for (const log of attendanceLogs) await putItem(TABLE_NAMES.attendance, log);

    console.log(`\n=== Done! Seeded ${sites.length} sites, ${workers.length} workers, ${attendanceLogs.length} attendance logs ===`);
  } catch (err) {
    console.error('\nSeeding failed:', err.message);
    process.exit(1);
  }
}

main();
