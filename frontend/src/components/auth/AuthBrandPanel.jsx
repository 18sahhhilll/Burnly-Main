import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import { IMAGES } from '../../lib/images.js';

export const AuthBrandPanel = ({
  headline = 'Plan your runway with mathematical precision.',
  subline = 'Join hundreds of early-stage founders who simulate hiring, calculate break-even timing, and raise capital with confidence.',
}) => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0B101C] via-[#0E1524] to-[#080C14] border-l border-white/5 overflow-hidden">
      {/* Background Aurora Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Brand Quote */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/50 text-[11px] font-mono text-blue-300 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Deterministic Financial Modeler
        </div>

        <h2 className="text-3xl font-bold text-white tracking-tight leading-snug font-heading max-w-md">
          {headline}
        </h2>
        <p className="text-sm text-gray-400 mt-3 leading-relaxed max-w-md">
          {subline}
        </p>
      </div>

      {/* Floating Glassmorphism Runway Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4 my-8"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-200">Active Scenario: Base Model</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 font-bold">
            18 Mo Runway
          </span>
        </div>

        {/* Mini SVG Runway Curve */}
        <div className="h-20 w-full relative">
          <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="miniCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,15 C 60,18 120,35 180,50 C 220,60 250,65 300,65 L 300,70 L 0,70 Z"
              fill="url(#miniCurveGrad)"
            />
            <path
              d="M 0,15 C 60,18 120,35 180,50 C 220,60 250,65 300,65"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="210" cy="56" r="3.5" fill="#F43F5E" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#080C14]/80 border border-white/5">
            <span className="text-[10px] text-gray-500 block uppercase">Break-Even</span>
            <span className="font-bold text-emerald-400 text-sm">Month 14</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#080C14]/80 border border-white/5">
            <span className="text-[10px] text-gray-500 block uppercase">Net Outflow</span>
            <span className="font-bold text-rose-400 text-sm">-₹51k/mo</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
          <img
            src={IMAGES.avatars.founder1}
            alt="Founder Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
          <p className="text-[11px] text-gray-300 italic leading-snug">
            "Burnly gave us total certainty before making 4 engineering hires."
          </p>
        </div>
      </motion.div>

      {/* Bottom Trust Indicators */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-gray-400 pt-4 border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Isolated tenant database
        </span>
        <span className="flex items-center gap-1.5 font-mono text-gray-500">
          TLS 1.3 · 256-Bit JWT
        </span>
      </div>
    </div>
  );
};
