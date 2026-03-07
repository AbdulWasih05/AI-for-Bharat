import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReviewQueue from './pages/ReviewQueue';
import WorkerSearch from './pages/WorkerSearch';
import CertificateVerify from './pages/CertificateVerify';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="verify/:hash" element={<CertificateVerify />} />
                <Route path="verify" element={<CertificateVerify />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="review" element={<ReviewQueue />} />
                    <Route path="workers" element={<WorkerSearch />} />
                    <Route path="workers/:id" element={<WorkerSearch />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
