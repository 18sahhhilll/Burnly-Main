import React from 'react';
import { Calendar, TrendingDown, ShieldAlert, Award, Clock } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Runway Card */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-4 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Cash Runway</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono">
              {runwayMonths >= 36 ? '36+' : runwayMonths}
            </span>
            <span className="text-sm text-gray-400 font-medium">months</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {runwayMonths >= 36 ? 'Survives full 3-year horizon' : `Depletes at month ${runwayMonths}`}
          </p>
        </div>
      </div>

      {/* 2. Break-Even Card */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-4 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Break-Even Point</span>
          <Calendar className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono">
              {breakEvenMonth ? `Mo ${breakEvenMonth}` : 'N/A'}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {breakEvenMonth ? `Net profitable in month ${breakEvenMonth}` : 'Does not reach profit in 36 mos'}
          </p>
        </div>
      </div>

      {/* 3. Initial Net Burn Card */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-4 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Initial Net Burn</span>
          <TrendingDown className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono">
              ₹{Math.abs(initialBurn).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 font-medium">/mo</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Starting monthly net cash outflow
          </p>
        </div>
      </div>

      {/* 4. Risk Score Card */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-4 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-xs uppercase tracking-wider font-semibold">Risk Rating</span>
          <ShieldAlert className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-white font-mono">{riskScore}/100</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRiskBadgeColor(riskLevel)}`}>
              {riskLevel} Risk
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Composite score from runway & burn ratio
          </p>
        </div>
      </div>
    </div>
  );
};
