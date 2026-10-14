import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, ArrowLeft, Mail } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0E1420] flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base">Burnly</span>
        </Link>
        <Link to="/login" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Forgot your password?</h1>
            <p className="text-gray-400 mt-2 text-sm max-w-sm mx-auto">
              Password reset via email is not yet implemented in this version.
              Please contact support or create a new account.
            </p>
          </div>

          <div className="bg-[#151D2A] border border-[#222E42] rounded-2xl p-8 space-y-4 text-center">
            <p className="text-xs text-gray-400">
              This feature requires email infrastructure (SMTP/SendGrid) which is not configured in the current deployment.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Create a new account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-2.5 bg-[#1A2436] hover:bg-[#222E42] border border-[#222E42] text-gray-300 font-medium rounded-xl transition-colors text-sm"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
