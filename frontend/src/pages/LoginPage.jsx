import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthBrandPanel } from '../components/auth/AuthBrandPanel.jsx';
import { OAuthButtons } from '../components/auth/OAuthButtons.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#E8EAF0] grid lg:grid-cols-12 relative overflow-hidden">
      {/* ─── Left Form Column (7 cols) ────────────────────────────────────────── */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight font-heading">
              Burnly
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </div>

        {/* Center Form Container */}
        <div className="max-w-md w-full mx-auto my-10 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
              Sign in to manage and simulate your startup runway scenarios.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <OAuthButtons />

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#080C14] px-3 text-[11px] font-mono text-gray-500 uppercase tracking-wider relative">
              Or with email
            </span>
          </div>

          {/* Error Alert with shake animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: [-8, 8, -6, 6, -3, 3, 0],
                  transition: { duration: 0.35 },
                }}
                exit={{ opacity: 0, y: -4 }}
                className="bg-rose-950/60 border border-rose-800/80 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-300"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 font-mono">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@startup.com"
                  className="w-full bg-[#131B2E] border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#131B2E] border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#131B2E] border-white/20 accent-blue-600 cursor-pointer"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 text-sm active:scale-98 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="text-center text-xs text-gray-400 pt-2">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Create account for free
            </Link>
          </div>
        </div>

        {/* Bottom Trust Line */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Your data stays private · No credit card required</span>
        </div>
      </div>

      {/* ─── Right Brand Column (5 cols) ───────────────────────────────────────── */}
      <div className="lg:col-span-5 h-full">
        <AuthBrandPanel
          headline="Turn financial uncertainty into absolute runway clarity."
          subline="Burnly's mathematical engine models compounding revenue, fixed ops, and start-month headcount to eliminate spreadsheet surprises."
        />
      </div>
    </div>
  );
};
