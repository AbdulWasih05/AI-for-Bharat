import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../landing.css';

/* ── Preloader Words ──────────────────────────────────────── */
const PRELOADER_WORDS = ['निर्माण', 'मित्र', 'Nirman', 'Mitra', 'INDIA'];

/* ── Tech Logos ───────────────────────────────────────────── */
const TECH_LOGOS = [
    { icon: '🗣️', label: 'Voice-First Access' },
    { icon: '📜', label: 'Smart Certificates' },
    { icon: '👁️', label: 'Face Verification' },
    { icon: '🌐', label: '9 Indian Languages' },
    { icon: '💬', label: 'WhatsApp Bot' },
    { icon: '🏛️', label: 'BOCW Welfare' },
    { icon: '📡', label: 'Offline Mode' },
    { icon: '📋', label: 'Zero Paperwork' },
    { icon: '🔐', label: 'SHA-256 Security' },
    { icon: '📍', label: 'Real-time Tracking' },
];

/* ── Bridge Checklist Features ────────────────────────────── */
const BRIDGE_FEATURES = [
    'Voice & selfie-based daily attendance logging',
    'Automated 90-day Smart Certificate generation',
    'Real-time BOCW welfare eligibility tracking',
];

/* ── Bento Tech Cards ─────────────────────────────────────── */
const TECH_CARDS = [
    { icon: '🧠', title: 'Amazon Bedrock', desc: 'Agentic AI orchestrating all worker interactions via Claude', tag: 'AI ENGINE' },
    { icon: '👁️', title: 'Amazon Rekognition', desc: 'Face verification for daily geo-tagged attendance selfies', tag: 'VISION AI' },
    { icon: '📝', title: 'Amazon Textract', desc: 'OCR extraction from Aadhaar, passbooks & labour cards', tag: 'DOC AI' },
    { icon: '🗣️', title: 'Amazon Polly', desc: 'Text-to-speech responses in 9 Indian languages', tag: 'VOICE AI' },
];

/* ── Small Icon Components ── */
const ArrowRight = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);
const CheckIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#046A38" /><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ── Decorative SVG Motif (Hero) ── */
const HeroMotif = () => (
    <svg className="hero-motif" viewBox="0 0 600 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.35" stroke="#8B7355" strokeWidth="1.2">
            <circle cx="300" cy="50" r="25" /><circle cx="300" cy="50" r="18" /><circle cx="300" cy="50" r="10" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => <ellipse key={a} cx="300" cy="50" rx="8" ry="30" transform={`rotate(${a} 300 50)`} />)}
            <path d="M260 50 Q220 30 180 50 Q140 70 100 50 Q80 40 60 50" />
            <path d="M260 50 Q230 60 200 50 Q170 35 140 50 Q120 60 100 50" />
            <ellipse cx="200" cy="40" rx="12" ry="6" transform="rotate(-30 200 40)" />
            <ellipse cx="150" cy="55" rx="10" ry="5" transform="rotate(20 150 55)" />
            <ellipse cx="110" cy="45" rx="8" ry="4" transform="rotate(-15 110 45)" />
            <path d="M340 50 Q380 30 420 50 Q460 70 500 50 Q520 40 540 50" />
            <path d="M340 50 Q370 60 400 50 Q430 35 460 50 Q480 60 500 50" />
            <ellipse cx="400" cy="40" rx="12" ry="6" transform="rotate(30 400 40)" />
            <ellipse cx="450" cy="55" rx="10" ry="5" transform="rotate(-20 450 55)" />
            <ellipse cx="490" cy="45" rx="8" ry="4" transform="rotate(15 490 45)" />
            <circle cx="230" cy="45" r="2" fill="#8B7355" /><circle cx="370" cy="45" r="2" fill="#8B7355" />
            <circle cx="170" cy="48" r="1.5" fill="#8B7355" /><circle cx="430" cy="48" r="1.5" fill="#8B7355" />
        </g>
    </svg>
);

/* ═══════════════════════════════════════════════════════════ */
/*  Landing Page Component                                     */
/* ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
    const [showPreloader, setShowPreloader] = useState(true);
    const [preloaderHidden, setPreloaderHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [bannerHindi, setBannerHindi] = useState(true);

    /* Banner language toggle */
    useEffect(() => {
        const interval = setInterval(() => setBannerHindi(prev => !prev), 5000);
        return () => clearInterval(interval);
    }, []);

    /* Preloader word cycling */
    useEffect(() => {
        if (!showPreloader) return;

        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % PRELOADER_WORDS.length);
        }, 600);
        const timeout = setTimeout(() => {
            setPreloaderHidden(true);
            setTimeout(() => {
                setShowPreloader(false);
            }, 700);
        }, 3200);
        document.body.style.overflow = 'hidden';
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            document.body.style.overflow = '';
        };
    }, [showPreloader]);

    /* Override body styles for light theme */
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;
        const origBodyBg = body.style.background;
        const origBodyColor = body.style.color;
        const origHtmlBg = html.style.background;
        body.style.background = '#f8fafc';
        body.style.color = '#1e293b';
        html.style.background = '#f8fafc';
        return () => {
            body.style.background = origBodyBg;
            body.style.color = origBodyColor;
            html.style.background = origHtmlBg;
        };
    }, []);

    /* Navbar scroll effect */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Animate-on-scroll observer */
    useEffect(() => {
        if (showPreloader) return;
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
                { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
            );
            document.querySelectorAll('.fade-in-up').forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) { el.classList.add('visible'); }
                else { observer.observe(el); }
            });
            return () => observer.disconnect();
        }, 100);
        return () => clearTimeout(timer);
    }, [showPreloader]);

    return (
        <div className="landing-root">
            {/* ── Preloader ─────────────── */}
            {showPreloader && (
                <div className={`preloader ${preloaderHidden ? 'hidden' : ''}`}>
                    <div className="preloader__text">
                        <svg className="preloader__flag" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                            <rect width="900" height="200" fill="#FF9933" />
                            <rect y="200" width="900" height="200" fill="#FFFFFF" />
                            <rect y="400" width="900" height="200" fill="#138808" />
                            <circle cx="450" cy="300" r="60" fill="none" stroke="#000080" strokeWidth="4" />
                            {[...Array(24)].map((_, i) => <line key={i} x1="450" y1="300" x2={450 + 55 * Math.cos((i * 15 - 90) * Math.PI / 180)} y2={300 + 55 * Math.sin((i * 15 - 90) * Math.PI / 180)} stroke="#000080" strokeWidth="2" />)}
                        </svg>
                        <span className="preloader__word">{PRELOADER_WORDS[wordIndex]}</span>
                    </div>
                </div>
            )}

            {/* ── Ambient Gradients ────────── */}
            <div className="landing-gradients">
                <div className="gradient-blob-saffron" />
                <div className="gradient-blob-green-left" />
                <div className="gradient-blob-green-right" />
                <div className="gradient-fade" />
            </div>

            {/* ── Sticky Header Wrapper ────── */}
            <div className={`landing-header-sticky ${scrolled ? 'scrolled' : ''}`}>
                {/* ── Top Banner ──────────────── */}
                <div className="landing-banner">
                    <span className="badge-new">{bannerHindi ? 'जय हिंद' : 'Jai Hind'}</span>
                    <span className="banner-text-fade" key={bannerHindi ? 'hi' : 'en'}>
                        {bannerHindi
                            ? 'हर मज़दूर का हक़, अब एक Call दूर — Nirman Mitra is live!'
                            : "Every worker's right, now just one call away — Nirman Mitra is live!"}
                    </span>
                    <ArrowRight />
                </div>

                {/* ── Navbar ──────────────────── */}
                <nav className="landing-nav">
                    <div className="nav-container">
                        <Link to="/home" className="nav-logo">
                            <img src="/navbar-logo.png" alt="Nirman Mitra" className="landing-nav-logo-img" />
                        </Link>
                        <div className="nav-links">
                            <a href="#mission" className="nav-link-item">Mission</a>
                            <a href="#services" className="nav-link-item">Services</a>
                            <a href="#features" className="nav-link-item">Features</a>
                        </div>
                        <div className="nav-buttons">
                            <Link to="/dashboard" className="nav-btn-primary">Dashboard</Link>
                            <a href="https://api.whatsapp.com/send?phone=919999999999&text=Namaste%20Nirman%20Mitra" target="_blank" rel="noopener noreferrer" className="nav-btn-whatsapp">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                <span>Try on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>

            {/* ── Hero Section ──────────── */}
            <main className="landing-hero">
                <HeroMotif />
                <div className="hero-pill"><span>India's First Voice-AI Welfare Platform</span></div>
                <h1 className="hero-headline">
                    Voice-first AI for <br /><span className="text-gradient-india">India's builders</span>
                </h1>
                <p className="hero-sub">
                    Built for 71 million construction workers. Powered by AWS AI services.
                    Enabling BOCW welfare access through selfies, voice notes, and Smart Certificates.
                </p>
                <Link to="/dashboard" className="hero-cta">Experience Nirman Mitra</Link>
            </main>

            {/* ── Infinite Scroll Logos ──── */}
            <div className="logos-section">
                <div className="logos-track">
                    {[...TECH_LOGOS, ...TECH_LOGOS].map((l, i) => (
                        <div key={i} className="logo-item"><span className="logo-icon">{l.icon}</span>{l.label}</div>
                    ))}
                </div>
            </div>

            {/* ── Mission Section ────────── */}
            <section id="mission" className="mission-section fade-in-up">
                <div className="mission-label">OUR MISSION</div>
                <p className="mission-text">
                    <span className="text-strong">Nirman Mitra</span> <span className="text-faded">is the ultimate</span> <span className="text-strong">Techno-Legal Concierge</span> <span className="text-faded">for<br />India's construction workers. By harnessing</span> <span className="text-strong">voice-first<br />AI, facial recognition, and automated document<br />verification</span><span className="text-faded">, we break down the barriers of</span> <span className="text-strong">literacy,<br />documentation, and contractor evasion</span><span className="text-faded">. Our mission is<br />to ensure every worker, regardless of their</span> <span className="text-strong">language or<br />digital literacy</span><span className="text-faded">, has seamless access to the</span> <span className="text-strong">BOCW welfare<br />benefits</span> <span className="text-faded">they deserve.</span>
                </p>
            </section>

            {/* ── Phygital Bridge Section ── */}
            <section id="services" className="bridge-section fade-in-up">
                <div className="bridge-container">
                    <div className="bridge-left">
                        <div className="section-badge">HOW IT WORKS</div>
                        <h2>WhatsApp-Based Worker Welfare Platform</h2>
                        <p>
                            Through WhatsApp, workers register with Aadhaar + selfie, log daily attendance
                            via geo-tagged selfies, and automatically receive Smart Certificates at 90 days.
                        </p>
                        <ul className="bridge-checklist">
                            {BRIDGE_FEATURES.map((f, i) => (
                                <li key={i}><CheckIcon />{f}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bridge-right">
                        {/* Dashboard Preview Mockup */}
                        <div className="dashboard-preview">
                            <div className="preview-header">
                                <div className="preview-logo">
                                    <span className="saffron-text">।</span>
                                    <span className="bold-text">Nirman Mitra</span>
                                </div>
                                <div className="preview-user">
                                    <span className="preview-badge">ACTIVE WORKER</span>
                                    <span>Ramesh</span>
                                    <div className="preview-avatar">R</div>
                                </div>
                            </div>
                            <div className="preview-body">
                                <h3 className="preview-greeting">Namaste, Ramesh!</h3>
                                <p className="preview-subtext">Welcome to Nirman Mitra. Track your attendance and certificate progress.</p>
                                <div className="preview-cards">
                                    <div className="preview-card">
                                        <div className="preview-card-icon">📸</div>
                                        <strong>Daily Attendance</strong>
                                        <p>Selfie + voice note checked via face match & GPS</p>
                                    </div>
                                    <div className="preview-card">
                                        <div className="preview-card-icon">📜</div>
                                        <strong>Smart Certificate</strong>
                                        <p>QR-verified PDF auto-generated at 90 days</p>
                                    </div>
                                </div>
                                <div className="preview-app-section">
                                    <div className="preview-app-header">
                                        <span>ATTENDANCE LOG</span>
                                        <span className="preview-link">LIVE STATUS</span>
                                    </div>
                                    <div className="preview-app-items">
                                        <div className="preview-app-item">
                                            <p className="preview-app-title">Day 67 — Selfie verified, GPS matched ✓</p>
                                            <span className="preview-date">3/6/2026, 8:35 AM</span>
                                            <span className="preview-status active">● VERIFIED</span>
                                        </div>
                                        <div className="preview-app-item">
                                            <p className="preview-app-title">Day 66 — Voice note logged, face verified ✓</p>
                                            <span className="preview-date">3/5/2026, 9:10 AM</span>
                                            <span className="preview-status active">● VERIFIED</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="preview-caption">Worker Attendance & Certificate Tracker</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── AI Infrastructure Section ── */}
            <section id="workers" className="infra-section fade-in-up">
                <div className="infra-container">
                    <div className="infra-left">
                        <h2>Powered by AWS AI Services</h2>
                        <p>
                            Multimodal AI processing vision, voice, and language in parallel
                            via Step Functions. Offline-tolerant with SQS queues. KMS-encrypted Aadhaar data, DPDP 2023 compliant.
                        </p>
                        <div className="infra-stats">
                            <div>
                                <div className="infra-stat-number saffron">71M+</div>
                                <div className="infra-stat-label">WORKERS</div>
                            </div>
                            <div>
                                <div className="infra-stat-number green-text">9</div>
                                <div className="infra-stat-label">LANGUAGES</div>
                            </div>
                        </div>
                    </div>
                    <div className="infra-right">
                        <div className="bento-grid">
                            {TECH_CARDS.map((card, i) => (
                                <div key={i} className={`bento-card bento-card-${i}`}>
                                    <div className="bento-sparkle">{card.icon}</div>
                                    <div className="bento-title">{card.title}</div>
                                    <div className="bento-desc">{card.desc}</div>
                                    <div className="bento-tag">{card.tag}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA / Preview Section (Redesigned 3D Showcase) ──────────────────── */}
            <section id="features" className="cta-section fade-in-up">
                <div className="premium-showcase-container">
                    {/* The Golden Stand Backplate */}
                    <div className="golden-stand-backplate">
                        <div className="golden-stand-texture"></div>
                    </div>

                    <div className="showcase-content flex-row">
                        {/* Left: Certificate Preview Card */}
                        <div className="premium-certificate-card">
                            <div className="premium-cert-header">
                                <span className="premium-logo"><span className="saffron-text">।</span> <span className="bold-text">Nirman Mitra</span></span>
                                <div className="premium-badge-group">
                                    <span className="badge-tag">CERTIFICATE</span>
                                </div>
                            </div>

                            <div className="premium-cert-body">
                                <h3>Certificate Preview</h3>
                                <p className="subtitle">Auto-generated after 90 verified attendance days</p>

                                <div className="premium-features-row">
                                    <div className="premium-feature">
                                        <div className="feature-top-icon">🔐</div>
                                        <div className="feature-text">
                                            <h4>SHA-256 Signed</h4>
                                            <p>Tamper-proof digital signature verified on every scan.</p>
                                        </div>
                                    </div>
                                    <div className="premium-feature">
                                        <div className="feature-top-icon qr-code-icon">📱</div>
                                        <div className="feature-text">
                                            <h4>QR Code Verified</h4>
                                            <p>Scannable QR code for instant BOCW authenticity check.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="premium-details-section">
                                    <div className="details-header">
                                        <span>CERTIFICATE DETAILS</span>
                                        <span className="verified-text">VERIFIED ✓</span>
                                    </div>
                                    <div className="premium-detail-row">
                                        <div className="detail-meta">
                                            <span className="worker-info">Worker: <strong>Ramesh Kumar</strong> | ID: NM-2026-04521</span>
                                            <span className="issue-date">Issued: 3/6/2026</span>
                                        </div>
                                        <div className="detail-status valid">● VALID</div>
                                    </div>
                                    <div className="premium-detail-row">
                                        <div className="detail-meta">
                                            <span className="worker-info">90/90 days verified | Site: Sector 42, Noida</span>
                                            <span className="issue-date">BOCW Board: Uttar Pradesh</span>
                                        </div>
                                        <div className="detail-status accepted">● ACCEPTED</div>
                                    </div>
                                    <div className="premium-borderless-row">
                                        <div className="log-section">
                                            <span className="log-title">EMPLOYMENT VERIFICATION LOG</span>
                                            <p>Start Date: Jan 15, 2026</p>
                                            <p>Job Site: Alpha Tech Park</p>
                                            <p>Daily Log Submitted: Yes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Floating WhatsApp Phone & Glow */}
                        <div className="premium-whatsapp-portal">
                            <div className="energy-connection">
                                <svg width="150" height="100" viewBox="0 0 150 100" fill="none" className="energy-line">
                                    <path d="M0 50 C 50 50, 100 50, 150 50" stroke="url(#gold-glow)" strokeWidth="3" strokeDasharray="6 6" className="dash-line" />
                                    <path d="M0 20 C 75 20, 75 50, 150 50" stroke="url(#gold-glow)" strokeWidth="1.5" opacity="0.6" className="wave-line-1" />
                                    <path d="M0 80 C 75 80, 75 50, 150 50" stroke="url(#gold-glow)" strokeWidth="1.5" opacity="0.6" className="wave-line-2" />
                                    <defs>
                                        <linearGradient id="gold-glow" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
                                            <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            <div className="concentric-portal">
                                <div className="portal-ring ring-1"></div>
                                <div className="portal-ring ring-2"></div>
                                <div className="portal-ring ring-3"></div>
                                <div className="portal-ring ring-4"></div>

                                <div className="phone-mockup">
                                    <div className="phone-screen">
                                        <div className="wa-topbar">
                                            <div className="wa-back">‹</div>
                                            <div className="wa-avatar-icon"></div>
                                            <div className="wa-name">Nirman Mitra</div>
                                        </div>
                                        <div className="wa-chat-bg">
                                            <div className="wa-bubble receive">
                                                <div className="wa-cert-preview">
                                                    <div className="cert-preview-icon"></div>
                                                    <div className="cert-preview-text">
                                                        <strong>Certificate</strong>
                                                        <span>PDF • 1.2 MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="wa-bubble send">
                                                Forward to Contact ➡️
                                            </div>
                                        </div>
                                        <div className="wa-input-bar">
                                            <span className="wa-plus">+</span>
                                            <div className="wa-message-box">Message</div>
                                            <span className="wa-mic">🎙️</span>
                                        </div>
                                    </div>

                                    {/* The glowing floating button */}
                                    <a href="https://api.whatsapp.com/send?phone=919999999999&text=Namaste%20Nirman%20Mitra" target="_blank" rel="noopener noreferrer" className="premium-cta-pill" style={{ textDecoration: 'none' }}>
                                        <span className="pill-text">Try on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Tagline ──────────────────── */}
            <section className="tagline-section fade-in-up">
                <p>
                    Empowering 71 million construction workers with voice-first AI.
                    From selfie to Smart Certificate — zero paperwork, zero literacy barriers.
                </p>
            </section>

            {/* ── Footer ──────────────────── */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span className="saffron">Nirman</span>
                                <span className="slash">/</span>
                                <span className="green">Mitra</span>
                            </div>
                            <p>AI-powered Techno-Legal Concierge for India's construction workers. Bridging the gap between 71 million workers and BOCW welfare benefits through voice-first AI on WhatsApp.</p>
                            <div className="footer-socials">
                                <a href="#" className="social-link" aria-label="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg></a>
                                <a href="#" className="social-link" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
                                <a href="#" className="social-link" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg></a>
                                <a href="#" className="social-link" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg></a>
                            </div>
                        </div>
                        <div className="footer-col"><h4>Platform</h4>
                            <ul>
                                <li><a href="#platform">Voice AI Engine</a></li>
                                <li><a href="#platform">Document Intelligence</a></li>
                                <li><a href="#platform">Smart Certificates</a></li>
                                <li><Link to="/dashboard">Admin Dashboard</Link></li>
                            </ul>
                        </div>
                        <div className="footer-col"><h4>Company</h4>
                            <ul>
                                <li><a href="#about">About Mission</a></li>
                                <li><a href="#">Our Story</a></li>
                                <li><a href="#">Team Bharat</a></li>
                                <li><a href="#">Careers</a></li>
                            </ul>
                        </div>
                        <div className="footer-col"><h4>Contact Us</h4>
                            <ul className="footer-contact">
                                <li><span className="contact-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF671F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></span><span>AI Research Lab, New Delhi, India</span></li>
                                <li><span className="contact-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF671F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></span><span>contact@nirmanmitra.in</span></li>
                                <li><span className="contact-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF671F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg></span><span>+91 1800-NIRMAN</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 Nirman Mitra AI. Designed with ❤️ for a digital Bharat.</p>
                        <div className="footer-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
