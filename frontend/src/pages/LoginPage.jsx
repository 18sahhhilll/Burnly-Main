import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Flame, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Invalid credentials. Please try again.');
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

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 mt-2 text-sm">Sign in to your Burnly account to continue</p>
          </div>

          <div className="bg-[#151D2A] border border-[#222E42] rounded-2xl p-8 shadow-2xl space-y-5">
            {error && (
              <div className="bg-red-950/50 border border-red-900/60 p-3 rounded-lg flex items-start gap-2.5 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-900/20 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create one free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
