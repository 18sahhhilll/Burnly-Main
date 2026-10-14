import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Layers,
  Globe,
  Users2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SpotlightCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative glass-panel rounded-2xl p-6 overflow-hidden border border-white/10 group ${className}`}
    >
      {/* Spotlight follower */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.12), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const BentoFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: 2-col large - Deterministic 36-Month Engine */}
      <SpotlightCard className="md:col-span-2 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
              Deterministic Math Engine
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              36-Month Dynamic Cash Projections
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mt-2 max-w-xl">
              Model starting cash, base payroll, marketing, cloud infra, and multi-hire future timelines. See your ending cash balance and net burn recalculate instantly without spreadsheet errors.
            </p>
          </div>
        </div>

        {/* Visual Mini Grid */}
        <div className="mt-6 p-4 rounded-xl bg-[#080C14]/90 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-2">
            <span className="font-mono">HIRING TIMELINE INTEGRATION</span>
            <span className="text-emerald-400 text-[11px] font-mono">Live Sync</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[#0E1524] text-gray-300">
              <span className="text-gray-500 block text-[10px]">M3 HIRE</span>
              Sr. Backend Eng (₹1.2L)
            </div>
            <div className="p-2 rounded bg-[#0E1524] text-gray-300">
              <span className="text-gray-500 block text-[10px]">M6 HIRE</span>
              Growth Lead (₹90k)
            </div>
            <div className="p-2 rounded bg-[#0E1524] text-gray-300">
              <span className="text-gray-500 block text-[10px]">M9 HIRE</span>
              2x Frontend Eng (₹1.0L)
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Card 2: 1-col - Runway Tracker */}
      <SpotlightCard className="flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
            Cash Zero Point
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Exact Runway Tracking
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Never be blindsided. Burnly automatically tags the exact month your cash hits zero and alerts you when your runway dips below 12 months.
          </p>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[#080C14]/90 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Runway Forecast</span>
            <div className="text-2xl font-bold font-mono text-rose-400">18 Months</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono font-semibold">
            Depletes M18
          </span>
        </div>
      </SpotlightCard>

      {/* Card 3: 1-col - Break-Even Analysis */}
      <SpotlightCard className="flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Profitability Milestone
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Break-Even Timing
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Calculates compounding revenue growth against fixed and tiered headcount spend to show the month net cash turns positive.
          </p>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[#080C14]/90 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">Target Break-Even</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">Month 14</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono font-semibold">
            Profitable
          </span>
        </div>
      </SpotlightCard>

      {/* Card 4: 2-col - Generative AI Intelligence Layer */}
      <SpotlightCard className="md:col-span-2 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-violet-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold">
              AI Intelligence Layer
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">
              Market Research, Competitors & Pitch Outlines
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mt-2 max-w-xl">
              Burnly combines Gemini AI with your financial simulation numbers. Generate TAM/SAM/SOM sizing, 2-axis competitor positioning maps, and 8-slide investor pitch decks grounded in verified metrics.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs">
          <div className="p-2.5 rounded-lg bg-[#080C14]/90 border border-white/5">
            <span className="text-blue-400 font-bold block">Market TAM</span>
            <span className="text-gray-400 text-[11px]">Sized with citations</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#080C14]/90 border border-white/5">
            <span className="text-indigo-400 font-bold block">Competitors</span>
            <span className="text-gray-400 text-[11px]">Gaps you can own</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#080C14]/90 border border-white/5">
            <span className="text-cyan-400 font-bold block">Roadmap</span>
            <span className="text-gray-400 text-[11px]">Runway milestones</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#080C14]/90 border border-white/5">
            <span className="text-violet-400 font-bold block">Pitch Outline</span>
            <span className="text-gray-400 text-[11px]">8 slides auto-filled</span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};
