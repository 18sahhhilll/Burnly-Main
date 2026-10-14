import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingDown, ShieldAlert, Clock } from 'lucide-react';
import { staggerContainer, staggerItem } from '../lib/animations.js';

export const MetricsOverview = ({ simulationResult }) => {
  const {
    runwayMonths = 36,
    breakEvenMonth = null,
    initialBurn = 0,
    startingCash = 0,
    riskScore = 0,
    riskLevel = 'Low',
  } = simulationResult || {};

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-red-950/80 text-red-400 border-red-800/60';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'Low':
      default:
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* 1. Runway Card */}
      <motion.div
        variants={staggerItem}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="bg-[#151D2A] border border-[#222E42] hover:border-blue-900/60 rounded-xl p-4 flex flex-col justify-between shadow-md transition-colors"
      >
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Cash Runway</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {runwayMonths >= 36 ? '36+' : runwayMonths}
            </span>
            <span className="text-sm text-gray-400 font-medium">months</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {runwayMonths >= 36 ? 'Survives full 3-year horizon' : `Depletes at month ${runwayMonths}`}
          </p>
        </div>
      </motion.div>

      {/* 2. Break-Even Card */}
      <motion.div
        variants={staggerItem}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="bg-[#151D2A] border border-[#222E42] hover:border-emerald-900/60 rounded-xl p-4 flex flex-col justify-between shadow-md transition-colors"
      >
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Break-Even Point</span>
          <Calendar className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {breakEvenMonth ? `Mo ${breakEvenMonth}` : 'N/A'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {breakEvenMonth ? `Net profitable in month ${breakEvenMonth}` : 'Does not reach profit in 36 mos'}
          </p>
        </div>
      </motion.div>

      {/* 3. Initial Net Burn Card */}
      <motion.div
        variants={staggerItem}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="bg-[#151D2A] border border-[#222E42] hover:border-rose-900/60 rounded-xl p-4 flex flex-col justify-between shadow-md transition-colors"
      >
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Initial Net Burn</span>
          <TrendingDown className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              ₹{Math.abs(initialBurn).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 font-medium">/mo</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Starting monthly net cash outflow
          </p>
        </div>
      </motion.div>

      {/* 4. Risk Score Card */}
      <motion.div
        variants={staggerItem}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="bg-[#151D2A] border border-[#222E42] hover:border-amber-900/60 rounded-xl p-4 flex flex-col justify-between shadow-md transition-colors"
      >
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Risk Rating</span>
          <ShieldAlert className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{riskScore}/100</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRiskBadgeColor(riskLevel)}`}>
              {riskLevel} Risk
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Composite score from runway & burn ratio
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
