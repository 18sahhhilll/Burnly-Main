import React from 'react';
import { AlertCircle, ArrowLeft, BarChart3 } from 'lucide-react';

export const NotFoundPage = ({ onGoHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-8 bg-[#151D2A] border border-[#222E42] rounded-2xl max-w-md w-full space-y-5 shadow-2xl">
        <div className="w-16 h-16 mx-auto bg-rose-950/60 border border-rose-800/80 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-400" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-gray-100 font-mono">404</h1>
          <h2 className="text-lg font-bold text-gray-200 mt-1">Page Not Found</h2>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            The page or feature route you requested does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onGoHome}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors text-xs inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Financial Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
