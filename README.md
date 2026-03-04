# Nirman Mitra

**AI Techno-Legal Concierge for Construction Worker Welfare**

Built 100% on AWS | Voice-First | Zero Literacy Required | 9 Languages

> **AI for Bharat Hackathon 2026** — AWS x Hack2skill | Student Track

---

## The Problem

India's 71 million construction workers are locked out of **Rs 38,000 Crore** in welfare benefits because they cannot prove 90 days of work — a requirement that contractors routinely sabotage by refusing documentation.

| Metric | Reality |
|---|---|
| Registered construction workers | 71 million across 35 state/UT boards |
| Workers receiving benefits | < 20% of eligible workers |
| Application rejection rate | 87% due to name mismatches |
| WhatsApp penetration | 95%+ among construction workers |

## The Solution

Nirman Mitra ("Builder's Friend") is a voice-first AI concierge on WhatsApp. A worker sends a selfie and voice note daily — after verified days, they receive an auto-generated, legally valid Smart Certificate with **zero typing, zero app downloads, and zero literacy required**.

### Core Innovation: Triple Verification

Every attendance log is verified through three independent AI channels simultaneously:

| Channel | AWS Service | What It Catches |
|---|---|---|
| **Face Match** | Amazon Rekognition | Buddy-punching, fake identities |
| **Geo-Fence** | GPS + Site matching | Off-site check-ins, spoofing |
| **Voice Intent** | Amazon Bedrock (Claude) | Fake check-ins, scripted messages |

All three processed in < 5 seconds via Step Functions parallel branches.

### The Four Zeros

| Principle | How |
|---|---|
| **Zero Literacy** | Voice-first via WhatsApp voice notes + Polly TTS |
| **Zero Downloads** | WhatsApp only — no app installation |
| **Zero Contractor Dependency** | AI self-verification replaces employer sign-off |
| **Zero Typing** | Voice input + camera — no text entry |

## Architecture

### 15 AWS Services

| Service | Role |
|---|---|
| Amazon Bedrock (Claude 3.5) | Conversational AI, intent extraction, name cross-validation |
| Amazon Lex V2 | Structured intent recognition + slot filling |
| Amazon Polly | Neural TTS in 9 Indian languages |
| Amazon Textract | OCR for Aadhaar, PAN, bank passbooks |
| Amazon Rekognition | Facial verification + liveness detection |
| Amazon Translate | Regional language document translation |
| Amazon S3 | 3 buckets: raw (90d), processed (7yr), certificates |
| Amazon DynamoDB | 6 tables with GSIs and auto-scaling |
| AWS Lambda | 6 functions: MessageHandler, AttendanceProcessor, DocumentVerifier, CertificateGenerator, NotificationSender, AdminAPI |
| AWS Step Functions | 3 workflows with parallel AI processing |
| Amazon SQS | Retry queues with backoff + DLQ |
| Amazon API Gateway | REST APIs with rate limiting and validation |
| AWS KMS | Dedicated CMKs for Aadhaar encryption |
| CloudWatch + X-Ray | Alarms, structured logging, tracing |
| Amplify + Cognito | Admin dashboard hosting + MFA authentication |

### Data Flow

```
Worker (WhatsApp) --> API Gateway --> MessageHandler Lambda
    |
    +--> New Worker? --> OnboardingFlow (Step Functions)
    |       |-> Textract OCR (Aadhaar)
    |       |-> Rekognition (Face enrollment)
    |       |-> Bedrock (Language detection)
    |       |-> KMS (Aadhaar encryption)
    |
    +--> Active Worker? --> AttendanceFlow (Step Functions)
            |-> PARALLEL Branch A: Rekognition (Face) + GPS (Geo-fence)
            |-> PARALLEL Branch B: Bedrock (Voice intent analysis)
            |-> Merge + Confidence Routing
            |-> DynamoDB write + Polly confirmation
            |-> Day threshold? --> CertificateFlow
                    |-> PDF + QR + SHA-256
                    |-> S3 + WhatsApp delivery
```

## Quick Start

### Prerequisites

- Node.js 20+
- AWS SAM CLI
- AWS CLI v2 (configured with credentials)
- Docker Desktop (for local Lambda emulation)

### Setup

```bash
# Install dependencies
npm install
cd admin-dashboard && npm install && cd ..

# Build
sam build

# Deploy to AWS
sam deploy --guided

# Seed demo data
node demo/seed-demo-data.js

# Run admin dashboard locally
cd admin-dashboard && npm run dev
```

### Demo Mode

The project runs in demo mode by default (`ENVIRONMENT=dev`):
- WhatsApp API calls are mocked to console
- DynamoDB uses in-memory store (no AWS credentials needed for local testing)
- Certificate threshold: 3 days (instead of 90)
- GPS defaults to New Delhi coordinates

### Testing

```bash
# Start local API
sam local start-api --port 3001

# Run webhook tests
node demo/test-webhook.js all
```

## Project Structure

```
nirman-mitra/
  src/
    handlers/           # 6 Lambda function entry points
    services/           # Business logic (voice, OCR, registration)
    utils/              # Shared utilities (DynamoDB, S3, KMS, WhatsApp)
    stepFunctions/      # 3 Step Functions ASL definitions
  admin-dashboard/      # React + Vite admin UI
  demo/                 # Test scripts and demo data
  template.yaml         # AWS SAM template (15 services)
```

## Security & Privacy

- **Aadhaar Act compliant**: KMS encryption, binary storage only, last 4 digits masked
- **DPDP 2023 ready**: Explicit consent, deletion rights, PII audit logging
- **TLS 1.3** on all data in transit
- **Least-privilege IAM**: Separate roles per Lambda function
- **CloudTrail**: All PII access logged
- **Cognito MFA** for admin dashboard access

## Impact

| SDG | Contribution |
|---|---|
| SDG 1 - No Poverty | Unlocks Rs 38,000 Cr in welfare benefits |
| SDG 8 - Decent Work | Creates verifiable employment records |
| SDG 10 - Reduced Inequalities | Voice-first includes illiterate workers |
| SDG 16 - Strong Institutions | Digitizes BOCW boards, reduces fraud |

## Team

**Nirman Mitra Team** | AI for Bharat Hackathon 2026

## License

MIT
