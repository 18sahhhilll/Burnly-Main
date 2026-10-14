import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
  ];
  const passed = checks.filter((c) => c.pass).length;
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-emerald-500'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < passed ? colors[passed - 1] : 'bg-[#222E42]'}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`flex items-center gap-1 text-[11px] ${c.pass ? 'text-emerald-400' : 'text-gray-500'}`}
          >
            <Check className="w-3 h-3" />
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
  const [agreed, setAgreed] = useState(false);
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
      setError('Please accept the terms to continue.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1420] flex flex-col">
      {/* Top nav */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base">Burnly</span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-gray-400 mt-2 text-sm">Start modeling your startup's financial runway</p>
          </div>

          <div className="bg-[#151D2A] border border-[#222E42] rounded-2xl p-8 shadow-2xl space-y-5">
            {error && (
              <div className="bg-red-950/50 border border-red-900/60 p-3 rounded-lg flex items-start gap-2.5 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sahil Verma"
                    className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white transition-colors outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@startup.com"
                    className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white transition-colors outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white transition-colors outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#1A2436] border focus:ring-1 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white transition-colors outline-none ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-red-700 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#222E42] focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-red-400 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-blue-500"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  I understand that Burnly is a financial planning tool and projections do not constitute financial, legal, or investment advice.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-900/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
