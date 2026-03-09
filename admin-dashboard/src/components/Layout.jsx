import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function Layout() {
    const [reviewCount, setReviewCount] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/admin/review-queue`)
            .then(res => res.json())
            .then(data => setReviewCount(data.count || 0))
            .catch(() => {});
    }, []);

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon">🏗️</div>
                        <div>
                            <h1>Nirman Mitra</h1>
                            <span>Admin Dashboard</span>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="icon">📊</span> Dashboard
                    </NavLink>
                    <NavLink to="/review" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="icon">📋</span> Review Queue
                        <span className="nav-badge">{reviewCount}</span>
                    </NavLink>
                    <NavLink to="/workers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="icon">👷</span> Workers
                    </NavLink>
                    <NavLink to="/verify" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <span className="icon">🔍</span> Verify Certificate
                    </NavLink>
                </nav>
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', background: 'linear-gradient(to right, rgba(255,153,51,0.05), rgba(255,255,255,0.05), rgba(19,136,8,0.05))' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        🔒 Admin • MFA Enabled<br />
                        <span style={{ fontSize: '11px', color: 'var(--green-india)' }}>Built 100% on AWS</span>
                    </div>
                </div>
            </aside>
            <main className="main-content">
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255,153,51,0.08) 0%, rgba(255,255,255,0.9) 50%, rgba(19,136,8,0.08) 100%)',
                    border: '1px solid rgba(19,136,8,0.2)',
                    borderLeft: '4px solid #ff9933',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '14px 20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>&#x1F4F1;</span>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            Worker experience happens via WhatsApp. Watch the demo video for the full flow.
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            This dashboard is the <strong>admin / welfare officer interface</strong> for managing registrations, reviewing AI-verified attendance, and issuing BOCW certificates.
                        </p>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
}
