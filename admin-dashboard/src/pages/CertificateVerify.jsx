import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = '';

export default function CertificateVerify() {
    const { hash } = useParams();
    const [cert, setCert] = useState(null);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [manualHash, setManualHash] = useState('');

    async function fetchCertificate(h) {
        if (!h) { setLoading(false); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/certificate/${h}/verify`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setVerified(data.verified);
            if (data.verified) {
                setCert({
                    workerName: data.certificate.worker_name,
                    totalDays: data.certificate.total_verified_days,
                    dateRange: `${data.certificate.date_range.from} to ${data.certificate.date_range.to}`,
                    sites: (data.certificate.sites_worked || []).map(s => s.name || s),
                    bocwRef: data.certificate.bocw_reference,
                    issueDate: new Date(data.certificate.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    hash: h,
                });
            } else {
                setCert(null);
            }
        } catch {
            setVerified(false);
            setCert(null);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (hash) fetchCertificate(hash);
        else setLoading(false);
    }, [hash]);

    function handleManualVerify(e) {
        e.preventDefault();
        if (manualHash.trim()) fetchCertificate(manualHash.trim());
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            padding: '32px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {/* Branding */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'var(--accent-gradient)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                    }}>
                        <span role="img" aria-label="building">&#x1F3D7;</span>
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '22px',
                            fontWeight: 700,
                            background: 'var(--accent-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Nirman Mitra
                        </h1>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            AI-Powered Construction Workforce Platform
                        </span>
                    </div>
                </div>
            </div>

            {/* Manual Search (when no hash in URL) */}
            {!hash && !cert && !loading && (
                <div className="card" style={{ maxWidth: '560px', width: '100%', marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '12px' }}>Verify a Certificate</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Enter the certificate verification hash from the QR code:
                    </p>
                    <form onSubmit={handleManualVerify} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Paste verification hash..."
                            value={manualHash}
                            onChange={e => setManualHash(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button className="btn btn-success btn-sm" type="submit" disabled={!manualHash.trim()}>
                            Verify
                        </button>
                    </form>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="card" style={{ maxWidth: '560px', width: '100%', textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Verifying certificate...</p>
                </div>
            )}

            {/* Main Card */}
            {!loading && (hash || cert) && (
                <div className="card" style={{ maxWidth: '560px', width: '100%' }}>
                    {/* Status Badge */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        {verified ? (
                            <span className="badge approved" style={{
                                fontSize: '15px',
                                padding: '8px 24px',
                                borderRadius: '24px',
                            }}>
                                Verified Certificate
                            </span>
                        ) : (
                            <span className="badge rejected" style={{
                                fontSize: '15px',
                                padding: '8px 24px',
                                borderRadius: '24px',
                            }}>
                                Certificate Not Found
                            </span>
                        )}
                    </div>

                    {verified && cert ? (
                        <>
                            <h2 style={{
                                textAlign: 'center',
                                fontSize: '20px',
                                fontWeight: 700,
                                marginBottom: '24px',
                            }}>
                                Work Attendance Certificate
                            </h2>

                            {/* Details Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '20px',
                                marginBottom: '24px',
                            }}>
                                <DetailItem label="Worker Name" value={cert.workerName} fullWidth />
                                <DetailItem label="Total Verified Days" value={`${cert.totalDays} days`} />
                                <DetailItem label="Date Range" value={cert.dateRange} />
                                <DetailItem label="BOCW Reference" value={cert.bocwRef} fullWidth />
                                <DetailItem label="Issue Date" value={cert.issueDate} />
                                <DetailItem label="Sites Worked" value={cert.sites.join('; ') || '-'} fullWidth />
                            </div>

                            {/* SHA-256 Hash */}
                            <div style={{
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--border-radius-sm)',
                                padding: '12px 16px',
                                marginBottom: '24px',
                            }}>
                                <p style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '6px',
                                }}>
                                    SHA-256 Certificate Hash
                                </p>
                                <p style={{
                                    fontSize: '12px',
                                    fontFamily: 'monospace',
                                    color: 'var(--text-secondary)',
                                    wordBreak: 'break-all',
                                    lineHeight: 1.5,
                                }}>
                                    {cert.hash}
                                </p>
                            </div>

                            {/* Triple Verification Badge */}
                            <div style={{
                                background: 'rgba(99, 102, 241, 0.08)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: 'var(--border-radius-sm)',
                                padding: '16px',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '6px',
                                }}>
                                    <span style={{ fontSize: '18px' }} role="img" aria-label="shield">&#x1F6E1;</span>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        background: 'var(--accent-gradient)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        Triple Verification&trade;
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.5,
                                }}>
                                    This certificate was verified through AI-powered facial recognition,
                                    GPS geofencing, and voice attestation via the Nirman Mitra platform.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <p style={{ fontSize: '48px', marginBottom: '16px' }} role="img" aria-label="warning">
                                &#x26A0;&#xFE0F;
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                                No certificate was found matching this hash.
                                <br />
                                Please verify the QR code and try again.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <p style={{
                marginTop: '24px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center',
            }}>
                Nirman Mitra &mdash; Empowering India's Construction Workforce with AI
            </p>
        </div>
    );
}

function DetailItem({ label, value, fullWidth }) {
    return (
        <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
            <p style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-muted)',
                marginBottom: '4px',
            }}>
                {label}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {value}
            </p>
        </div>
    );
}
