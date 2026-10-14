import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

import { TopProgressBar } from '../components/common/TopProgressBar.jsx';
import { ScrollToTop } from '../components/common/ScrollToTop.jsx';

// Layouts
import { AppLayout } from '../layouts/AppLayout.jsx';

// Route guards
import { ProtectedRoute } from './ProtectedRoute.jsx';

// Public pages
import { LandingPage } from '../pages/LandingPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { SignupPage } from '../pages/SignupPage.jsx';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.jsx';

// Protected pages
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { SimulatorPage } from '../pages/SimulatorPage.jsx';
import { ProjectionsPage } from '../pages/ProjectionsPage.jsx';
import { ComparePage } from '../pages/ComparePage.jsx';
import { MarketPage, CompetitorsPage, RoadmapPage, PitchPage, RiskPage } from '../pages/IntelligencePages.jsx';
import { ProfilePage } from '../pages/ProfilePage.jsx';
import { NotFoundPage } from '../components/NotFoundPage.jsx';

// Redirect authenticated users away from login/signup
const GuestOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// 404 wrapper (works outside of router context)
const NotFound404 = () => (
  <div className="min-h-screen bg-[#0E1420]">
    <NotFoundPage onGoHome={() => window.location.replace('/')} />
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopProgressBar />
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Auth (guest only) ── */}
        <Route path="/login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
        <Route path="/signup" element={<GuestOnlyRoute><SignupPage /></GuestOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ── Protected app (persistent layout ensures shared sidebar/header do not remount) ── */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard"         element={<DashboardPage />} />
          <Route path="/simulator"         element={<SimulatorPage />} />
          <Route path="/projections"       element={<ProjectionsPage />} />
          <Route path="/compare"           element={<ComparePage />} />
          <Route path="/market"            element={<MarketPage />} />
          <Route path="/competitors"       element={<CompetitorsPage />} />
          <Route path="/roadmap"           element={<RoadmapPage />} />
          <Route path="/pitch-outline"     element={<PitchPage />} />
          <Route path="/risk-intelligence" element={<RiskPage />} />
          <Route path="/profile"           element={<ProfilePage />} />
        </Route>

        {/* ── 404 catch-all ── */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
};
