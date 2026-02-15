# Nirman Mitra: AI-Powered Voice-First Platform for Construction Worker Welfare
## Requirements Specification Document

**Hackathon Submission:** AI for Bharat / AWS Innovation Challenge
**Version:** 1.0
**Date:** February 15, 2026
**Team:** Nirman Mitra Development Team
**Technology Stack:** AWS Serverless (Lambda, Step Functions, DynamoDB, S3), Amazon Bedrock (Claude 3.5 Sonnet), Lex V2, Polly, Textract, Rekognition, WhatsApp Business API, Amazon Connect (IVR)

---

## Executive Summary

Nirman Mitra is an AI-powered voice-first platform designed to help India's 71 million construction workers access Building and Other Construction Workers (BOCW) welfare benefits. The platform addresses a critical systemic failure: workers are excluded from welfare schemes because they cannot prove 90 days of continuous work — a requirement that contractors routinely evade by refusing to provide documentation.

The solution provides a Techno-Legal Concierge accessible via WhatsApp and IVR, enabling workers to log daily attendance through geo-tagged selfies and voice notes, creating a verifiable "Smart Certificate" for welfare eligibility. The system leverages AI-powered document verification to audit identity and banking documents, preventing application rejections. Built on an AWS serverless architecture with event-driven processing, the platform is designed for offline tolerance, multilingual voice interaction in 9 Indian languages, and privacy-by-design PII handling compliant with the Aadhaar Act and Digital Personal Data Protection Act 2023.

## 1. Introduction & Problem Statement

### 1.1 Construction Worker Welfare Challenges in India

India's construction sector employs over 71 million workers, making it one of the largest informal labor forces in the world. Despite the existence of BOCW welfare boards in every state, the vast majority of these workers remain excluded from benefits due to systemic barriers in documentation, digital access, and enforcement.

#### 1.1.1 Documentation and Proof-of-Work Barriers
- **90-Day Proof Requirement**: BOCW welfare eligibility requires proof of 90 days of continuous construction work, yet no standardized mechanism exists for workers to document their daily labor
- **Contractor Evasion**: Contractors routinely refuse to provide employment certificates, leaving workers without verifiable proof of employment
- **Paper-Based Systems**: Existing documentation processes require literacy and access to bureaucratic offices, excluding the most vulnerable workers
- **Application Rejections**: Welfare applications are frequently rejected due to incomplete, inconsistent, or unverifiable documentation

#### 1.1.2 Digital Literacy and Accessibility Gaps
- **Low Literacy Rates**: A significant portion of construction workers have limited reading and writing abilities, making text-based digital platforms inaccessible
- **Language Diversity**: Workers migrate across states and speak diverse regional languages, yet most government systems operate in English or Hindi only
- **Device Constraints**: Many workers share mobile devices within families or have access only to basic smartphones with limited storage and processing power
- **Technology Unfamiliarity**: Workers accustomed to voice communication face barriers with app-based interfaces requiring text input and navigation

#### 1.1.3 Welfare System Inefficiencies
- **Fragmented Processes**: Welfare applications require visits to multiple offices, submission of redundant documents, and long waiting periods
- **Opaque Status Tracking**: Workers have no visibility into the status of their welfare applications once submitted
- **Delayed Benefits**: Processing times for BOCW benefits are measured in months, leaving workers without support during critical periods
- **Low Awareness**: Many eligible workers are unaware of the specific benefits available to them or the application process required

#### 1.1.4 Contractor Evasion and Enforcement Gaps
- **No Accountability Mechanism**: Current systems provide no way to independently verify contractor claims against worker attendance
- **Power Asymmetry**: Workers depend on contractors for employment and cannot demand documentation without risking their livelihoods
- **Informal Arrangements**: Most construction work engagements are verbal, with no written contracts or formal employment records
- **Regulatory Gaps**: State BOCW boards lack tools to independently verify worker employment claims at scale

### 1.2 Market Opportunity and Impact Potential

- **Scale**: 71 million registered construction workers across 35 state and UT BOCW boards
- **Exclusion Rate**: Over 80% of eligible workers do not receive BOCW welfare benefits due to documentation barriers
- **Economic Impact**: Potential to unlock billions in welfare benefits currently trapped behind documentation requirements
- **Technology Fit**: 95%+ mobile phone penetration among construction workers, with WhatsApp as the dominant communication platform
- **Sustainability Goals**: Alignment with UN SDGs 1 (No Poverty), 8 (Decent Work), 10 (Reduced Inequalities), and 16 (Strong Institutions)

## 2. Objectives

### 2.1 Primary Objectives

#### 2.1.1 Eliminate Documentation Barriers
- Enable workers to build verifiable proof of work independently, without contractor cooperation
- Provide AI-powered document verification that catches errors before welfare applications are submitted
- Generate legally valid Smart Certificates that satisfy BOCW 90-day requirements

#### 2.1.2 Enable AI-Powered Verification
- Deploy facial recognition and geo-tagging for tamper-resistant attendance verification
- Use OCR and NLP to automatically extract, validate, and cross-reference identity documents
- Implement confidence-based thresholds with human-in-the-loop review for edge cases

#### 2.1.3 Deliver Voice-First Accessibility
- Ensure every platform interaction can be completed through voice alone, requiring no literacy
- Support 9 Indian languages with natural-sounding regional accents and automatic language detection
- Provide access via WhatsApp and IVR to meet workers where they already communicate

#### 2.1.4 Streamline Welfare Access
- Automate certificate generation upon eligibility, eliminating manual application steps
- Provide proactive benefit status tracking and notifications
- Enable welfare officers to verify worker credentials through digital APIs and QR codes

### 2.2 Secondary Objectives

#### 2.2.1 Technology Innovation
- Demonstrate a serverless, event-driven architecture that scales with demand and minimizes operational costs
- Showcase multimodal AI integration (vision, voice, language) for low-literacy populations
- Build an offline-tolerant platform that functions reliably in low-connectivity rural construction sites

#### 2.2.2 Administrative Modernization
- Equip welfare officers with digital dashboards for efficient application processing
- Replace manual review processes with AI-assisted verification workflows
- Provide data-driven insights into worker registration, attendance patterns, and benefit distribution

## 3. Stakeholder Analysis

### 3.1 Primary Stakeholders

#### 3.1.1 Construction Workers (71 Million)
**Profile**: Daily-wage laborers in the building and construction sector, migrating between sites and states, with varying levels of literacy and digital familiarity

**Needs**:
- Simple, voice-based method to log daily attendance without literacy requirements
- Automatic proof-of-work generation for BOCW welfare eligibility
- Document upload and verification assistance in their native language
- Visibility into progress toward 90-day eligibility and benefit application status
- Secure handling of sensitive personal and biometric information

**Pain Points**:
- Contractors refuse to provide employment certificates
- Cannot navigate text-based government portals or fill out complex forms
- Lose track of how many days they have worked across multiple sites
- Welfare applications rejected due to document errors they cannot identify
- No way to check benefit application status without visiting government offices

**Success Metrics**:
- Registration completion rate > 80% for workers who initiate onboarding
- Daily attendance logging rate > 60% among active workers
- Smart Certificate generation within 24 hours of reaching 90 days
- Worker satisfaction score > 4.0/5 for voice interactions

#### 3.1.2 Welfare Officers / BOCW Board Staff
**Profile**: Government employees responsible for processing welfare applications, verifying worker eligibility, and disbursing benefits

**Needs**:
- Digital tools to verify worker certificates and attendance history efficiently
- Structured data access for cross-referencing worker claims
- Dashboard for managing review queues, flagged submissions, and reports
- Integration APIs for connecting with existing BOCW board systems

**Pain Points**:
- Manual verification of paper certificates is time-consuming and error-prone
- No digital infrastructure to validate worker claims at scale
- Fraudulent or incomplete applications waste processing capacity
- Lack of standardized data formats across worker submissions

**Success Metrics**:
- Application processing time reduction > 50%
- Verification accuracy improvement > 90%
- Fraudulent application detection rate > 85%

#### 3.1.3 Platform Administrators
**Profile**: Technical and operational staff managing the Nirman Mitra platform

**Needs**:
- Real-time monitoring of system health, user activity, and error rates
- Tools to review flagged attendance logs and documents
- Ability to manage worker profiles, sites, and system configuration
- Data export capabilities for reporting and compliance

**Pain Points**:
- Need visibility into AI decision quality and error patterns
- Must balance automated processing with manual review workloads
- Require tools for investigating and resolving edge cases

**Success Metrics**:
- System uptime > 99.9% during operational hours
- Review queue processing within 24 hours
- Data accuracy rate > 95% for automated verifications

### 3.2 Secondary Stakeholders

#### 3.2.1 Contractors and Construction Companies
- Primary employers of construction workers
- May be required to register construction sites on the platform
- Benefit from streamlined compliance with labor welfare regulations

#### 3.2.2 Labor Unions and Worker Advocacy Organizations
- Represent worker interests in welfare policy and implementation
- Can promote platform adoption among their membership
- Provide feedback on platform usability and effectiveness

#### 3.2.3 State BOCW Boards
- Administer welfare schemes and process benefit applications
- Integrate with the platform for digital certificate verification
- Use platform data for policy planning and resource allocation

### 3.3 Tertiary Stakeholders

#### 3.3.1 Ministry of Labour and Employment
- Sets national policy for construction worker welfare
- Monitors BOCW board performance across states
- May adopt the platform as a national standard for worker documentation

#### 3.3.2 Technology Providers
- AWS cloud infrastructure and AI/ML services
- WhatsApp Business API for worker communication
- Potential integration partners for biometric verification and digital payments

## 4. Functional Requirements

### 4.1 Worker Onboarding and Document Verification (FR-W001 to FR-W015)

- **FR-W001**: System shall respond with a voice greeting in the worker's preferred language when a worker initiates contact via WhatsApp or IVR
- **FR-W002**: System shall check if a phone number is already registered when a worker provides their phone number during onboarding
- **FR-W003**: System shall transcribe and store the worker's name using speech-to-text when a worker provides their name via voice
- **FR-W004**: System shall extract the Aadhaar number, name, and address from an Aadhaar card image using OCR (Amazon Textract) with post-processing validation using Verhoeff checksum
- **FR-W005**: System shall extract the account number, IFSC code, and account holder name from a bank passbook image using OCR
- **FR-W006**: System shall encrypt Aadhaar numbers using AWS KMS with a dedicated customer master key before persisting to the database, storing only the encrypted binary and last 4 digits separately for display
- **FR-W007**: System shall request the worker to retake a photo with specific guidance (lighting, angle, steadiness) when document extraction fails due to poor image quality, allowing up to 3 retry attempts before flagging for manual review
- **FR-W008**: System shall create a worker profile with status 'active' and confirm registration via voice message when all required documents are verified
- **FR-W009**: System shall store the worker's preferred language and use it for all future voice responses and text messages
- **FR-W010**: System shall automatically detect the document type (Aadhaar, PAN, bank passbook, ration card) when a worker uploads a document image
- **FR-W011**: System shall extract all visible text fields from uploaded documents using OCR and store the extracted data with confidence scores
- **FR-W012**: System shall flag a document for admin review when extracted data contains inconsistencies with the worker's registered profile data (name mismatch, Aadhaar discrepancy)
- **FR-W013**: System shall reject documents that are too dark or blurry (image quality score < 50) and provide specific guidance for retaking, including tips on lighting and phone positioning
- **FR-W014**: System shall store extracted data and mark the document type as verified in the worker's profile when a document is successfully verified
- **FR-W015**: System shall update the worker's profile status to "application-ready" when all required documents (Aadhaar, bank passbook, photo) are verified

### 4.2 Daily Attendance Logging (FR-A001 to FR-A012)

- **FR-A001**: System shall extract GPS coordinates from image EXIF metadata when a worker sends a selfie during work hours
- **FR-A002**: System shall request location sharing via WhatsApp or, if unavailable, ask the worker to describe the site verbally for AI-based site matching when GPS coordinates are unavailable in image metadata
- **FR-A003**: System shall use facial recognition (Amazon Rekognition) to verify the selfie matches the worker's registered face feature vector, with auto-approval above 80% confidence, manual review between 60–80%, and rejection below 60%
- **FR-A004**: System shall transcribe voice notes describing work activity using speech-to-text and extract structured work details (site name, task type) using Amazon Bedrock
- **FR-A005**: System shall create an Attendance Log record with timestamp, geo-location, transcribed text, work description, worker ID, selfie S3 key, and verification status when a worker submits both selfie and voice note
- **FR-A006**: System shall confirm receipt of an attendance log via voice message stating the date and matched site location
- **FR-A007**: System shall request a clearer photo with specific lighting and positioning guidance when a selfie is too blurry for facial recognition (image quality score < 50)
- **FR-A008**: System shall flag an attendance log for admin review when the submission location is more than 500 meters from any registered active site
- **FR-A009**: System shall inform the worker and ask if they want to update the existing log when a worker has already logged attendance for the current day (duplicate detection by worker_id and log_date)
- **FR-A010**: System shall queue attendance submissions in an SQS queue and confirm once uploaded when network connectivity is poor, with automatic retry using exponential backoff (1s, 2s, 4s, 8s, 16s)
- **FR-A011**: System shall accept attendance logs submitted outside standard work hours (before 6 AM or after 8 PM) but flag them for admin review with an off-hours indicator
- **FR-A012**: System shall accept location data with GPS accuracy between 50–100 meters with a flag for review, and reject submissions with accuracy exceeding 100 meters with a request for better location data

### 4.3 Site Management (FR-SM001 to FR-SM005)

- **FR-SM001**: System shall store the site name, GPS coordinates (latitude, longitude), radius boundary (default 500 meters), contractor information, and active status when an admin registers a new site
- **FR-SM002**: System shall match the geo-tag of each attendance log against all registered active site locations within the defined radius boundary
- **FR-SM003**: System shall associate an attendance log with the matched site ID when the geo-tag falls within a registered site's radius
- **FR-SM004**: System shall apply site information changes to future attendance logs without modifying historical attendance data when an admin updates site information
- **FR-SM005**: System shall prevent new attendance logs from being associated with a deactivated site regardless of GPS proximity

### 4.4 Smart Certificate Generation (FR-SC001 to FR-SC008)

- **FR-SC001**: System shall automatically generate a Smart Certificate when a worker accumulates 90 verified attendance logs, creating a record in the Certificates table with active status
- **FR-SC002**: System shall include the worker's name, Aadhaar last 4 digits, total days worked, start date (first attendance log), end date (90th attendance log), and list of sites worked in every Smart Certificate
- **FR-SC003**: System shall notify the worker via voice message when a Smart Certificate is generated, informing them of certificate availability and download instructions
- **FR-SC004**: System shall provide a downloadable PDF certificate via WhatsApp when a worker requests their Smart Certificate
- **FR-SC005**: System shall include a QR code in every Smart Certificate PDF that encodes a verification URL containing the certificate ID or verification hash
- **FR-SC006**: System shall display certificate authenticity status and worker name when an external party scans the QR code, without exposing full Aadhaar number, bank account, phone number, or other PII
- **FR-SC007**: System shall include a digital signature (SHA-256 verification hash of certificate content) in all certificate exports for authenticity verification
- **FR-SC008**: System shall support certificate status management with active, revoked, and expired states, ensuring revoked or expired certificates display their current status on QR code verification

### 4.5 Benefit Status Tracking (FR-BT001 to FR-BT005)

- **FR-BT001**: System shall respond with the number of days logged and days remaining to reach 90 when a worker asks about their progress via voice
- **FR-BT002**: System shall provide a summary of logged days grouped by month (YYYY-MM) with counts per month when a worker requests their work history
- **FR-BT003**: System shall store a welfare application reference number and enable status tracking when a worker submits one
- **FR-BT004**: System shall retrieve and communicate the current application status via voice when a worker checks their application status
- **FR-BT005**: System shall proactively notify workers via WhatsApp or IVR call when their welfare application status changes

### 4.6 Voice Interface and Conversational AI (FR-V001 to FR-V009)

- **FR-V001**: System shall recognize worker intent using Amazon Lex V2 for structured commands (CheckProgress, LogAttendance, UploadDocument, RequestCertificate) with fallback to Amazon Bedrock for free-form understanding when Lex confidence is below 70%
- **FR-V002**: System shall generate text-to-speech responses using Amazon Polly in the worker's preferred language with neural voices and appropriate speaking rates for clarity
- **FR-V003**: System shall ask clarifying questions in natural conversational language when a worker's intent is unclear, using simple yes/no confirmations where possible
- **FR-V004**: System shall provide a voice menu of available actions when a worker asks for help
- **FR-V005**: System shall process voice input using multilingual speech recognition supporting Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and English
- **FR-V006**: System shall request the worker to repeat in a quieter environment when background noise interferes with speech recognition (transcription confidence < 70%), with an option to type the message instead
- **FR-V007**: System shall maintain conversation context in the ConversationState table and allow a worker to resume from the last step when a conversation is interrupted and resumed within 24 hours
- **FR-V008**: System shall fall back to pre-recorded audio messages stored in S3 when Amazon Polly is unavailable, ensuring uninterrupted voice interaction
- **FR-V009**: System shall fall back to SMS-based text commands when the voice interface is unavailable, maintaining core functionality through text-based interaction

### 4.7 Admin Dashboard and Monitoring (FR-AD001 to FR-AD007)

- **FR-AD001**: System shall display summary statistics of active workers, daily attendance logs, and pending review count when an admin logs into the dashboard, with statistics matching actual database counts in real-time
- **FR-AD002**: System shall display flagged attendance logs in the admin review queue with the reason for flagging (location anomaly, low facial recognition confidence, off-hours submission, image quality)
- **FR-AD003**: System shall allow an admin to approve, reject, or request additional information for each flagged attendance log during review
- **FR-AD004**: System shall notify the worker with the rejection reason and specific guidance for resubmission when an admin rejects an attendance log
- **FR-AD005**: System shall display a worker's complete profile, attendance history, and document verification status when an admin searches by worker ID or phone number
- **FR-AD006**: System shall generate automated alerts for admins when suspicious patterns are detected, including duplicate submissions from different locations, location anomalies, and rapid sequential submissions
- **FR-AD007**: System shall export report data in CSV format with PII masking (last 4 digits of Aadhaar, masked phone number middle digits) when an admin generates a report

### 4.8 BOCW System Integration (FR-BI001 to FR-BI005)

- **FR-BI001**: System shall display certificate details and verification status when a welfare officer scans a Smart Certificate QR code
- **FR-BI002**: System shall provide structured JSON responses containing attendance logs array, document verification status, and certificate IDs when a welfare officer requests worker data via API
- **FR-BI003**: System shall verify that the worker has provided consent for data sharing before returning profile data when a welfare officer queries by Aadhaar number
- **FR-BI004**: System shall rate-limit integration API requests to 1000 per minute per source, returning HTTP 429 responses for requests exceeding the threshold
- **FR-BI005**: System shall authenticate integration API requests using IAM authorization for admin endpoints and API keys for webhook endpoints, with JSON schema validation for all inputs

## 5. Non-Functional Requirements

### 5.1 Performance and Scalability (NFR-P001 to NFR-P010)

- **NFR-P001**: System shall respond to user queries within 3 seconds on 3G networks for standard operations
- **NFR-P002**: Voice processing shall complete speech-to-text conversion within 2 seconds for voice notes up to 60 seconds in length
- **NFR-P003**: AI agent responses (Bedrock, Lex) shall be generated within 3 seconds for standard intent recognition and response generation
- **NFR-P004**: Facial recognition comparison shall complete within 2 seconds, returning a similarity score for attendance verification
- **NFR-P005**: OCR document processing shall complete within 5 seconds for standard identity documents
- **NFR-P006**: Database queries shall execute within 500 milliseconds for 95% of requests using DynamoDB optimized access patterns
- **NFR-P007**: System shall support concurrent attendance submissions from up to 10,000 workers without performance degradation through Lambda auto-scaling
- **NFR-P008**: System shall support progressive image upload with resume capability for workers on low-bandwidth connections
- **NFR-P009**: System shall maintain 99.9% uptime during operational hours (6 AM to 10 PM IST) with automated failover and health checks
- **NFR-P010**: System shall auto-scale Lambda functions and DynamoDB capacity to handle 10x traffic spikes during peak registration or logging periods

### 5.2 Security and Privacy (NFR-S001 to NFR-S015)

- **NFR-S001**: System shall encrypt all Aadhaar numbers at rest using AWS KMS with a dedicated customer master key (`aadhaar-encryption-key`), storing only encrypted binary in DynamoDB
- **NFR-S002**: System shall store only facial feature vectors in the Workers table, never retaining original face images in the face data field
- **NFR-S003**: System shall log all PII access events (read and write) to CloudTrail with timestamp, accessor user ID, operation type, and worker ID accessed
- **NFR-S004**: System shall use TLS 1.3 encryption for all data in transit across API Gateway, Lambda, and external service communications
- **NFR-S005**: System shall remove all personal data (name, phone number, encrypted Aadhaar, bank account) upon worker data deletion request while retaining legally required audit logs and anonymized attendance counts
- **NFR-S006**: System shall require multi-factor authentication for all admin accounts accessing the dashboard or worker data
- **NFR-S007**: System shall lock the account and notify the worker via WhatsApp when suspicious access patterns are detected
- **NFR-S008**: System shall implement least-privilege IAM roles for all Lambda functions, with separate roles for KMS decrypt, DynamoDB read/write, and S3 access
- **NFR-S009**: System shall minimize PII storage to only essential data required for welfare applications, using hashed worker IDs for analytics and reporting
- **NFR-S010**: System shall retain raw media (selfies, documents) in S3 for 90 days with lifecycle policies, and retain processed verified data for 7 years per BOCW compliance requirements
- **NFR-S011**: System shall encrypt all S3 buckets using SSE-KMS with customer-managed keys
- **NFR-S012**: System shall require explicit worker consent during onboarding with consent timestamp stored before collecting any biometric or personal data
- **NFR-S013**: System shall restrict API Gateway CORS to the admin dashboard domain only, preventing cross-origin access from unauthorized sources
- **NFR-S014**: System shall validate all API inputs against JSON schemas before processing to prevent injection and malformed data attacks
- **NFR-S015**: System shall comply with the Aadhaar Act (using Aadhaar only for identity verification with explicit consent) and the Digital Personal Data Protection Act 2023 (right to access, rectify, and delete)

### 5.3 Accessibility and Usability (NFR-A001 to NFR-A005)

- **NFR-A001**: System shall support complete task flows (registration, attendance logging, certificate request, progress check) entirely through voice interaction without requiring any text input or screen reading
- **NFR-A002**: System shall function on smartphones with minimum 1 GB RAM and Android 6.0+, with core attendance logging also supported via feature phones through IVR
- **NFR-A003**: System shall use supportive, non-technical language in all user-facing error messages and guidance, providing clear next steps in the worker's preferred language
- **NFR-A004**: System shall provide voice-guided tutorials for first-time users covering registration, daily attendance logging, and certificate requests
- **NFR-A005**: System shall adapt interface complexity based on the worker's interaction history, simplifying flows for experienced users and providing additional guidance for new users

### 5.4 Offline and Low-Connectivity Support (NFR-O001 to NFR-O008)

- **NFR-O001**: System shall queue all failed uploads (images, voice notes, documents) in an SQS queue and retry automatically with exponential backoff (1s, 2s, 4s, 8s, 16s), moving to a Dead Letter Queue after 5 failures for manual intervention
- **NFR-O002**: System shall queue all operations and process them in order when AWS services experience downtime, using Step Functions catch blocks with fallback to direct Lambda invocation
- **NFR-O003**: System shall accept and store attendance submissions locally when connectivity is intermittent, automatically uploading when connection is restored with confirmation to the worker
- **NFR-O004**: System shall fall back to Amazon Lex V2 for intent recognition when Amazon Bedrock is unavailable
- **NFR-O005**: System shall fall back to pre-recorded S3 audio messages when Amazon Polly is unavailable
- **NFR-O006**: System shall queue documents for OCR processing when Amazon Textract is unavailable, processing them upon service recovery
- **NFR-O007**: System shall implement DynamoDB exponential backoff for throttling errors and circuit breaker patterns to prevent cascade failures across services
- **NFR-O008**: System shall surface DLQ items on the admin dashboard for manual review and resolution, with SNS notifications alerting the admin team for critical processing failures

## 6. AI-Specific Requirements

### 6.1 Explainability and Transparency (AI-E001 to AI-E005)

- **AI-E001**: System shall include human-readable confidence scores with all AI-driven decisions (facial recognition match, OCR extraction, intent recognition) visible to admins in the review dashboard
- **AI-E002**: System shall provide clear reasoning when flagging attendance logs or documents for review, specifying the exact factor (low confidence score, location mismatch, image quality) and threshold that triggered the flag
- **AI-E003**: System shall communicate verification outcomes to workers in simple, non-technical language appropriate to their preferred language (e.g., "Your photo was accepted" rather than "Facial recognition confidence: 85%")
- **AI-E004**: System shall maintain a complete decision audit trail for every AI-processed submission, recording the service used, confidence score, threshold applied, and final decision for regulatory compliance and appeals
- **AI-E005**: System shall present alternative actions when AI confidence is below the auto-approval threshold, such as requesting a new photo, asking clarifying questions, or escalating to admin review

### 6.2 Human-in-the-Loop Oversight (AI-H001 to AI-H005)

- **AI-H001**: System shall escalate facial recognition results to admin review when the similarity score falls between 60% and 80%, accepting the attendance log in pending status rather than rejecting the worker
- **AI-H002**: System shall escalate OCR extraction results to admin or worker verification when critical field confidence (Aadhaar number, account number) falls below 80%
- **AI-H003**: System shall allow admins to override any AI verification decision (approve, reject, request resubmission) with documented justification stored in the audit trail
- **AI-H004**: System shall escalate to Amazon Bedrock for free-form natural language understanding when Amazon Lex V2 intent recognition confidence falls below 70%
- **AI-H005**: System shall provide admin-accessible quality metrics showing AI auto-approval rates, escalation rates, and admin override frequency to enable continuous model performance monitoring

### 6.3 Bias Mitigation and Fairness (AI-B001 to AI-B005)

- **AI-B001**: System shall maintain equivalent facial recognition accuracy across different skin tones, lighting conditions, and age groups, with regular bias testing on representative demographic datasets
- **AI-B002**: System shall provide equal quality voice recognition and response regardless of the worker's regional accent, dialect, or speech pattern
- **AI-B003**: System shall ensure OCR extraction accuracy is consistent across document formats from all Indian states and union territories
- **AI-B004**: System shall monitor and report verification approval rates disaggregated by language, region, and worker demographics to detect discriminatory patterns
- **AI-B005**: System shall not deny or delay welfare access based on factors unrelated to eligibility (device type, network quality, time of submission) and shall provide equitable retry opportunities

### 6.4 Multilingual and Regional Adaptability (AI-M001 to AI-M008)

- **AI-M001**: System shall support voice interactions in 9 Indian languages: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and English
- **AI-M002**: System shall use the worker's selected language for all voice responses, text messages, and notifications until the preference is changed
- **AI-M003**: System shall detect when a worker speaks in a different language mid-conversation and adapt responses to the newly detected language
- **AI-M004**: System shall use natural-sounding regional accents appropriate to the selected language when generating voice messages via Amazon Polly neural voices
- **AI-M005**: System shall render text messages (SMS, WhatsApp) in the appropriate script for the worker's preferred language (Devanagari for Hindi, Tamil script for Tamil, etc.)
- **AI-M006**: System shall extract text from documents in regional languages and translate key fields to English for storage alongside the original text using Amazon Translate
- **AI-M007**: System shall process voice input using multilingual speech recognition models that handle code-switching between regional languages and Hindi/English within a single utterance
- **AI-M008**: System shall use few-shot prompts with examples of worker speech patterns in multiple languages when processing unstructured voice transcripts through Amazon Bedrock

## 7. Sustainability and Impact Requirements

### 7.1 Worker Welfare and Economic Impact (SUS-W001 to SUS-W005)

- **SUS-W001**: Platform shall increase BOCW welfare benefit access by enabling workers to independently build verifiable proof of 90 days of continuous work
- **SUS-W002**: Platform shall reduce welfare application rejection rates by pre-verifying all required documents through AI-powered OCR before submission
- **SUS-W003**: Platform shall decrease the time from welfare eligibility to benefit receipt by providing digital certificates that can be instantly verified by welfare officers
- **SUS-W004**: Platform shall improve worker financial inclusion by capturing verified bank account details during onboarding, enabling direct benefit transfers
- **SUS-W005**: Platform shall provide workers with a permanent, portable digital work history that persists across construction sites, contractors, and state boundaries

### 7.2 Digital Inclusion and Accessibility Impact (SUS-D001 to SUS-D005)

- **SUS-D001**: Platform shall bridge the digital literacy gap by enabling fully voice-based interactions that require no reading, writing, or app navigation skills
- **SUS-D002**: Platform shall serve workers across 9 language groups, ensuring no worker is excluded from welfare access due to language barriers
- **SUS-D003**: Platform shall function on low-end devices and poor network connections, ensuring workers in remote construction sites are not excluded
- **SUS-D004**: Platform shall reduce dependency on intermediaries (contractors, agents, touts) by enabling workers to directly interact with the welfare system
- **SUS-D005**: Platform shall provide accessible voice-guided onboarding that enables independent registration even for first-time smartphone users

### 7.3 Labor Rights and Documentation Impact (SUS-L001 to SUS-L005)

- **SUS-L001**: Platform shall create an immutable, timestamped record of worker attendance that serves as independent evidence of employment
- **SUS-L002**: Platform shall reduce contractor evasion of documentation responsibilities by providing workers with an alternative proof-of-work mechanism
- **SUS-L003**: Platform shall enable transparency in labor welfare distribution by providing verifiable data on worker eligibility and benefit disbursement
- **SUS-L004**: Platform shall support worker mobility by maintaining attendance records that are valid across construction sites and state BOCW boards
- **SUS-L005**: Platform shall generate data on construction workforce patterns (seasonal migration, site density, work duration) that can inform labor policy decisions

## 8. Constraints and Assumptions

### 8.1 Infrastructure Constraints

#### 8.1.1 Network and Connectivity
- **Assumption**: Majority of construction sites have 3G or better connectivity, with a significant minority operating on 2G or intermittent connections
- **Constraint**: Workers may have limited data plans and cannot download large application packages
- **Mitigation**: Queue-based architecture with SQS for failed operations; image compression before upload; WhatsApp and IVR as primary channels (no app download required)

#### 8.1.2 Device and Hardware
- **Assumption**: Most workers have access to basic Android smartphones (shared or personal) with cameras capable of GPS-tagged photos
- **Constraint**: Devices may have limited storage, low-quality cameras, and shared access within families
- **Mitigation**: No local storage required beyond WhatsApp; image quality detection with guidance for retaking; multi-user support via phone number identification

### 8.2 User Behavior Assumptions

#### 8.2.1 Communication Preferences
- **Assumption**: Workers strongly prefer voice communication over text-based interaction, with WhatsApp as the dominant messaging platform
- **Constraint**: Voice interaction must work in noisy construction environments with varying audio quality
- **Mitigation**: Voice-first design with noise detection and re-recording prompts; SMS/text fallback for environments where voice is impractical

#### 8.2.2 Attendance Logging Patterns
- **Assumption**: Workers may not log attendance every day consistently; logging patterns will be irregular especially during initial adoption
- **Constraint**: The 90-day requirement is cumulative, not consecutive, but workers need visibility into their progress
- **Mitigation**: Proactive reminders via WhatsApp; progress tracking with voice queries; daily prompts during work hours

### 8.3 Regulatory Constraints

#### 8.3.1 Aadhaar Act Compliance
- **Assumption**: Aadhaar will be used solely for identity verification with explicit worker consent
- **Constraint**: Aadhaar numbers must be encrypted at rest and in transit per regulatory requirements; storage and display restrictions apply
- **Mitigation**: KMS encryption with dedicated master key; only last 4 digits stored for display; full audit trail of all access

#### 8.3.2 Digital Personal Data Protection Act 2023
- **Assumption**: Workers must provide informed consent before biometric and personal data collection
- **Constraint**: Platform must support data access, rectification, and deletion requests
- **Mitigation**: Consent capture during onboarding with timestamp; admin APIs for data access and deletion; PII minimization in analytics

#### 8.3.3 BOCW Board Integration
- **Assumption**: Initial deployment will use mock BOCW APIs, with real integration developed per state board requirements
- **Constraint**: Each state BOCW board may have different data formats and verification requirements
- **Mitigation**: Standardized internal data model with configurable export formats; API-first design for flexible integration

## 9. Prototype Scope vs Long-Term Vision

### 9.1 Hackathon Prototype Implementation (Phase 1 — 48 Hours)

#### 9.1.1 Core Features Implemented
- **Worker Onboarding**: Voice-based registration via WhatsApp with Aadhaar and bank passbook OCR verification
- **Attendance Logging**: Selfie + voice note submission with facial recognition and geo-tag validation
- **Smart Certificate**: Automatic PDF generation with QR code at 90-day milestone
- **Voice Interface**: Conversational AI in Hindi and English with intent recognition
- **Admin Dashboard**: Basic web interface showing worker statistics, review queue, and worker search

#### 9.1.2 Simulated and Mock Components
- **BOCW Integration**: Mock API endpoints simulating welfare board data exchange
- **IVR Channel**: Architecture designed for Amazon Connect integration; prototype uses WhatsApp only
- **Full Multilingual Support**: Demonstrated in 2 languages (Hindi, English) with framework supporting all 9 languages
- **Advanced Analytics**: Sample dashboard with representative data and basic metrics
- **Proactive Notifications**: Architecture in place; prototype uses on-demand status queries

#### 9.1.3 Technology Demonstrations
- **AWS Serverless**: Lambda, Step Functions, DynamoDB, S3, API Gateway fully deployed
- **AI/ML Integration**: Bedrock (Claude 3.5 Sonnet), Lex V2, Polly, Textract, Rekognition operational
- **Event-Driven Architecture**: SQS queues, Step Function workflows, and S3 event triggers demonstrated
- **Security Implementation**: KMS encryption, IAM roles, TLS, and audit logging active
- **Offline Tolerance**: SQS-based retry and DLQ patterns for failed operations

### 9.2 Long-Term Vision (12–24 Month Roadmap)

#### 9.2.1 Full-Scale Implementation
- **Complete Multilingual Support**: All 9 Indian languages with regional dialect adaptation
- **IVR Channel**: Amazon Connect integration for workers without WhatsApp access
- **Real BOCW Integration**: Live API connections with state welfare boards for digital certificate verification and benefit tracking
- **National Deployment**: Rollout across multiple states with state-specific configuration
- **Worker Ecosystem**: Integration with digital payment systems for direct benefit transfers

#### 9.2.2 Advanced Features
- **Predictive Analytics**: AI-driven insights on worker attendance patterns, site activity, and welfare benefit utilization
- **Blockchain Certificates**: Tamper-proof certificate verification using distributed ledger technology
- **Contractor Accountability**: Site registration and worker verification tools for construction companies
- **Cross-State Portability**: Federated worker identity allowing seamless welfare access across state BOCW boards
- **Community Features**: Worker-to-worker communication, site reviews, and labor rights information

## 10. Success Metrics and KPIs

### 10.1 Worker Adoption and Engagement

#### 10.1.1 Registration and Onboarding
- **Baseline**: 0 (new platform)
- **Target**: 10,000 registered workers within 6 months of pilot launch
- **Measurement**: Completed registrations with verified documents (profile_status = 'active')
- **Success Threshold**: 80% completion rate for workers who initiate the onboarding flow

#### 10.1.2 Daily Attendance Logging
- **Baseline**: 0 (no existing digital logging mechanism)
- **Target**: 60% daily logging rate among active workers during work days
- **Measurement**: Attendance logs created per active worker per work day
- **Success Threshold**: Average of 4+ logs per worker per week

### 10.2 Certificate and Welfare Access

#### 10.2.1 Smart Certificate Generation
- **Baseline**: Months-long manual certificate process with high rejection rates
- **Target**: Automatic certificate generation within 24 hours of reaching 90 days
- **Measurement**: Time from 90th attendance log to certificate availability
- **Success Threshold**: 95% of certificates generated within 24 hours

#### 10.2.2 Welfare Application Success Rate
- **Baseline**: High rejection rates due to documentation errors
- **Target**: <10% rejection rate for applications using Nirman Mitra Smart Certificates
- **Measurement**: Welfare officer feedback on certificate acceptance rates
- **Success Threshold**: 90% of Smart Certificates accepted by BOCW boards without additional documentation

### 10.3 AI System Effectiveness

#### 10.3.1 Verification Accuracy
- **Baseline**: Manual verification with high error rates
- **Target**: 85% auto-approval rate for attendance submissions with <2% false positive rate
- **Measurement**: Ratio of auto-approved logs to total logs; admin override rate for auto-approved logs
- **Success Threshold**: Admin override rate below 2% for auto-approved submissions

#### 10.3.2 Voice Interaction Quality
- **Baseline**: No existing voice-based welfare platform
- **Target**: 90% intent recognition accuracy across all supported languages
- **Measurement**: Correct intent identification rate from voice commands; fallback escalation rate
- **Success Threshold**: <15% of interactions requiring escalation from Lex to Bedrock

#### 10.3.3 OCR Document Processing
- **Baseline**: Manual document review
- **Target**: 90% auto-extraction accuracy for critical fields (Aadhaar number, bank account number)
- **Measurement**: Correct extraction rate for critical fields; manual correction rate
- **Success Threshold**: <10% of documents requiring admin correction of extracted fields

### 10.4 System Reliability

#### 10.4.1 Uptime and Availability
- **Baseline**: N/A (new system)
- **Target**: 99.9% uptime during operational hours (6 AM – 10 PM IST)
- **Measurement**: CloudWatch monitoring of API Gateway, Lambda, and DynamoDB availability
- **Success Threshold**: No more than 43 minutes of unplanned downtime per month

#### 10.4.2 Error Rate and Recovery
- **Baseline**: N/A (new system)
- **Target**: <0.1% error rate for critical user journeys (attendance logging, certificate generation)
- **Measurement**: Lambda error rates, Step Function execution failures, DLQ item counts
- **Success Threshold**: DLQ items resolved within 24 hours; Lambda error rate below 5%

---

## Conclusion

Nirman Mitra represents a targeted intervention at the intersection of AI technology and labor welfare, addressing the specific and measurable problem of 71 million construction workers excluded from BOCW benefits due to documentation barriers. By combining voice-first accessibility, AI-powered verification, and serverless cloud infrastructure, the platform enables workers to independently build verifiable proof of work through daily selfies and voice notes — bypassing the contractor documentation bottleneck entirely.

The requirements outlined in this document provide a comprehensive specification for building a scalable, secure, and inclusive platform that serves workers with limited literacy and digital experience. Through careful attention to offline tolerance, multilingual support, privacy-by-design principles, and human-in-the-loop AI governance, Nirman Mitra aims to transform welfare access for India's most vulnerable workforce.

**Document Prepared By:** Nirman Mitra Development Team
**Hackathon Submission:** AI for Bharat / AWS Innovation Challenge
**Review Status:** Final Requirements Specification v1.0
**Implementation Timeline:** 48-hour prototype with 12–24 month full deployment roadmap

*This requirements specification serves as the foundation for developing an AI-powered voice-first platform that can transform the lives of 71 million construction workers through accessible, verifiable, and secure welfare documentation.*
