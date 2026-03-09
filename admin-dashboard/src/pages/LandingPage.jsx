import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../landing.css';

/* ── Preloader Words (Multi-language greetings like reference) ── */
const PRELOADER_WORDS = ['Namaste', 'नमस्ते', 'নমস্কার', 'నమస్తే', 'ನಮಸ್ಕಾರ', 'નમસ્તે', 'നമസ്കാരം', 'Hello'];

/* ── Infinite Scroll Logos ────────────────────────────────────── */
const SCROLL_LOGOS = [
    'BOCW Welfare', 'Aadhaar Verified', 'Smart Certificates', 'Voice AI',
    'Face Match', 'WhatsApp Bot', 'AWS Bedrock', 'Polly TTS',
];

/* ── How It Works Steps Data ──────────────────────────────────── */
const HOW_IT_WORKS_STEPS = [
    {
        num: 1,
        title: 'Say Hello — Start Registration',
        desc: "A construction worker sends 'Hi' or 'Namaste' on WhatsApp. Nirman Mitra greets them in their language and starts a simple voice-first registration. No apps to download, no forms to fill — just WhatsApp.",
        en: [
            { from: 'user', text: 'Hi' },
            { from: 'bot', text: 'Welcome to Nirman Mitra! 🏗️ I am your digital work companion. What is your name?' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
        ],
        hi: [
            { from: 'user', text: 'Namaste' },
            { from: 'bot', text: 'Nirman Mitra mein aapka swagat hai! 🏗️ Main aapka digital saathi hoon. Aapka naam kya hai?' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
        ],
    },
    {
        num: 2,
        title: 'Verify Identity — Aadhaar + Selfie',
        desc: 'The worker sends their name, then a photo of their Aadhaar card. Our AI extracts and validates details using Amazon Textract. A selfie enrolls their face via Amazon Rekognition. They share their work site location — building a verified digital identity in under 2 minutes.',
        en: [
            { from: 'user', text: 'Rajesh Kumar' },
            { from: 'bot', text: 'Thanks Rajesh! Please send a photo of your Aadhaar card 📄' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'user', text: '📷 [Aadhaar Photo]', isImage: true },
            { from: 'bot', text: '✅ Aadhaar verified! XXXX-XXXX-5678\nNow send a selfie for face enrollment 📸' },
            { from: 'user', text: '🤳 [Selfie]', isImage: true },
            { from: 'bot', text: '✅ Face enrolled! Share your work site location 📍', hasButton: 'Send Location' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'bot', text: '🎉 Registration complete! Welcome to Nirman Mitra, Rajesh!' },
        ],
        hi: [
            { from: 'user', text: 'Rajesh Kumar' },
            { from: 'bot', text: 'Dhanyavaad Rajesh! Ab Aadhaar card ka photo bhejiye 📄' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'user', text: '📷 [Aadhaar Photo]', isImage: true },
            { from: 'bot', text: '✅ Aadhaar verify ho gaya! XXXX-XXXX-5678\nAb selfie bhejiye 📸' },
            { from: 'user', text: '🤳 [Selfie]', isImage: true },
            { from: 'bot', text: '✅ Selfie save ho gaya! Ab location share karein 📍', hasButton: 'Location Bhejein' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'bot', text: '🎉 Registration poora! Nirman Mitra mein aapka swagat hai, Rajesh!' },
        ],
    },
    {
        num: 3,
        title: 'Mark Attendance — Triple Verification™',
        desc: 'Every day, the worker sends a selfie, shares GPS location, and records a voice note. Three AI systems verify simultaneously: Rekognition matches face, GPS confirms on-site presence, and Bedrock AI analyzes voice. Attendance is auto-approved in seconds.',
        en: [
            { from: 'user', text: '🤳 [Daily Selfie]', isImage: true },
            { from: 'bot', text: '📸 Selfie received! Share your location', hasButton: 'Send Location' },
            { from: 'user', text: '📍 Location shared' },
            { from: 'bot', text: '📍 Location received! Hold mic button and tell us:\nWhat work did you do today? 🎙️' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'user', text: '🎤 [Voice Note]', isVoice: true },
            { from: 'bot', text: '✅ Attendance verified! Day 3 logged.\n87 days remaining.\n\n👤 Face: 92% | 📍 GPS: 95% | 🎙️ Voice: 88%' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
        ],
        hi: [
            { from: 'user', text: '🤳 [Selfie]', isImage: true },
            { from: 'bot', text: '📸 Selfie mil gaya! Location share karein', hasButton: 'Location Bhejein' },
            { from: 'user', text: '📍 Location bheja' },
            { from: 'bot', text: '📍 Location mil gaya! Mic button dabake bataiye:\nAaj kya kaam kiya? 🎙️' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'user', text: '🎤 [Voice Note]', isVoice: true },
            { from: 'bot', text: '✅ Attendance verify ho gayi! Din 3 log hua.\n87 din baaki.\n\n👤 Face: 92% | 📍 GPS: 95% | 🎙️ Voice: 88%' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
        ],
    },
    {
        num: 4,
        title: 'Earn Your Smart Certificate',
        desc: 'After logging the required days, a tamper-proof Smart Certificate is auto-generated — a real PDF with SHA-256 hash, QR code, BOCW Act reference, and complete work history. Workers receive it on WhatsApp. No contractor needed, no paperwork — AI-verified proof of employment.',
        en: [
            { from: 'user', text: 'certificate' },
            { from: 'bot', text: '🎉 Congratulations Rajesh!\nYour Smart Certificate is ready!\n\n📜 BOCW Ref: BOCW-2026-A7X3KM\n🔐 SHA-256 Verified\n📥 Download: certificate.pdf' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'bot', text: '', isCert: true },
        ],
        hi: [
            { from: 'user', text: 'certificate' },
            { from: 'bot', text: '🎉 Badhai ho Rajesh!\nAapka Smart Certificate taiyar hai!\n\n📜 BOCW Ref: BOCW-2026-A7X3KM\n🔐 SHA-256 Verified\n📥 Download: certificate.pdf' },
            { from: 'bot', text: '🔊 Voice Reply', isVoice: true },
            { from: 'bot', text: '', isCert: true },
        ],
    },
];

/* ── Display Card Data (Tech Specs) ──────────────────────────── */
const DISPLAY_CARDS = [
    { title: 'Amazon Bedrock', desc: 'Claude AI for voice intent & document verification', tag: 'AI ENGINE', color: 'orange' },
    { title: 'Amazon Rekognition', desc: 'Face-match attendance with geo-tagged selfies', tag: 'VISION AI', color: 'green' },
    { title: 'Amazon Polly', desc: 'Text-to-speech in 9 Indian languages', tag: 'VOICE AI', color: 'blue' },
    { title: 'Smart Certificates', desc: 'SHA-256 signed PDF with QR code verification', tag: 'DOC ENGINE', color: 'purple' },
];

/* ── Bridge Checklist Features ────────────────────────────────── */
const BRIDGE_FEATURES = [
    'Multi-language Voice-First interfaces',
    'Selfie + GPS + voice triple verification',
    'Real-time BOCW welfare eligibility tracking',
];

/* ═══════════════════════════════════════════════════════════════
   Preloader Component
   ═══════════════════════════════════════════════════════════════ */
function Preloader({ onFinish }) {
    const [index, setIndex] = useState(0);
    const [hidden, setHidden] = useState(false);
    const [removed, setRemoved] = useState(false);
    const wordRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        if (index < PRELOADER_WORDS.length - 1) {
            const timer = setTimeout(() => {
                if (wordRef.current) {
                    wordRef.current.style.opacity = '0';
                    setTimeout(() => {
                        setIndex(prev => prev + 1);
                        if (wordRef.current) wordRef.current.style.opacity = '1';
                    }, 150);
                }
            }, 250);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setHidden(true);
                setTimeout(() => {
                    setRemoved(true);
                    document.body.style.overflow = '';
                    onFinish?.();
                }, 1200);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [index, onFinish]);

    if (removed) return null;

    return (
        <div className={`preloader ${hidden ? 'preloader--hidden' : ''}`}>
            <p className="preloader__text" ref={wordRef} style={{ opacity: 1 }}>
                <span className="preloader__dot"></span>
                <span className="preloader__word">{PRELOADER_WORDS[index]}</span>
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   TextGradientScroll Component (Scroll-based word reveal)
   ═══════════════════════════════════════════════════════════════ */
function TextGradientScroll({ text }) {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);

    // Split into tokens, preserving \n as separate tokens
    const tokens = [];
    text.split('\n').forEach((line, li) => {
        if (li > 0) tokens.push('\n');
        line.split(' ').filter(Boolean).forEach(w => tokens.push(w));
    });
    const wordTokens = tokens.filter(t => t !== '\n');
    const totalWords = wordTokens.length;

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const viewH = window.innerHeight;
            const start = viewH * 0.7;
            const end = viewH * 0.3;
            const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
            setProgress(p);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    let wordIndex = 0;
    return (
        <div ref={containerRef} className="tgs-container">
            {tokens.map((token, i) => {
                if (token === '\n') {
                    return <div key={`br-${i}`} className="tgs-break" />;
                }
                const wi = wordIndex++;
                const wordStart = wi / totalWords;
                const wordEnd = wordStart + 1 / totalWords;
                const chars = token.split('');
                return (
                    <span key={i} className="tgs-word">
                        {chars.map((char, j) => {
                            const charStart = wordStart + (j / chars.length) * (wordEnd - wordStart);
                            const charEnd = wordStart + ((j + 1) / chars.length) * (wordEnd - wordStart);
                            const opacity = Math.min(1, Math.max(0.1, (progress - charStart) / (charEnd - charStart)));
                            return (
                                <span key={j} className="tgs-char" style={{ opacity }}>
                                    {char}
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   InfiniteScroll Logos Component
   ═══════════════════════════════════════════════════════════════ */
function InfiniteLogos() {
    const allLogos = [...SCROLL_LOGOS, ...SCROLL_LOGOS, ...SCROLL_LOGOS];
    return (
        <div className="logos-section">
            <p className="logos-label">POWERING NIRMAN MITRA</p>
            <div className="logos-track-wrapper">
                <div className="logos-track">
                    {allLogos.map((name, i) => (
                        <span key={i} className="logo-text">{name}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Feature Carousel Component
   ═══════════════════════════════════════════════════════════════ */
function FeatureCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % CAROUSEL_VIEWS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="carousel-wrapper">
            <div className="carousel-ring">
                <div className="carousel-slides" style={{ transform: `translateX(-${current * 100}%)` }}>
                    {CAROUSEL_VIEWS.map((view, i) => (
                        <div key={i} className="carousel-slide">
                            <div className={`carousel-mockup mockup-${i}`}>
                                <div className="mockup-topbar">
                                    <div className="mockup-dots">
                                        <span /><span /><span />
                                    </div>
                                    <span className="mockup-title">{view.title}</span>
                                </div>
                                <div className="mockup-body">
                                    <div className="mockup-placeholder">
                                        <div className="mp-line w80" />
                                        <div className="mp-line w60" />
                                        <div className="mp-cards">
                                            <div className="mp-card" />
                                            <div className="mp-card" />
                                        </div>
                                        <div className="mp-line w40" />
                                        <div className="mp-line w70" />
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-caption">{view.title}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="carousel-dots">
                {CAROUSEL_VIEWS.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel-dot ${i === current ? 'active' : ''}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
            <div className="carousel-nav">
                <button className="carousel-btn" onClick={() => setCurrent(p => (p - 1 + CAROUSEL_VIEWS.length) % CAROUSEL_VIEWS.length)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    Previous
                </button>
                <button className="carousel-btn" onClick={() => setCurrent(p => (p + 1) % CAROUSEL_VIEWS.length)}>
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   DisplayCards Component (Stacked skewed cards)
   ═══════════════════════════════════════════════════════════════ */
function DisplayCards() {
    const colors = {
        orange: { icon: '#fb923c', title: '#f97316', bg: 'rgba(251,146,60,0.12)' },
        green: { icon: '#4ade80', title: '#22c55e', bg: 'rgba(74,222,128,0.12)' },
        blue: { icon: '#FF9933', title: '#e86a33', bg: 'rgba(255,153,51,0.12)' },
        purple: { icon: '#c084fc', title: '#a855f7', bg: 'rgba(192,132,252,0.12)' },
    };

    return (
        <div className="dc-stack">
            {DISPLAY_CARDS.map((card, i) => {
                const c = colors[card.color];
                return (
                    <div
                        key={i}
                        className={`dc-card dc-card-${i}`}
                        style={{ '--card-color': c.title, '--card-bg': c.bg }}
                    >
                        <div className="dc-top">
                            <span className="dc-icon-badge" style={{ background: c.bg }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" /></svg>
                            </span>
                            <span className="dc-title" style={{ color: c.title }}>{card.title}</span>
                        </div>
                        <p className="dc-desc">{card.desc}</p>
                        <span className="dc-tag">{card.tag}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   OrnateAudioPlayer Component (SVG flower + play button)
   ═══════════════════════════════════════════════════════════════ */
function OrnateAudioPlayer() {
    return (
        <div className="ornate-player">
            <div className="ornate-outer">
                <svg viewBox="0 0 200 200" className="ornate-svg ornate-spin">
                    <path fill="#F58220" d="M100 0 C110 40 160 40 160 100 C160 160 110 160 100 200 C90 160 40 160 40 100 C40 40 90 40 100 0 M100 30 C130 30 170 70 170 100 C170 130 130 170 100 170 C70 170 30 130 30 100 C30 70 70 30 100 30" opacity="0.2" />
                    <g transform="translate(100, 100)">
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                            <path key={angle} transform={`rotate(${angle})`} fill="#F58220" d="M0 -90 C15 -70 25 -40 0 -20 C-25 -40 -15 -70 0 -90" opacity="0.4" />
                        ))}
                        <circle cx="0" cy="0" r="70" fill="url(#ornGrad)" />
                    </g>
                    <defs>
                        <radialGradient id="ornGrad">
                            <stop offset="0%" stopColor="#F9A03F" />
                            <stop offset="100%" stopColor="#F58220" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
            <div className="ornate-inner">
                <svg viewBox="0 0 200 200" className="ornate-svg">
                    <path fill="#F58220" d="M100 20 C115 50 150 50 180 100 C150 150 115 150 100 180 C85 150 50 150 20 100 C50 50 85 50 100 20" opacity="0.9" />
                    <path fill="#F9A03F" d="M100 40 C110 65 140 65 160 100 C140 135 110 135 100 160 C90 135 60 135 40 100 C60 65 90 65 100 40" />
                </svg>
            </div>
            <div className="ornate-center">
                <a
                    href="https://api.whatsapp.com/send?phone=15551445754&text=Namaste%20Nirman%20Mitra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ornate-btn"
                >
                    <div className="ornate-play-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#F58220"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <span>Try on WhatsApp</span>
                </a>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   WhatsApp Phone Mockup Component
   ═══════════════════════════════════════════════════════════════ */
function WhatsAppMockup({ messages }) {
    return (
        <div className="wa-phone-frame">
            <div className="wa-phone-notch" />
            <div className="wa-phone-screen">
                {/* WhatsApp header */}
                <div className="wa-header">
                    <div className="wa-header-left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                        <div className="wa-avatar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        </div>
                        <div className="wa-header-info">
                            <span className="wa-contact-name">Nirman Mitra</span>
                            <span className="wa-status-text">online</span>
                        </div>
                    </div>
                    <div className="wa-header-icons">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"/></svg>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </div>
                </div>
                {/* Chat area */}
                <div className="wa-chat-area">
                    <div className="wa-date-chip"><span>Today</span></div>
                    {messages.map((msg, i) => (
                        <div key={i} className={`wa-msg ${msg.from === 'user' ? 'wa-msg-out' : 'wa-msg-in'}`}>
                            {msg.isCert ? (
                                <div className="wa-cert-card">
                                    <div className="wa-cert-top">
                                        <div className="wa-cert-icon">📜</div>
                                        <div>
                                            <div className="wa-cert-title">Smart Certificate</div>
                                            <div className="wa-cert-meta">PDF · 1.2 MB · SHA-256 Verified</div>
                                        </div>
                                    </div>
                                    <div className="wa-cert-preview">
                                        <div className="wa-cert-preview-inner">
                                            <div className="wa-cert-badge">BOCW VERIFIED</div>
                                            <div className="wa-cert-name">Rajesh Kumar</div>
                                            <div className="wa-cert-days">90/90 Days Verified</div>
                                            <div className="wa-cert-qr">▣ QR</div>
                                        </div>
                                    </div>
                                </div>
                            ) : msg.isImage ? (
                                <div className="wa-img-placeholder">
                                    <div className="wa-img-icon">{msg.text.includes('Aadhaar') ? '📄' : msg.text.includes('Selfie') || msg.text.includes('selfie') ? '📸' : '🖼️'}</div>
                                    <span>{msg.text.replace(/[📷🤳] /, '')}</span>
                                </div>
                            ) : msg.isVoice ? (
                                <div className="wa-voice-bubble">
                                    <div className="wa-voice-avatar">{msg.from === 'user' ? '👤' : '🤖'}</div>
                                    <div className="wa-voice-wave">
                                        {[3,5,8,12,8,14,10,6,9,12,7,4,8,11,6,3].map((h,j) => (
                                            <div key={j} className="wa-wave-bar" style={{height: `${h}px`}} />
                                        ))}
                                    </div>
                                    <span className="wa-voice-dur">0:04</span>
                                </div>
                            ) : (
                                <>
                                    <span className="wa-msg-text">{msg.text}</span>
                                    {msg.hasButton && (
                                        <div className="wa-action-btn">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                            {msg.hasButton}
                                        </div>
                                    )}
                                </>
                            )}
                            <span className="wa-msg-time">{`${9 + i}:${String(i * 7 + 10).padStart(2, '0').slice(0,2)} AM`}</span>
                        </div>
                    ))}
                </div>
                {/* Input bar */}
                <div className="wa-input-bar-mock">
                    <div className="wa-input-row">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                        <div className="wa-input-field">Type a message</div>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                    </div>
                    <div className="wa-mic-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   HowItWorks Step Component
   ═══════════════════════════════════════════════════════════════ */
function HowItWorksStep({ step, index }) {
    const [lang, setLang] = useState('en');
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    const isReversed = index % 2 === 1;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const messages = lang === 'hi' ? step.hi : step.en;

    return (
        <div ref={ref} className={`hiw-step ${isReversed ? 'hiw-reversed' : ''} ${visible ? 'hiw-visible' : ''}`}>
            {/* Timeline connector */}
            <div className="hiw-timeline">
                <div className="hiw-circle">{step.num}</div>
                {index < 3 && <div className="hiw-line" />}
            </div>

            {/* Text side */}
            <div className="hiw-text">
                <div className="hiw-step-label">STEP {step.num}</div>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.desc}</p>
            </div>

            {/* Phone mockup side */}
            <div className="hiw-phone">
                {/* Language tab switcher */}
                <div className="hiw-lang-tabs">
                    <button className={`hiw-tab ${lang === 'en' ? 'hiw-tab-active' : ''}`} onClick={() => setLang('en')}>English</button>
                    <button className={`hiw-tab ${lang === 'hi' ? 'hiw-tab-active' : ''}`} onClick={() => setLang('hi')}>हिन्दी</button>
                </div>
                <WhatsAppMockup messages={messages} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   HowItWorks Section
   ═══════════════════════════════════════════════════════════════ */
function HowItWorksSection() {
    return (
        <section id="platform" className="hiw-section">
            <div className="hiw-header">
                <span className="hiw-badge">HOW IT WORKS</span>
                <h2 className="hiw-main-title">From Hello to Smart Certificate<br />in 4 Simple Steps</h2>
                <p className="hiw-main-desc">No apps, no forms, no literacy required — just WhatsApp.</p>
            </div>
            <div className="hiw-steps">
                {HOW_IT_WORKS_STEPS.map((step, i) => (
                    <HowItWorksStep key={step.num} step={step} index={i} />
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SVG Icons
   ═══════════════════════════════════════════════════════════════ */
const GithubIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>;
const TwitterIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
const LinkedInIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
const InstagramIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
const MapPinIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>;
const CheckCircle = () => <div className="check-circle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>;

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [preloaderDone, setPreloaderDone] = useState(false);

    /* Override body styles for light theme */
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;
        const origBodyBg = body.style.background;
        const origBodyColor = body.style.color;
        const origHtmlBg = html.style.background;
        body.style.background = '#fafafa';
        body.style.color = '#0f172a';
        html.style.background = '#fafafa';
        return () => {
            body.style.background = origBodyBg;
            body.style.color = origBodyColor;
            html.style.background = origHtmlBg;
        };
    }, []);

    /* Scroll detection for navbar */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="landing-root">
            <Preloader onFinish={() => setPreloaderDone(true)} />

            {/* ── Ambient Top Gradients & Background ───────────────── */}
            <div className="ambient-gradients">
                <div className="hero-bg-image" />
                <div className="grad-saffron" />
                <div className="grad-fade" />
            </div>

            {/* ── Fixed Pill Navbar ──────────────────────────────── */}
            <nav className={`landing-nav pill-nav ${scrolled ? 'nav-scrolled' : ''}`}>
                <div className="nav-inner nav-pill">
                    <Link to="/home" className="nav-logo">
                        <span className="logo-text-nm">NIRMAN MITRA</span>
                    </Link>

                    <div className="nav-links">
                        <a href="#platform" className="nav-link">Platform <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></a>
                        <a href="#workers" className="nav-link">Workers <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></a>
                        <a href="#about" className="nav-link">About <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></a>
                    </div>

                    <div className="nav-actions">
                        <a href="https://api.whatsapp.com/send?phone=15551445754&text=Namaste%20Nirman%20Mitra" target="_blank" rel="noopener noreferrer" className="nav-btn-outline">
                            Try on WhatsApp
                        </a>
                        <Link to="/dashboard" className="nav-btn-dark">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ─────────────────────────────────── */}
            <main className="hero-section">
                
                {/* ── Top Mandala Decoration ─────────────────────── */}
                <div className="hero-mandala">
                    <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.6" stroke="#9A7B4F" strokeWidth="0.5">
                            {/* Half-mandala pattern hanging from top */}
                            <path d="M 0,0 C 20,40 40,60 100,80 C 160,60 180,40 200,0" fill="rgba(255, 235, 200, 0.1)" strokeWidth="1.5" />
                            <path d="M 20,0 C 40,20 60,40 100,50 C 140,40 160,20 180,0" />
                            <path d="M 40,0 C 60,10 80,20 100,25 C 120,20 140,10 160,0" />
                            <circle cx="100" cy="15" r="5" fill="#9A7B4F" />
                            <circle cx="100" cy="35" r="3" fill="#9A7B4F" />
                            <circle cx="100" cy="80" r="2" fill="#9A7B4F" />
                            {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map(x => (
                                <path key={x} d={`M ${x},0 L 100,25`} opacity="0.2" />
                            ))}
                            <path d="M 85,80 L 115,80 L 100,95 Z" fill="rgba(154, 123, 79, 0.3)" strokeWidth="1" />
                        </g>
                    </svg>
                </div>

                <div className="hero-ribbon-banner">
                    <div className="ribbon-content">
                        <span>India's First Voice-AI Welfare Platform</span>
                    </div>
                </div>

                <h1 className="hero-headline">
                    Voice-first AI for India's<br/>builders
                </h1>

                <p className="hero-sub">
                    Built for 71 million construction workers.ALL Powered by AWS AI services.<br />
                    Enabling BOCW welfare access through selfies, voice notes & geo-fencing.<br />
                    Zero literacy. Zero downloads. Zero contractor dependency.
                </p>



                <div className="hero-cta-wrapper">
                    <Link to="/dashboard" className="hero-cta-ornate">
                        <div className="cta-content">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="cta-icon">
                                <path d="M5 21v-8M12 21V9M19 21v-8M3 21h18M8 21v-5M16 21v-5M5 6l7-3 7 3" />
                                <rect x="5" y="6" width="14" height="15" rx="1" />
                                <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
                            </svg>
                            <span>Experience Nirman Mitra</span>
                        </div>
                    </Link>
                </div>

                {/* Infinite Scroll Logos */}
                <InfiniteLogos />

                {/* ── About / Mission Section ──────────────────── */}
                <section id="about" className="mission-section">
                    <div className="mission-label">OUR MISSION</div>
                    <TextGradientScroll
                        text={`Nirman Mitra is the ultimate Techno-Legal Concierge for India's construction workers.\nBy harnessing the power of voice-first AI, facial recognition, and automated document verification — we break down the barriers of literacy and documentation.\nOur mission is to ensure every worker, regardless of their language or digital literacy, has seamless access to the BOCW welfare benefits they deserve.\nThis is not just a portal; it is a movement towards a truly digital and inclusive India.`}
                    />
                </section>

                {/* ── How It Works Section ─────────────────────── */}
                <HowItWorksSection />

                {/* ── Tech Specs / Display Cards Section ───────── */}
                <section id="workers" className="tech-section">
                    <div className="tech-inner">
                        <div className="tech-left">
                            <h2 className="tech-title">
                                Powered by AWS<br />AI Services
                            </h2>
                            <p className="tech-desc">
                                Multimodal AI processing vision, voice, and language in parallel. KMS-encrypted Aadhaar data, DPDP 2023 compliant, offline-tolerant with SQS queues.
                            </p>
                            <div className="tech-stats">
                                <div>
                                    <div className="stat-number stat-saffron">71M+</div>
                                    <div className="stat-label">WORKERS</div>
                                </div>
                                <div>
                                    <div className="stat-number stat-green">9</div>
                                    <div className="stat-label">LANGUAGES</div>
                                </div>
                            </div>
                        </div>
                        <div className="tech-right">
                            <DisplayCards />
                        </div>
                    </div>
                </section>

                {/* ── Video & Audio Section ────────────────────── */}
                <section id="demo-video" className="media-section">
                    <div className="media-inner">
                        <div className="media-video">
                            <div className="video-card">
                                <div className="video-badge">Product Demo</div>
                                <div className="video-placeholder">
                                    <div className="video-play-overlay">
                                        <div className="video-content-mock">
                                            <div className="vcm-header">
                                                <span className="vcm-logo"><span style={{color:'#FF9933'}}>Nirman</span> <span style={{color:'#138808'}}>Mitra</span></span>
                                            </div>
                                            <div className="vcm-body">
                                                <h3>AI Techno-Legal Concierge</h3>
                                                <p>Voice-first welfare access for construction workers</p>
                                                <div className="vcm-features">
                                                    <span>Face Verify</span>
                                                    <span>GPS Match</span>
                                                    <span>Voice AI</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="media-audio">
                            <OrnateAudioPlayer />
                        </div>
                    </div>
                    {/* WhatsApp Demo Notice */}
                    <div className="wa-demo-notice">
                        <div className="wa-demo-notice-icon">&#9432;</div>
                        <p>
                            <strong>WhatsApp Bot Notice:</strong> Due to Meta's test account restrictions, the WhatsApp bot can only reply to pre-registered phone numbers. Please watch the live demo above to see the full working flow — from registration to attendance to certificate generation.
                        </p>
                    </div>
                </section>

            </main>

            {/* ── Footer — Modern Minimal ─────────────────────── */}
            <footer className="landing-footer">
                <div className="footer-main">
                    <div className="footer-container">
                        <div className="footer-grid">
                            {/* Brand */}
                            <div className="footer-brand">
                                <span className="footer-logo-text">NIRMAN MITRA</span>
                                <p className="footer-tagline">Builder's Friend</p>
                                <p className="footer-brand-desc">
                                    AI-powered voice-first platform helping India's 71 million construction workers access BOCW welfare benefits through WhatsApp.
                                </p>
                            </div>

                            {/* Platform links */}
                            <div className="footer-col">
                                <h4>Platform</h4>
                                <ul>
                                    <li><a href="#platform">How It Works</a></li>
                                    <li><a href="#workers">For Workers</a></li>
                                    <li><Link to="/verify">Verify Certificate</Link></li>
                                    <li><Link to="/dashboard">Admin Dashboard</Link></li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div className="footer-col">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="#about">About the Mission</a></li>
                                    <li><a href="https://github.com/AbdulWasih05/AI-for-Bharat" target="_blank" rel="noopener noreferrer">GitHub Repo</a></li>
                                    <li><a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer">Powered by AWS</a></li>
                                </ul>
                            </div>

                            {/* Connect */}
                            <div className="footer-col">
                                <h4>Connect</h4>
                                <ul>
                                    <li>
                                        <a href="https://api.whatsapp.com/send?phone=15551445754&text=Hi" target="_blank" rel="noopener noreferrer" className="footer-link-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                            +1 (555) 144-5754
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/AbdulWasih05/AI-for-Bharat" target="_blank" rel="noopener noreferrer" className="footer-link-icon">
                                            <GithubIcon />
                                            GitHub
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="footer-bottom">
                            <p>&copy; {new Date().getFullYear()} Nirman Mitra. Built for Digital Bharat.</p>
                            <div className="footer-bottom-links">
                                <a href="#platform">Platform</a>
                                <span className="footer-dot"></span>
                                <a href="#about">About</a>
                                <span className="footer-dot"></span>
                                <a href="https://github.com/AbdulWasih05/AI-for-Bharat" target="_blank" rel="noopener noreferrer">Source</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
