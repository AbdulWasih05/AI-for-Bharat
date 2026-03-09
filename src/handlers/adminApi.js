/**
 * Nirman Mitra — Admin API Handler
 * Dashboard stats, review queue, worker search, certificate verification.
 * Per PRD §6.6 + §7.3: Admin dashboard API endpoints.
 */

import config, { apiResponse } from '../utils/config.js';
import {
  getItem,
  queryItems,
  updateItem,
  scanTable,
  getPendingReviews,
  getWorkerByPhone,
  getWorkerAttendanceLogs,
  incrementDaysLogged,
} from '../utils/dynamodb.js';

export const handler = async (event) => {
  const path = event.path || event.rawPath || '';
  const method = event.httpMethod || event.requestContext?.http?.method;

  console.log(`AdminAPI: ${method} ${path}`);

  try {
    // Route to appropriate handler
    if (path.includes('/api/admin/dashboard')) {
      return await getDashboardStats();
    }

    if (path.includes('/api/admin/workers') && !path.includes('/api/admin/worker/')) {
      return await listWorkers();
    }

    if (path.includes('/api/admin/review-queue')) {
      return await getReviewQueue(event);
    }

    if (path.includes('/api/admin/review/') && method === 'PUT') {
      return await handleReviewAction(event);
    }

    if (path.includes('/api/admin/worker/')) {
      return await getWorkerProfile(event);
    }

    if (path.includes('/api/worker/') && path.includes('/progress')) {
      return await getWorkerProgress(event);
    }

    if (path.includes('/api/certificate/') && path.includes('/verify')) {
      return await verifyCertificate(event);
    }

    if (path.includes('/api/admin/attendance-trends')) {
      return await getAttendanceTrends();
    }

    if (path.includes('/api/admin/confidence-stats')) {
      return await getConfidenceStats();
    }

    if (path.includes('/api/admin/site-breakdown')) {
      return await getSiteBreakdown();
    }

    return apiResponse(404, { error: 'Route not found' });
  } catch (err) {
    console.error('AdminAPI error:', err);
    return apiResponse(500, { error: 'Internal server error', message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/admin/dashboard — Aggregate Stats
// ─────────────────────────────────────────────────────────

async function getDashboardStats() {
  // Get counts from each table
  const [workers, pendingReviews, allLogs, allSites] = await Promise.all([
    scanTable(config.tables.workers, { Select: 'COUNT' }),
    getPendingReviews(100),
    scanTable(config.tables.attendance),
    scanTable(config.tables.sites),
  ]);

  // Aggregate worker stats
  const allWorkers = await scanTable(config.tables.workers);
  const activeWorkers = allWorkers.filter((w) => w.profile_status === 'active');
  const onboardingWorkers = allWorkers.filter((w) => w.profile_status === 'onboarding');
  const totalDaysLogged = activeWorkers.reduce((sum, w) => sum + (w.total_days_logged || 0), 0);

  // Attendance trends (last 7 days)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const trends = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = allLogs.filter((l) => l.log_date === dateStr).length;
    trends.push({ day: dayNames[d.getDay()], date: dateStr, logs: count });
  }

  // Confidence distribution
  let autoApproved = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  for (const log of allLogs) {
    const status = log.verification_status;
    if (status === 'auto_approved' || status === 'approved') autoApproved++;
    else if (status === 'pending_review') pendingCount++;
    else if (status === 'rejected') rejectedCount++;
  }
  const total = autoApproved + pendingCount + rejectedCount || 1;
  const distribution = [
    { name: 'Auto-Approved (>=80%)', value: Math.round((autoApproved / total) * 100), color: '#22c55e' },
    { name: 'Pending Review (60-80%)', value: Math.round((pendingCount / total) * 100), color: '#f59e0b' },
    { name: 'Rejected (<60%)', value: Math.round((rejectedCount / total) * 100), color: '#ef4444' },
  ];

  // Site breakdown
  const siteNames = {};
  for (const site of allSites) {
    siteNames[site.site_id] = site.site_name || site.name || site.site_id;
  }
  const siteCounts = {};
  for (const log of allLogs) {
    const sid = log.site_id || 'unknown';
    const name = siteNames[sid] || sid;
    siteCounts[name] = (siteCounts[name] || 0) + 1;
  }
  const sites = Object.entries(siteCounts)
    .map(([name, count]) => ({ site: name, logs: count }))
    .sort((a, b) => b.logs - a.logs);

  return apiResponse(200, {
    totalWorkers: allWorkers.length,
    activeWorkers: activeWorkers.length,
    onboardingWorkers: onboardingWorkers.length,
    pendingReviews: pendingReviews.length,
    totalDaysLogged,
    averageDaysPerWorker: activeWorkers.length > 0
      ? Math.round(totalDaysLogged / activeWorkers.length)
      : 0,
    trends,
    distribution,
    sites,
  });
}

// ─────────────────────────────────────────────────────────
// GET /api/admin/workers — List All Workers
// ─────────────────────────────────────────────────────────

async function listWorkers() {
  const allWorkers = await scanTable(config.tables.workers);
  const workers = allWorkers.map((w) => ({
    worker_id: w.worker_id,
    name: w.name,
    phone_number: w.phone_number ? `****${w.phone_number.slice(-4)}` : '',
    preferred_language: w.preferred_language,
    profile_status: w.profile_status,
    total_days_logged: w.total_days_logged || 0,
    aadhaar_verified: !!w.aadhaar_last4,
    selfie_verified: !!w.face_vector,
    bank_verified: !!w.bank_account_hash || !!w.registration_completed,
  }));
  return apiResponse(200, { workers });
}

// ─────────────────────────────────────────────────────────
// GET /api/admin/review-queue — Pending Reviews
// ─────────────────────────────────────────────────────────

async function getReviewQueue(event) {
  const params = event.queryStringParameters || {};
  const limit = parseInt(params.limit || '20', 10);

  const items = await getPendingReviews(limit);

  // Enrich with worker info
  const enriched = await Promise.all(
    items.map(async (item) => {
      const worker = await getItem(config.tables.workers, { worker_id: item.worker_id });
      return {
        ...item,
        worker_name: worker?.name || 'Unknown',
        worker_phone: worker?.phone_number || '',
      };
    }),
  );

  return apiResponse(200, { items: enriched, count: enriched.length });
}

// ─────────────────────────────────────────────────────────
// PUT /api/admin/review/{logId} — Approve/Reject
// ─────────────────────────────────────────────────────────

/**
 * Strip HTML and script tags from a string to prevent XSS / injection.
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

async function handleReviewAction(event) {
  const pathParts = event.path.split('/');
  const logId = pathParts[pathParts.length - 1];
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  const { action, justification, workerId, logDate } = body || {};

  if (!action || !['approve', 'reject'].includes(action)) {
    return apiResponse(400, { error: 'Invalid action. Must be "approve" or "reject".' });
  }

  if (!workerId || !logDate) {
    return apiResponse(400, { error: 'Missing workerId or logDate' });
  }

  // Validate justification is required and non-empty for rejections
  if (action === 'reject') {
    if (!justification || typeof justification !== 'string' || justification.trim().length === 0) {
      return apiResponse(400, { error: 'Justification is required when rejecting a review.' });
    }
  }

  // Sanitize justification to strip HTML/script tags
  const sanitizedJustification = sanitizeString(justification || '');

  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  await updateItem(
    config.tables.attendance,
    { worker_id: workerId, log_date: logDate },
    'SET verification_status = :status, admin_action = :action, admin_justification = :just, reviewed_at = :ts',
    {
      ':status': newStatus,
      ':action': action,
      ':just': sanitizedJustification,
      ':ts': new Date().toISOString(),
    },
  );

  // Increment days logged when admin approves (matches auto_approved behavior)
  if (action === 'approve') {
    try {
      await incrementDaysLogged(workerId);
    } catch (err) {
      console.error('[AdminApi] Failed to increment days logged:', err.message);
    }
  }

  return apiResponse(200, {
    success: true,
    logId,
    action,
    newStatus,
  });
}

// ─────────────────────────────────────────────────────────
// GET /api/admin/worker/{id} — Worker Profile
// ─────────────────────────────────────────────────────────

async function getWorkerProfile(event) {
  const pathParts = event.path.split('/');
  const workerId = pathParts[pathParts.length - 1];

  const worker = await getItem(config.tables.workers, { worker_id: workerId });
  if (!worker) {
    return apiResponse(404, { error: 'Worker not found' });
  }

  // Get attendance history and documents
  const [logs, documents] = await Promise.all([
    getWorkerAttendanceLogs(workerId),
    queryItems(config.tables.documents, 'worker_id = :wid', { ':wid': workerId }),
  ]);

  // Mask sensitive data
  const safeWorker = {
    ...worker,
    aadhaar_encrypted: undefined, // never expose
    phone_number: worker.phone_number
      ? `****${worker.phone_number.slice(-4)}`
      : '',
  };

  return apiResponse(200, {
    worker: safeWorker,
    attendanceLogs: logs,
    documents: documents.map((d) => ({
      document_id: d.document_id,
      document_type: d.document_type,
      ocr_confidence: d.ocr_confidence,
      created_at: d.created_at,
    })),
  });
}

// ─────────────────────────────────────────────────────────
// GET /api/worker/{id}/progress — Worker Progress
// ─────────────────────────────────────────────────────────

async function getWorkerProgress(event) {
  const pathParts = event.path.split('/');
  // Path: /api/worker/{id}/progress — id is at index -2
  const workerId = pathParts[pathParts.length - 2];

  const worker = await getItem(config.tables.workers, { worker_id: workerId });
  if (!worker) {
    return apiResponse(404, { error: 'Worker not found' });
  }

  const daysLogged = worker.total_days_logged || 0;
  const threshold = config.certificateThreshold;
  const daysRemaining = Math.max(0, threshold - daysLogged);

  return apiResponse(200, {
    workerId,
    name: worker.name,
    daysLogged,
    daysRemaining,
    threshold,
    progress: Math.round((daysLogged / threshold) * 100),
    profileStatus: worker.profile_status,
  });
}

// ─────────────────────────────────────────────────────────
// GET /api/certificate/{id}/verify — Public QR Verification
// ─────────────────────────────────────────────────────────

async function verifyCertificate(event) {
  const pathParts = event.path.split('/');
  // Path: /api/certificate/{id}/verify — id is at index -2
  const certId = pathParts[pathParts.length - 2];

  // Search by verification hash via GSI
  const certs = await queryItems(
    config.tables.certificates,
    'verification_hash = :hash',
    { ':hash': certId },
    'VerificationHashIndex',
    { Limit: 1 },
  );

  if (certs.length === 0) {
    return apiResponse(404, {
      verified: false,
      message: 'Certificate not found or invalid hash',
    });
  }

  const cert = certs[0];
  const worker = await getItem(config.tables.workers, { worker_id: cert.worker_id });

  // Return verification info WITHOUT PII (PRD §6.4)
  return apiResponse(200, {
    verified: true,
    certificate: {
      worker_name: worker?.name || 'Unknown',
      total_verified_days: cert.total_days,
      date_range: { from: cert.date_from, to: cert.date_to },
      sites_worked: cert.sites || [],
      issued_at: cert.created_at,
      bocw_reference: cert.bocw_reference,
    },
    // Never expose: full Aadhaar, bank account, phone number
  });
}

// ─────────────────────────────────────────────────────────
// GET /api/admin/attendance-trends — Last 7 Days
// ─────────────────────────────────────────────────────────

async function getAttendanceTrends() {
  const allLogs = await scanTable(config.tables.attendance);

  // Build last 7 days
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = allLogs.filter((l) => l.log_date === dateStr).length;
    days.push({ day: dayNames[d.getDay()], date: dateStr, logs: count });
  }

  return apiResponse(200, { trends: days });
}

// ─────────────────────────────────────────────────────────
// GET /api/admin/confidence-stats — Verification Distribution
// ─────────────────────────────────────────────────────────

async function getConfidenceStats() {
  const allLogs = await scanTable(config.tables.attendance);

  let autoApproved = 0;
  let pendingReview = 0;
  let rejected = 0;

  for (const log of allLogs) {
    const status = log.verification_status;
    if (status === 'auto_approved' || status === 'approved') {
      autoApproved++;
    } else if (status === 'pending_review') {
      pendingReview++;
    } else if (status === 'rejected') {
      rejected++;
    }
  }

  const total = autoApproved + pendingReview + rejected || 1;

  return apiResponse(200, {
    distribution: [
      { name: 'Auto-Approved (>=80%)', value: Math.round((autoApproved / total) * 100), color: '#22c55e' },
      { name: 'Pending Review (60-80%)', value: Math.round((pendingReview / total) * 100), color: '#f59e0b' },
      { name: 'Rejected (<60%)', value: Math.round((rejected / total) * 100), color: '#ef4444' },
    ],
  });
}

// ─────────────────────────────────────────────────────────
// GET /api/admin/site-breakdown — Attendance by Site
// ─────────────────────────────────────────────────────────

async function getSiteBreakdown() {
  const [allLogs, allSites] = await Promise.all([
    scanTable(config.tables.attendance),
    scanTable(config.tables.sites),
  ]);

  // Build site name lookup
  const siteNames = {};
  for (const site of allSites) {
    siteNames[site.site_id] = site.site_name || site.name || site.site_id;
  }

  // Count logs per site
  const siteCounts = {};
  for (const log of allLogs) {
    const sid = log.site_id || 'unknown';
    const name = siteNames[sid] || sid;
    siteCounts[name] = (siteCounts[name] || 0) + 1;
  }

  const breakdown = Object.entries(siteCounts).map(([name, count]) => ({ site: name, logs: count }));
  breakdown.sort((a, b) => b.logs - a.logs);

  return apiResponse(200, { sites: breakdown });
}
