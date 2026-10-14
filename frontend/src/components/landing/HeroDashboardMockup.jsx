import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, TrendingDown, ShieldAlert, Sparkles } from 'lucide-react';

export const HeroDashboardMockup = () => {
  const [runwayCount, setRunwayCount] = useState(0);
  const [burnCount, setBurnCount] = useState(0);
  const [riskCount, setRiskCount] = useState(0);

  // Counter animation when component mounts
  useEffect(() => {
    const duration = 1200; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setRunwayCount(Math.round(18 * easeProgress));
      setBurnCount(Math.round(51000 * easeProgress));
      setRiskCount(Math.round(42 * easeProgress));

      if (step >= steps) {
        clearInterval(timer);
        setRunwayCount(18);
        setBurnCount(51000);
        setRiskCount(42);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative mx-auto max-w-2xl w-full"
    >
      {/* Aurora glow underneath */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-emerald-500/10 blur-2xl rounded-3xl -z-10" />

      {/* Main Glass Shell */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-950/40">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0B101C]/90 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/40" />
            <span className="ml-2 text-[11px] font-mono text-gray-400 font-medium truncate max-w-[130px] sm:max-w-none">
              burnly.app/simulator — PayFlow India (Seed)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Horizon
            </span>
          </div>
        </div>

        {/* Mockup Body */}
        <div className="p-5 space-y-5 bg-[#080C14]/70">
          {/* Animated KPI Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Runway */}
            <div className="bg-[#0E1524]/90 border border-white/5 p-3 rounded-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Cash Runway</span>
                <Clock className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  {runwayCount}
                </span>
                <span className="text-xs text-gray-400">months</span>
              </div>
              <p className="text-[10px] text-rose-400/90 font-medium mt-0.5">Depletes Month 18</p>
            </div>

            {/* Break-Even */}
            <div className="bg-[#0E1524]/90 border border-white/5 p-3 rounded-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Break-Even</span>
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  Mo 14
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/90 font-medium mt-0.5">Profitable at Month 14</p>
            </div>

            {/* Net Burn */}
            <div className="bg-[#0E1524]/90 border border-white/5 p-3 rounded-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Net Burn</span>
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  ₹{burnCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400">/mo</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Initial cash outflow</p>
            </div>

            {/* Risk Rating */}
            <div className="bg-[#0E1524]/90 border border-white/5 p-3 rounded-xl">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Risk Rating</span>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  {riskCount}/100
                </span>
              </div>
              <span className="inline-block text-[9px] font-semibold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 mt-0.5">
                Medium Risk
              </span>
            </div>
          </div>

          {/* DRAWN ANIMATED SVG CASH RUNWAY CHART */}
          <div className="bg-[#0E1524]/90 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Ending Cash Horizon (₹15.0L Starting $\to$ Zero Month 18)
              </span>
              <span className="font-mono text-[11px] text-gray-400">36-Month Horizon</span>
            </div>

            {/* SVG Chart */}
            <div className="relative h-44 w-full">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  {/* Area gradient */}
                  <linearGradient id="heroCashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#4F46E5" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>

                  {/* Danger gradient after depletion */}
                  <linearGradient id="heroDepletedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(244,63,94,0.3)" strokeDasharray="4 2" />

                {/* Zero Cash label */}
                <text x="4" y="116" fill="#F43F5E" fontSize="9" fontFamily="JetBrains Mono" opacity="0.8">
                  Zero Cash Threshold (₹0)
                </text>

                {/* Filled Area under declining curve */}
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  d="M 0,25 
                     C 80,30 140,55 200,85 
                     C 230,102 245,115 260,120 
                     L 500,120 
                     L 500,150 
                     L 0,150 Z"
                  fill="url(#heroCashGrad)"
                />

                {/* Animated Line Stroke Drawing from Left to Right */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  d="M 0,25 
                     C 80,30 140,55 200,85 
                     C 230,102 245,115 260,120 
                     L 500,120"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Zero Point Radar / Pulsing Ring at Month 18 (x=260, y=120) */}
                <motion.circle
                  cx="260"
                  cy="120"
                  r="12"
                  fill="#F43F5E"
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                />
                <circle cx="260" cy="120" r="4.5" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2.5" />

                {/* Pulse Tag Pin */}
                <g transform="translate(260, 95)">
                  <rect x="-42" y="-14" width="84" height="18" rx="4" fill="#F43F5E" opacity="0.9" />
                  <text x="0" y="-2" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                    Runway End (M18)
                  </text>
                </g>
              </svg>

              {/* Month Markers */}
              <div className="flex justify-between text-[10px] font-mono text-gray-500 pt-1 border-t border-white/5">
                <span>Month 1 (₹15.0L)</span>
                <span>Month 6</span>
                <span>Month 12</span>
                <span className="text-rose-400 font-bold">Month 18 (₹0)</span>
                <span>Month 24</span>
                <span>Month 36</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
