import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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

// Convenience: protect + wrap in app layout
const AppPage = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

// 404 wrapper (works outside of router context)
const NotFound404 = () => (
  <div className="min-h-screen bg-[#0E1420]">
    <NotFoundPage onGoHome={() => window.location.replace('/')} />
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Auth (guest only) ── */}
        <Route path="/login" element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
        <Route path="/signup" element={<GuestOnlyRoute><SignupPage /></GuestOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ── Protected app ── */}
        <Route path="/dashboard"         element={<AppPage><DashboardPage /></AppPage>} />
        <Route path="/simulator"         element={<AppPage><SimulatorPage /></AppPage>} />
        <Route path="/projections"       element={<AppPage><ProjectionsPage /></AppPage>} />
        <Route path="/compare"           element={<AppPage><ComparePage /></AppPage>} />
        <Route path="/market"            element={<AppPage><MarketPage /></AppPage>} />
        <Route path="/competitors"       element={<AppPage><CompetitorsPage /></AppPage>} />
        <Route path="/roadmap"           element={<AppPage><RoadmapPage /></AppPage>} />
        <Route path="/pitch-outline"     element={<AppPage><PitchPage /></AppPage>} />
        <Route path="/risk-intelligence" element={<AppPage><RiskPage /></AppPage>} />
        <Route path="/profile"           element={<AppPage><ProfilePage /></AppPage>} />

        {/* ── 404 catch-all ── */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
};
