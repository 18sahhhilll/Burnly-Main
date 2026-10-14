import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Check, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { AuthBrandPanel } from '../components/auth/AuthBrandPanel.jsx';
import { OAuthButtons } from '../components/auth/OAuthButtons.jsx';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '6+ characters', pass: password.length >= 6 },
    { label: 'Has a number', pass: /\d/.test(password) },
    { label: 'Has uppercase', pass: /[A-Z]/.test(password) },
  ];
  const passed = checks.filter((c) => c.pass).length;
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i < passed ? colors[passed - 1] : 'bg-[#1A2436]'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`flex items-center gap-1 text-[10px] font-mono transition-colors duration-150 ${
              c.pass ? 'text-emerald-400' : 'text-gray-500'
            }`}
          >
            <Check className="w-2.5 h-2.5" />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please accept the disclaimer acknowledgment to continue.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. An account with this email may already exist.');
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
        <div className="max-w-md w-full mx-auto my-8 space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
              Start modeling your startup's financial runway with deterministic precision.
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sahil Verma"
                  className="w-full bg-[#131B2E] border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white transition-all outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
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
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-[#131B2E] border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white transition-all outline-none ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-rose-600 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 p-1 transition-colors"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[11px] text-rose-400 mt-1 font-mono">Passwords do not match</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-gray-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded bg-[#131B2E] border-white/20 accent-blue-600 cursor-pointer"
              />
              <span className="leading-snug select-none">
                I understand that Burnly is a mathematical simulation planning aid and does not constitute formal financial or legal advice.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 text-sm active:scale-98 cursor-pointer mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center text-xs text-gray-400 pt-1">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Bottom Trust Line */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>No credit card required · Free forever for early-stage founders</span>
        </div>
      </div>

      {/* ─── Right Brand Column (5 cols) ───────────────────────────────────────── */}
      <div className="lg:col-span-5 h-full">
        <AuthBrandPanel
          headline="Never run out of cash unexpectedly."
          subline="Create and branch unlimited financial scenarios, run sensitivity analyses, and generate AI market intelligence grounded in verified metrics."
        />
      </div>
    </div>
  );
};
