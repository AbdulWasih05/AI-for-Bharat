# Nirman Mitra: System Design Specification

## AI-Powered Voice-First Platform for Construction Worker Welfare

**Hackathon Submission:** AI for Bharat / AWS Innovation Challenge
**Version:** 1.0
**Date:** February 15, 2026
**Architecture Type:** Cloud-Native, Event-Driven Serverless, Voice-First AI
**Target Scale:** 71 million construction workers across 35 state BOCW boards
**Technology Stack:** AWS Serverless (Lambda, Step Functions, DynamoDB, S3), Amazon Bedrock, Lex V2, Polly, Textract, Rekognition, WhatsApp Business API, Amazon Connect

---

## 1. System Overview

### 1.1 Platform Goals

**Primary Objectives:**

- **Voice-First Access**: Enable construction workers with limited literacy to document work through voice and selfies
- **AI Verification**: Automate attendance and document verification using facial recognition, OCR, and NLP
- **Welfare Enablement**: Generate tamper-proof Smart Certificates after 90 days for BOCW benefit access
- **Privacy-by-Design**: Encrypt PII at rest, minimize data retention, and enforce consent-based access

**Technical Goals:**

- **Offline Tolerance**: Queue-based architecture for intermittent connectivity at construction sites
- **Scalability**: Serverless auto-scaling for concurrent worker submissions
- **Performance**: Voice response generation within 3 seconds on 3G networks
- **Security**: KMS-encrypted Aadhaar, CloudTrail audit trails, MFA for admin access

### 1.2 Innovation Highlights

- **Multimodal AI Pipeline**: Selfie (Rekognition) + Voice (Bedrock/Lex) + Documents (Textract) processed in parallel via Step Functions
- **Confidence-Based Routing**: Tiered thresholds (60/70/80%) route decisions between auto-approval, human review, and rejection
- **WhatsApp-Native**: No app download required — workers interact entirely through WhatsApp and IVR
- **Techno-Legal Certificate**: QR-verified, SHA-256 signed Smart Certificates accepted by BOCW boards

## 2. Architecture Overview

### 2.1 Architectural Principles

- **Voice-First**: All interactions completable through voice; visual interfaces are optional
- **Offline-Tolerant**: SQS queues with DLQ handle intermittent connectivity
- **Privacy-by-Design**: PII encryption at rest, minimal data retention, consent-based access
- **Graceful Degradation**: System continues with reduced accuracy rather than failing
- **Multilingual**: Native support for 9 Indian languages with automatic language detection

### 2.2 Technology Stack

```
AWS Serverless Architecture
├── API Gateway (REST/WebSocket — routing, rate limiting)
├── Lambda Functions (Node.js/Python — business logic)
├── Step Functions (Workflow orchestration)
├── DynamoDB (NoSQL primary store — 6 tables)
├── S3 (Media storage — 3 buckets)
├── SQS (Message queuing — retry + DLQ)
└── KMS (Aadhaar encryption keys)

AI/ML Services
├── Bedrock (Claude 3.5 Sonnet — conversational AI, intent extraction)
├── Lex V2 (Intent recognition, slot filling)
├── Polly (Text-to-speech — neural voices, 9 languages)
├── Textract (OCR — Aadhaar, bank passbook extraction)
├── Rekognition (Facial verification, image quality)
└── Translate (Regional language document translation)

User Channels
├── WhatsApp Business API (Primary — voice, image, text)
├── Amazon Connect IVR (Secondary — phone-based access)
└── Admin Web Dashboard (React — monitoring, review)
```

### 2.3 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER CHANNELS                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  WhatsApp    │  │  IVR/Phone   │  │ Admin Web    │          │
│  │  Business    │  │  (Connect)   │  │  Dashboard   │          │
│  │              │  │              │  │              │          │
│  │ • Voice Note │  │ • Voice Cmds │  │ • Review Q   │          │
│  │ • Selfie     │  │ • IVR Menu   │  │ • Statistics │          │
│  │ • Documents  │  │ • Status     │  │ • Reports    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (REST/WebSocket)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Auth      │  │    Rate     │  │   Request   │             │
│  │ Validation   │  │  Limiting   │  │   Routing   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AWS LAMBDA FUNCTIONS                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Message     │  │  Attendance  │  │  Document    │          │
│  │  Handler     │  │  Processor   │  │  Verifier    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Certificate  │  │ Notification │  │  Admin API   │          │
│  │  Generator   │  │   Sender     │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│              AWS STEP FUNCTIONS (ORCHESTRATION)                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Onboarding Flow  │ Attendance Flow  │ Certificate Flow  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI/ML SERVICES                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Bedrock  │ │  Lex V2  │ │  Polly   │ │ Textract │          │
│  │ (Claude) │ │ (Intent) │ │  (TTS)   │ │  (OCR)   │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────┐ ┌──────────┐                                     │
│  │Rekognition│ │Translate │                                     │
│  │ (Face)   │ │ (i18n)   │                                     │
│  └──────────┘ └──────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  DynamoDB    │  │      S3      │  │     KMS      │          │
│  │  (6 Tables)  │  │ (3 Buckets)  │  │ (2 Keys)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │     SQS      │  │ CloudTrail   │                             │
│  │ (Queue+DLQ)  │  │  (Audit)     │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Data Flow Pipelines

### 3.1 Attendance Logging Flow (Selfie + Voice Note → Verified Log)

```
Worker sends selfie + voice note via WhatsApp
                    │
                    ▼
         ┌──────────────────┐
         │  Message Handler  │  Receives webhook, stores raw files in S3
         │     Lambda        │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Step Function    │  Initiates PARALLEL processing
         │  AttendanceFlow   │
         └────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
  ┌───────────┐       ┌───────────┐
  │ BRANCH A  │       │ BRANCH B  │
  │  (Image)  │       │  (Voice)  │
  └─────┬─────┘       └─────┬─────┘
        │                   │
        ▼                   ▼
  Rekognition          Transcribe
  (face match)         (speech-to-text)
        │                   │
        ▼                   ▼
  GPS extraction       Bedrock
  from EXIF            (intent + work details)
        │                   │
        ▼                   ▼
  Site matching        Structured data
  (geo-fence check)    (site, task, hours)
        │                   │
        └─────────┬─────────┘
                  ▼
         ┌──────────────────┐
         │   Attendance      │  Combines results, applies business rules
         │   Processor       │  Confidence routing: >80% auto, 60-80% review
         └────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
  DynamoDB Write       Polly → WhatsApp
  (AttendanceLogs)     (voice confirmation)
```

### 3.2 Worker Onboarding Flow

```
  Worker initiates contact → Voice greeting in preferred language
                    │
                    ▼
  Name via voice → Transcribe → Store in profile
                    │
                    ▼
  Aadhaar photo  → Textract (OCR) → Verhoeff checksum → KMS encrypt
                    │
                    ▼
  Passbook photo → Textract (OCR) → Extract account/IFSC
                    │
                    ▼
  Selfie upload  → Rekognition → Store face feature vector (not image)
                    │
                    ▼
  All verified?  → YES → profile_status = 'active' → Voice confirmation
                 → NO  → Guidance for resubmission (up to 3 retries)
```

### 3.3 Certificate Generation Flow

```
  total_days_logged == 90
          │
          ▼
  Step Function: CertificateFlow
          │
          ▼
  Query all attendance logs → Aggregate sites, date range
          │
          ▼
  Generate PDF (worker name, Aadhaar last 4, 90 days, sites)
          │
          ▼
  Compute SHA-256 verification_hash → Embed QR code with verification URL
          │
          ▼
  Store in Certificates table + S3 → Notify worker via voice message
```

## 4. AI/ML Services Architecture

### 4.1 Service Capabilities Matrix


| Service                  | Role                                                      | Key Thresholds                                            | Fallback                       |
| ------------------------ | --------------------------------------------------------- | --------------------------------------------------------- | ------------------------------ |
| **Bedrock** (Claude 3.5) | Conversational AI, intent extraction, response generation | Few-shot prompts with multilingual worker speech patterns | Lex V2 for structured intents  |
| **Lex V2**               | Intent recognition, slot filling                          | Confidence < 70% → escalate to Bedrock                   | Text-based command matching    |
| **Polly**                | Text-to-speech in 9 languages                             | Neural voices with adjusted speaking rates                | Pre-recorded S3 audio messages |
| **Textract**             | OCR for Aadhaar, PAN, bank passbook                       | Critical field confidence < 80% → manual review          | Queue for retry on outage      |
| **Rekognition**          | Facial verification, image quality                        | > 80% auto-approve, 60-80% review, < 60% reject           | Flag for admin manual review   |
| **Translate**            | Regional language document translation                    | Translate key fields to English for storage               | Store original text only       |

### 4.2 Confidence-Based Decision Routing

```python
class VerificationRouter:
    """Routes AI decisions based on confidence thresholds."""

    THRESHOLDS = {
        'facial_recognition': {'auto': 80, 'review': 60, 'reject': 0},
        'ocr_critical_field': {'auto': 80, 'review': 0},
        'intent_recognition': {'lex_auto': 70, 'bedrock_fallback': 0},
        'image_quality':      {'accept': 70, 'review': 50, 'reject': 0},
    }

    def route_facial(self, confidence):
        if confidence >= 80:
            return 'auto_approved'
        elif confidence >= 60:
            return 'pending_review'  # Accept log, add to admin queue
        else:
            return 'rejected'  # Request clearer selfie

    def route_ocr(self, field_type, confidence):
        if field_type in ('aadhaar_number', 'account_number'):
            return 'verified' if confidence >= 80 else 'manual_verification'
        return 'verified' if confidence >= 80 else 'flagged'

    def route_intent(self, lex_confidence):
        if lex_confidence >= 70:
            return 'lex_handled'
        return 'bedrock_fallback'  # Free-form NLU
```

## 5. Voice and Multilingual Processing

### 5.1 Voice Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOICE INPUT LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  WhatsApp   │  │   Amazon    │  │   Noise     │             │
│  │ Voice Note  │  │  Connect    │  │  Detection  │             │
│  │  (Audio)    │  │   (IVR)     │  │  (< 70%     │             │
│  │             │  │             │  │   → retry)  │             │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘             │
└─────────┼────────────────┼──────────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SPEECH PROCESSING LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Language   │  │ Speech-to-  │  │   Intent    │             │
│  │ Detection   │  │   Text      │  │ Recognition │             │
│  │ (auto)      │  │ (Transcribe)│  │ (Lex V2)    │             │
│  └─────────────┘  └─────────────┘  └──────┬──────┘             │
│                                     conf < 70%?                │
│                                    YES ──▶ Bedrock (free-form)  │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                 RESPONSE GENERATION LAYER                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Bedrock    │  │   Polly     │  │  WhatsApp/  │             │
│  │ (Generate   │  │  (TTS in    │  │  IVR Send   │             │
│  │  response)  │  │  preferred  │  │  (deliver)  │             │
│  │             │  │  language)  │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Supported Languages


| Language  | ISO Code | Voice (Polly) | Script     | STT Support |
| --------- | -------- | ------------- | ---------- | ----------- |
| Hindi     | hi       | Neural        | Devanagari | Yes         |
| Tamil     | ta       | Neural        | Tamil      | Yes         |
| Telugu    | te       | Neural        | Telugu     | Yes         |
| Bengali   | bn       | Standard      | Bengali    | Yes         |
| Marathi   | mr       | Standard      | Devanagari | Yes         |
| Gujarati  | gu       | Standard      | Gujarati   | Yes         |
| Kannada   | kn       | Standard      | Kannada    | Yes         |
| Malayalam | ml       | Standard      | Malayalam  | Yes         |
| English   | en       | Neural        | Latin      | Yes         |

### 5.3 Conversation Context Management

```python
class ConversationManager:
    """Maintains conversation state across interruptions (24h TTL)."""

    def resume_or_start(self, worker_id, session_id):
        # Check for existing session (DynamoDB ConversationState table)
        state = self.get_state(worker_id, session_id)
        if state and not state.expired:
            return self.resume_from(state.current_intent, state.slots)
        return self.start_new_session(worker_id)

    def handle_language_switch(self, detected_language, preferred_language):
        if detected_language != preferred_language:
            # Adapt responses to newly detected language
            self.update_preferred_language(detected_language)
            return detected_language
        return preferred_language
```

## 6. Data Models

### 6.1 DynamoDB Table Overview

```
┌──────────────────────────────────────────────────────────┐
│                    DynamoDB Tables                        │
├────────────────┬─────────────┬──────────────┬────────────┤
│    Workers     │ Attendance  │    Sites     │Certificates│
│                │   Logs      │              │            │
│ PK: worker_id  │ PK: worker  │ PK: site_id  │ PK: worker │
│ SK: —          │ SK: log_date│ SK: —        │ SK: cert_id│
│                │             │              │            │
│ GSI: phone_num │ GSI: site_id│ GSI: active  │ GSI: hash  │
│                │ GSI: status │              │            │
├────────────────┼─────────────┼──────────────┼────────────┤
│   Documents    │ Conversation│              │            │
│                │   State     │              │            │
│ PK: worker_id  │ PK: worker  │              │            │
│ SK: document_id│ SK: session │              │            │
│                │ TTL: 24h    │              │            │
└────────────────┴─────────────┴──────────────┴────────────┘
```

### 6.2 Workers Table

```
Table: Workers
Partition Key: worker_id (String, UUID)

Attributes:
- worker_id: String (UUID)
- phone_number: String (E.164 format, indexed via GSI)
- name: String
- aadhaar_number_encrypted: Binary (KMS encrypted)
- aadhaar_last_4: String (for display)
- bank_account_number: String
- bank_ifsc: String
- preferred_language: String (ISO 639-1 code)
- face_feature_vector: Binary (Rekognition feature vector)
- registration_date: String (ISO 8601)
- profile_status: String (ENUM: incomplete, pending_verification, active, suspended)
- documents_verified: Map { aadhaar: Bool, bank_passbook: Bool, photo: Bool }
- total_days_logged: Number
- created_at / updated_at: String (ISO 8601)

GSI: PhoneNumberIndex (PK: phone_number, Projection: ALL)
```

### 6.3 AttendanceLogs Table

```
Table: AttendanceLogs
Partition Key: worker_id (String)
Sort Key: log_date (String, YYYY-MM-DD)

Attributes:
- log_id: String (UUID)
- timestamp: String (ISO 8601)
- geo_location: Map { latitude: Number, longitude: Number, accuracy: Number }
- site_id: String (nullable)
- site_name: String (nullable)
- selfie_s3_key: String
- voice_note_s3_key: String (nullable)
- transcribed_text: String (nullable)
- work_description: String (extracted by Bedrock)
- verification_status: String (ENUM: auto_approved, pending_review, approved, rejected)
- verification_confidence: Number (0-100)
- flagged_reason: String (nullable)
- reviewed_by: String (nullable) / reviewed_at: String (nullable)

GSI: SiteLogsIndex (PK: site_id, SK: log_date)
GSI: ReviewQueueIndex (PK: verification_status, SK: timestamp)
```

### 6.4 Sites Table

```
Table: Sites
Partition Key: site_id (String, UUID)

Attributes:
- site_name: String
- site_address: String
- geo_location: Map { latitude: Number, longitude: Number }
- radius_meters: Number (default: 500)
- is_active: Boolean
- contractor_name / contractor_phone: String (nullable)
- created_by: String (admin_id)
- created_at / updated_at: String (ISO 8601)

GSI: ActiveSitesIndex (PK: is_active)
```

### 6.5 Certificates Table

```
Table: Certificates
Partition Key: worker_id (String)
Sort Key: certificate_id (String, UUID)

Attributes:
- issue_date: String (ISO 8601)
- start_date / end_date: String (YYYY-MM-DD)
- total_days: Number
- sites_worked: List<String>
- pdf_s3_key: String
- qr_code_data: String (verification URL)
- verification_hash: String (SHA-256)
- status: String (ENUM: active, revoked, expired)
- downloaded_at: String (nullable)

GSI: VerificationHashIndex (PK: verification_hash)
```

### 6.6 Documents Table

```
Table: Documents
Partition Key: worker_id (String)
Sort Key: document_id (String, UUID)

Attributes:
- document_type: String (ENUM: aadhaar, pan, bank_passbook, ration_card, photo)
- s3_key: String
- extracted_data: Map (flexible schema)
- ocr_confidence: Number (0-100)
- verification_status: String (ENUM: pending, verified, rejected, needs_resubmission)
- verified_by: String (nullable) / rejection_reason: String (nullable)
```

### 6.7 ConversationState Table

```
Table: ConversationState
Partition Key: worker_id (String)
Sort Key: session_id (String, UUID)

Attributes:
- current_intent: String
- slots: Map (collected information)
- conversation_history: List<Map> (last 10 turns)
- last_interaction: String (ISO 8601)
- ttl: Number (Unix timestamp, 24h from last_interaction — DynamoDB TTL auto-cleanup)
```

### 6.8 S3 Bucket Configuration


| Bucket                         | Purpose                        | Lifecycle                 | Encryption |
| ------------------------------ | ------------------------------ | ------------------------- | ---------- |
| `nirman-mitra-media-raw`       | Incoming selfies and documents | 90 days                   | SSE-KMS    |
| `nirman-mitra-media-processed` | Verified images                | 7 years (BOCW compliance) | SSE-KMS    |
| `nirman-mitra-certificates`    | Generated PDF certificates     | Indefinite                | SSE-KMS    |

## 7. Offline-First and Error Handling

### 7.1 Graceful Degradation Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                 DEGRADATION DECISION TREE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Image Quality < 50?                                            │
│  ├── YES → Reject + voice guidance ("retake in good lighting")  │
│  │         Allow 3 retries → then flag for manual review        │
│  └── NO → Quality 50-70?                                        │
│           ├── YES → Accept + flag for review (pending_review)   │
│           └── NO → Accept normally                              │
│                                                                 │
│  Face Recognition < 60?                                         │
│  ├── YES → Reject + request clearer selfie                      │
│  └── NO → Confidence 60-80?                                     │
│           ├── YES → Accept + pending_review + admin queue        │
│           └── NO → Auto-approve (verification_status = approved)│
│                                                                 │
│  OCR Critical Field Missing?                                    │
│  ├── YES → Reject + guidance for resubmission                   │
│  └── NO → Confidence < 80?                                      │
│           ├── YES → Accept + flag field for manual verification  │
│           └── NO → Auto-verify                                  │
│                                                                 │
│  GPS Unavailable?                                               │
│  ├── YES → Request WhatsApp location sharing                    │
│  │         → Fail? Ask worker to describe site verbally          │
│  │         → Bedrock extracts site name → match registered sites │
│  │         → Flag with 'manual_location' tag                     │
│  └── NO → GPS accuracy > 100m?                                  │
│           ├── YES → Reject + request better location             │
│           └── NO → Accuracy 50-100m? Flag for review             │
│                                                                 │
│  Transcription Confidence < 70?                                 │
│  ├── YES → Bedrock infers from low-confidence transcript        │
│  │         → Ask: "Did you say [site_name]?" (yes/no confirm)   │
│  └── EMPTY → Request repeat in quieter environment              │
│               → Offer text alternative                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 AWS Service Fallback Chain

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Bedrock    │────▶│   Lex V2     │────▶│ Text Command │
│  (Primary)   │fail │  (Fallback)  │fail │  (Last resort)│
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│    Polly     │────▶│ Pre-recorded │
│  (Primary)   │fail │ S3 Audio     │
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Textract    │────▶│  SQS Queue   │────▶│ Process on   │
│  (Primary)   │fail │  (Buffer)    │     │  Recovery    │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Lambda/SQS   │────▶│ Exponential  │────▶│    DLQ       │
│  (Primary)   │fail │ Backoff      │5x   │ (Admin View) │
│              │     │ 1,2,4,8,16s  │fail │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

### 7.3 Error Response Patterns

**User-Facing** (worker's preferred language):

- Supportive tone, never technical jargon
- Always include clear next steps
- Example: "We couldn't read your document clearly. Please take another photo in bright light."

**Admin-Facing**:

- Technical error codes and stack traces
- worker_id, timestamp, operation context
- Manual override options in dashboard

## 8. Security and Privacy Design

### 8.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   SECURITY PERIMETER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  API Rate   │  │   Input     │  │    CORS     │             │
│  │  Limiting   │  │ Validation  │  │ Restriction │             │
│  │ 100/min wrk │  │ JSON Schema │  │ Admin only  │             │
│  │ 1000/min adm│  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
          │
┌─────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  IAM Auth   │  │  API Keys   │  │  Admin MFA  │             │
│  │ (Admin API) │  │ (Webhooks)  │  │ (Dashboard) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
          │
┌─────────────────────────────────────────────────────────────────┐
│                   ENCRYPTION LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  TLS 1.3    │  │ KMS at Rest │  │ SSE-KMS S3  │             │
│  │ (Transit)   │  │ (Aadhaar)   │  │ (Media)     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
          │
┌─────────────────────────────────────────────────────────────────┐
│                   AUDIT AND COMPLIANCE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ CloudTrail  │  │  Aadhaar    │  │    DPDP     │             │
│  │ (All access)│  │  Act        │  │   2023      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 PII Handling Summary


| Data Type      | Storage                     | Encryption                  | Retention                    | Access                      |
| -------------- | --------------------------- | --------------------------- | ---------------------------- | --------------------------- |
| Aadhaar Number | DynamoDB (encrypted binary) | KMS`aadhaar-encryption-key` | Worker lifetime              | Lambda decrypt role         |
| Aadhaar Last 4 | DynamoDB (plaintext)        | —                          | Worker lifetime              | Display only                |
| Face Data      | DynamoDB (feature vector)   | —                          | Deleted on request (30 days) | Rekognition comparison only |
| Selfies        | S3 raw bucket               | SSE-KMS                     | 90 days                      | Lambda processing role      |
| Verified Media | S3 processed bucket         | SSE-KMS                     | 7 years (BOCW)               | Admin + Lambda role         |
| Bank Details   | DynamoDB                    | —                          | Worker lifetime              | Admin with MFA              |

### 8.3 KMS Key Configuration


| Key Alias                | Purpose                                     | Access                                         |
| ------------------------ | ------------------------------------------- | ---------------------------------------------- |
| `aadhaar-encryption-key` | Encrypt Aadhaar numbers at rest in DynamoDB | Lambda: decrypt only; Admin: encrypt + decrypt |
| `s3-media-key`           | S3 bucket server-side encryption            | Lambda: read; S3 service: encrypt              |

## 9. Monitoring and Observability

### 9.1 CloudWatch Alarms


| Metric                  | Threshold   | Action                         |
| ----------------------- | ----------- | ------------------------------ |
| Lambda error rate       | > 5%        | SNS alert to admin team        |
| Step Function failures  | > 10/hour   | SNS alert + dashboard flag     |
| DynamoDB throttling     | Any event   | Auto-scale capacity            |
| API Gateway latency     | > 5 seconds | Investigate bottleneck         |
| KMS decryption failures | Any event   | Security incident alert        |
| S3 upload failures      | > 1%        | Check connectivity / SQS queue |
| DLQ depth               | > 0 items   | Admin dashboard notification   |

### 9.2 Observability Stack

- **CloudWatch Logs**: Structured JSON logging (DEBUG/INFO/WARN/ERROR) with correlation IDs
- **X-Ray Tracing**: End-to-end traces from WhatsApp webhook → Lambda → DynamoDB
- **Dashboard Metrics**: Real-time system health, error rates, AI confidence distributions

## 10. Correctness Properties

Formal properties that must hold true across all valid system executions. Each property serves as the bridge between requirements and machine-verifiable correctness.

**P1** (Req 1.2): *For any* phone number, registration check shall return true iff that number exists in the Workers table.

**P2** (Req 1.3): *For any* voice input containing a name, the system shall transcribe and store it such that retrieving the profile returns the transcribed name.

**P3** (Req 1.4): *For any* valid Aadhaar card image, OCR shall extract at minimum the Aadhaar number, name, and address fields.

**P4** (Req 1.5): *For any* valid bank passbook image, OCR shall extract at minimum the account number, IFSC code, and account holder name.

**P5** (Req 1.6, 8.1): *For any* stored Aadhaar number, the raw DynamoDB record shall contain encrypted binary (not plaintext), and KMS decryption shall return the original number.

**P6** (Req 1.8): *For any* worker with all required documents verified, the system shall create a profile with status 'active' and send a confirmation message.

**P7** (Req 1.9, 12.2): *For any* worker who sets a preferred language, all subsequent responses shall be generated in that language until changed.

**P8** (Req 2.1): *For any* image with EXIF GPS metadata, the system shall extract and store latitude/longitude in the AttendanceLog geo_location field.

**P9** (Req 2.3): *For any* selfie submission, the system shall compare against the stored face feature vector and return a similarity score (0–100).

**P10** (Req 2.4): *For any* voice note, the system shall transcribe audio to text and store the transcription in the AttendanceLog.

**P11** (Req 2.5): *For any* attendance submission with selfie and voice note, the AttendanceLog shall include timestamp, geo_location, transcribed_text, worker_id, and selfie_s3_key.

**P12** (Req 2.6): *For any* created AttendanceLog, the system shall send a confirmation message containing log date and site location (if matched).

**P13** (Req 2.8, 3.2, 3.3): *For any* log with GPS coordinates within an active site's radius, the log shall be associated with that site_id; otherwise site_id shall be null.

**P14** (Req 2.9): *For any* duplicate attendance attempt (same worker_id + log_date), the system shall detect it and prompt for update confirmation.

**P15** (Req 3.1): *For any* site registration, the record shall contain site_name, geo_location, radius_meters, and is_active.

**P16** (Req 3.4): *For any* site update, historical AttendanceLogs shall retain original site associations; only future logs use updated info.

**P17** (Req 3.5): *For any* deactivated site (is_active = false), new attendance logs shall not match to it regardless of GPS proximity.

**P18** (Req 4.1): *For any* worker with total_days_logged = 90, the system shall auto-generate a Smart Certificate and create a Certificates table record.

**P19** (Req 4.2): *For any* Smart Certificate, it shall include worker name, Aadhaar last 4, total_days, start_date, end_date, and sites_worked.

**P20** (Req 4.3): *For any* certificate creation, the system shall send a voice notification to the worker.

**P21** (Req 4.4): *For any* certificate request, the system shall return a downloadable PDF via WhatsApp.

**P22** (Req 4.5): *For any* certificate PDF, it shall contain a QR code encoding a verification URL with certificate_id or verification_hash.

**P23** (Req 4.6, 11.1): *For any* QR scan, the verification page shall display authenticity status and worker name but not full Aadhaar, bank account, or phone number.

**P24** (Req 5.1): *For any* worker with N logs (N < 90), progress query shall return days_logged = N and days_remaining = 90 − N.

**P25** (Req 5.2): *For any* work history request, logs shall be returned grouped by month (YYYY-MM) with counts.

**P26** (Req 5.3, 5.4): *For any* welfare reference number submitted, the system shall store it and return it on status query.

**P27** (Req 6.1): *For any* uploaded document, the system shall classify it as aadhaar, PAN, bank_passbook, ration_card, or unknown.

**P28** (Req 6.2): *For any* OCR-processed document, all visible text fields shall be extracted and stored in extracted_data.

**P29** (Req 6.3): *For any* document with name/Aadhaar mismatch against the worker profile, it shall be flagged as 'pending' and added to admin review.

**P30** (Req 6.5): *For any* verified document, the worker's documents_verified map shall be updated for that document type.

**P31** (Req 6.6): *For any* worker with all required document types verified, profile_status shall update to 'application-ready'.

**P32** (Req 6.7): *For any* document in a regional language, key fields shall be translated to English and stored alongside the original text.

**P33** (Req 7.1): *For any* voice command, the system shall identify an intent (LogAttendance, CheckProgress, UploadDocument, RequestCertificate) with a confidence score.

**P34** (Req 7.2): *For any* system response, TTS output shall be in the worker's preferred_language.

**P35** (Req 7.5, 12.1): *For any* voice input in a supported language (hi, ta, te, bn, mr, gu, kn, ml, en), the system shall process and transcribe it.

**P36** (Req 7.7): *For any* conversation resumed within 24 hours, the system shall retrieve previous state and allow continuation from the last step.

**P37** (Req 8.2): *For any* registered worker, the stored face data shall be a binary feature vector — no original face image shall be stored.

**P38** (Req 8.3): *For any* PII access (read/write), the system shall log timestamp, accessor user_id, operation type, and worker_id.

**P39** (Req 8.5): *For any* deletion request, PII fields shall be removed but audit logs and anonymized attendance counts shall be retained.

**P40** (Req 9.1): *For any* failed upload (network error), the system shall queue in SQS with exponential backoff until success or max retries.

**P41** (Req 9.2): *For any* selfie with facial confidence 60–80, the log shall be accepted with status 'pending_review' in the admin queue.

**P42** (Req 9.3): *For any* OCR critical field with confidence < 80%, the system shall request manual verification from the worker via voice.

**P43** (Req 9.6): *For any* log submitted outside 6 AM – 8 PM, the system shall accept but flag for admin review.

**P44** (Req 9.7): *For any* log with GPS accuracy > 100m, reject and request better data; 50–100m, accept but flag.

**P45** (Req 10.1): *For any* dashboard load, displayed stats shall match actual DB counts (active workers, daily logs, pending reviews).

**P46** (Req 10.2): *For any* log with status 'pending_review', it shall appear in the admin queue with flagged_reason.

**P47** (Req 10.3): *For any* flagged log under review, the system shall provide approve, reject, or request-info actions.

**P48** (Req 10.4): *For any* admin-rejected log, the worker shall receive a notification with rejection_reason and resubmission guidance.

**P49** (Req 10.5): *For any* admin search by worker_id or phone_number, results shall include profile, attendance logs, and documents_verified status.

**P50** (Req 10.7): *For any* report export, the CSV shall mask PII (Aadhaar last 4 only, masked phone digits).

**P51** (Req 11.2): *For any* welfare officer API request, the response shall be valid JSON with attendance_logs, documents_verified, and certificate_ids.

**P52** (Req 11.3): *For any* certificate export, data shall include a verification_hash (SHA-256) for authenticity verification.

**P53** (Req 11.4): *For any* Aadhaar-based API query, the system shall verify worker consent before returning profile data.

**P54** (Req 11.5): *For any* API endpoint, requests exceeding 1000/min from a single source shall receive HTTP 429.

**P55** (Req 12.3): *For any* mid-conversation language switch, the system shall detect the change and respond in the new language.

**P56** (Req 12.5): *For any* text message sent to a worker, it shall use the appropriate script for their preferred_language (Devanagari, Tamil, etc.).

## 11. Testing Strategy

### 11.1 Dual Testing Approach


| Approach              | Focus                                                               | Library                               | Min Coverage                |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------- | --------------------------- |
| **Unit Tests**        | Specific examples, edge cases, error conditions, integration points | Jest / pytest                         | 80% line coverage           |
| **Property Tests**    | Universal properties across randomized inputs (all 56 properties)   | fast-check (JS) / Hypothesis (Python) | 100 iterations per property |
| **Integration Tests** | End-to-end Step Function workflows                                  | LocalStack + DynamoDB Local           | All 3 workflows             |

### 11.2 Test Infrastructure

- **LocalStack**: Local AWS service emulation (Lambda, DynamoDB, S3, SQS, KMS)
- **Mock Services**: WhatsApp webhook server, Bedrock/Textract/Rekognition response mocks
- **CI/CD**: Unit tests on commit, property tests on PR, integration tests pre-deploy
- **Performance**: Load test API Gateway (1000 req/min), stress test concurrent attendance, latency test voice response (< 3s)

### 11.3 Key Edge Cases

- Empty/whitespace-only voice transcriptions
- Images without GPS metadata
- Workers at exactly 500m from site boundary
- Attendance at exactly midnight
- Documents with partially visible text
- Invalid Aadhaar format (Verhoeff checksum failure)
- Concurrent attendance submissions for same worker

---

**Document Prepared By:** Nirman Mitra Team
**Review Status:** Technical Design v1.0

*This design specification provides the technical foundation for implementing the Nirman Mitra platform with voice-first accessibility, AI-powered verification, and privacy-by-design security for India's construction workforce.*
