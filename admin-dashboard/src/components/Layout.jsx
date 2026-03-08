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
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        🔒 Admin • MFA Enabled<br />
                        <span style={{ fontSize: '11px' }}>Built 100% on AWS</span>
                    </div>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
