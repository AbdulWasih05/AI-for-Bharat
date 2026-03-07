import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API_BASE_URL = '';

const CONFIDENCE_DATA = [
    { name: 'Auto-Approved (>=80%)', value: 85, color: '#22c55e' },
    { name: 'Pending Review (60-80%)', value: 10, color: '#f59e0b' },
    { name: 'Rejected (<60%)', value: 5, color: '#ef4444' },
];

const DAILY_LOGS = [
    { day: 'Mon', logs: 45 }, { day: 'Tue', logs: 52 }, { day: 'Wed', logs: 48 },
    { day: 'Thu', logs: 61 }, { day: 'Fri', logs: 67 }, { day: 'Sat', logs: 38 }, { day: 'Sun', logs: 12 },
];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [isLive, setIsLive] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/dashboard`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setStats({
                    active_workers: data.activeWorkers,
                    total_workers: data.totalWorkers,
                    pending_reviews: data.pendingReviews,
                    total_days_logged: data.totalDaysLogged,
                    average_days: data.averageDaysPerWorker,
                    onboarding_workers: data.onboardingWorkers,
                });
                setIsLive(true);
            } catch {
                setStats({
                    active_workers: 0, total_workers: 0, pending_reviews: 0,
                    total_days_logged: 0, average_days: 0, onboarding_workers: 0,
                });
                setIsLive(false);
            }
            setLastUpdated(new Date());
        }
        fetchDashboard();
    }, []);

    if (!stats) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>Dashboard</h2>
                    <p>Real-time overview of Nirman Mitra platform activity</p>
                    {lastUpdated && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Last Updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: isLive ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                    color: isLive ? '#22c55e' : '#f59e0b',
                    border: `1px solid ${isLive ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                }}>
                    <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: isLive ? '#22c55e' : '#f59e0b',
                        boxShadow: isLive ? '0 0 6px #22c55e' : '0 0 6px #f59e0b',
                    }} />
                    {isLive ? 'Live' : 'Demo'}
                </span>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon workers">👷</div>
                    <div className="stat-info"><h3>{stats.active_workers}</h3><p>Active Workers</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon attendance">📸</div>
                    <div className="stat-info"><h3>{stats.total_days_logged}</h3><p>Total Days Logged</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon reviews">⏳</div>
                    <div className="stat-info"><h3>{stats.pending_reviews}</h3><p>Pending Reviews</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon certificates">📜</div>
                    <div className="stat-info"><h3>{stats.total_workers}</h3><p>Total Registered</p></div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>AI Confidence Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={CONFIDENCE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value"
                                label={({ value }) => `${value}%`}>
                                {CONFIDENCE_DATA.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                            </Pie>
                            <Tooltip /><Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h3>Daily Attendance Logs (This Week)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={DAILY_LOGS}>
                            <XAxis dataKey="day" stroke="#5a5e73" fontSize={12} />
                            <YAxis stroke="#5a5e73" fontSize={12} />
                            <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2a2d3e', borderRadius: '8px', color: '#f0f2f5' }} />
                            <Bar dataKey="logs" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>Platform Health</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Average Days/Worker</p>
                        <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>{stats.average_days}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Registered</p>
                        <p style={{ fontSize: '24px', fontWeight: 700 }}>{stats.total_workers}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>AWS Services Active</p>
                        <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)' }}>15</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
