import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Sliders,
  Target,
  IndianRupee,
  Layers,
  PieChart,
} from 'lucide-react';
import {
  generateScenarioVariants,
  calculateFundingNeeds,
  calculateSensitivityAnalysis,
  calculateRevenueModelMetrics,
} from '../lib/projections.js';

export const ProjectionsView = ({ scenarioData = {} }) => {
  const [targetBufferMonths, setTargetBufferMonths] = useState(6);

  // Compute pure projection math
  const variants = generateScenarioVariants(scenarioData);
  const fundingNeeds = calculateFundingNeeds(scenarioData, targetBufferMonths);
  const sensitivity = calculateSensitivityAnalysis(scenarioData);
  const revenueMetrics = calculateRevenueModelMetrics(scenarioData.revenueModelDetails || {});

  // Build combined chart data for Base, Conservative, and Aggressive
  const baseProjections = variants.base.simulation.monthlyProjections || [];
  const consProjections = variants.conservative.simulation.monthlyProjections || [];
  const aggrProjections = variants.aggressive.simulation.monthlyProjections || [];

  const combinedChartData = baseProjections.map((p, index) => ({
    month: p.month,
    Base: p.endingCash,
    Conservative: consProjections[index]?.endingCash ?? 0,
    Aggressive: aggrProjections[index]?.endingCash ?? 0,
  }));

  const formatCurrency = (val) => {
    if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (Math.abs(val) >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222E42] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Financial Projections & Sensitivity Analysis
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Compare scenario variants (Base / Conservative / Aggressive), evaluate capital raise needs, and pinpoint key runway sensitivity drivers.
          </p>
        </div>
      </div>

      {/* 1. Scenario Variants Chart */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222E42] pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Scenario Variants Cash Horizon (Base vs. Conservative vs. Aggressive)
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Base
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Conservative
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Aggressive
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222E42" />
              <XAxis dataKey="month" stroke="#8A99AD" fontSize={11} tickFormatter={(m) => `M${m}`} />
              <YAxis stroke="#8A99AD" fontSize={11} tickFormatter={formatCurrency} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A2436', borderColor: '#222E42', fontSize: '12px', color: '#fff' }}
                formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Ending Cash']}
              />
              <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Zero Cash', fill: '#EF4444', fontSize: 10 }} />
              <Line type="monotone" dataKey="Base" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Conservative" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="Aggressive" stroke="#10B981" strokeWidth={2} strokeDasharray="2 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Grid: Funding Needs Card + Unit Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funding Needs Card */}
        <div className="lg:col-span-6 bg-[#151D2A] border border-[#222E42] rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#222E42] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Capital Funding Needs Calculation
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Target Buffer:</span>
              <select
                value={targetBufferMonths}
                onChange={(e) => setTargetBufferMonths(Number(e.target.value))}
                className="bg-[#1A2436] border border-[#222E42] text-xs text-white rounded px-2 py-1 font-mono focus:outline-none"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={9}>9 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {fundingNeeds.needsFunding ? (
              <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl space-y-2 text-emerald-200">
                <div className="text-xs uppercase font-bold tracking-wider opacity-80">
                  Recommended Raise Target
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  ₹{fundingNeeds.recommendedRaise.toLocaleString()}
                </div>
                <p className="text-xs leading-relaxed opacity-90 pt-1">
                  To reach break-even with a <strong>{targetBufferMonths}-month expense cushion</strong>, you must close a funding round of approximately <strong>₹{fundingNeeds.recommendedRaise.toLocaleString()}</strong> by <strong>Month {fundingNeeds.targetCloseMonth}</strong>.
                </p>
              </div>
            ) : (
              <div className="bg-blue-950/30 border border-blue-800/40 p-4 rounded-xl space-y-2 text-blue-200">
                <div className="text-xs uppercase font-bold tracking-wider opacity-80">
                  Fully Self-Sustaining
                </div>
                <div className="text-xl font-bold text-white">
                  No Immediate Capital Raise Needed
                </div>
                <p className="text-xs leading-relaxed opacity-90 pt-1">
                  Current cash reserves cover projected operations through break-even with over {targetBufferMonths} months of buffer.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-gray-400 border-t border-[#222E42] pt-2 flex justify-between">
            <span>Minimum Cash Horizon Point: Month {fundingNeeds.minCashMonth}</span>
            <span>Target Buffer: {targetBufferMonths} mos expenses</span>
          </div>
        </div>

        {/* Revenue Model / Unit Economics Card */}
        <div className="lg:col-span-6 bg-[#151D2A] border border-[#222E42] rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#222E42] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              Unit Economics & Revenue Metrics
            </h3>
            <span className="text-xs text-gray-400 font-mono uppercase">
              {revenueMetrics.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#1A2436] p-3 rounded-lg border border-[#222E42]">
              <span className="text-gray-400 text-[11px] block mb-1">Monthly Gross Profit</span>
              <span className="text-lg font-bold text-white font-mono">
                ₹{revenueMetrics.monthlyGrossProfit.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#1A2436] p-3 rounded-lg border border-[#222E42]">
              <span className="text-gray-400 text-[11px] block mb-1">Estimated LTV</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                ₹{revenueMetrics.ltv.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#1A2436] p-3 rounded-lg border border-[#222E42]">
              <span className="text-gray-400 text-[11px] block mb-1">LTV to CAC Ratio</span>
              <span className="text-lg font-bold text-blue-400 font-mono">
                {revenueMetrics.ltvToCacRatio}x
              </span>
            </div>

            <div className="bg-[#1A2436] p-3 rounded-lg border border-[#222E42]">
              <span className="text-gray-400 text-[11px] block mb-1">MRR Lost to Churn</span>
              <span className="text-lg font-bold text-rose-400 font-mono">
                ₹{revenueMetrics.mrrLostToChurn.toLocaleString()}/mo
              </span>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 border-t border-[#222E42] pt-2">
            Unit metrics derived from profile revenue details configuration.
          </div>
        </div>
      </div>

      {/* 3. Sensitivity Analysis View */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#222E42] pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Sensitivity Analysis: Key Runway Drivers
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Ranked impact on runway length when individual financial variables shift by ±20%.
            </p>
          </div>
          <span className="text-xs text-amber-400 font-mono bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/40">
            ±20% Shift Tested
          </span>
        </div>

        <div className="space-y-3">
          {sensitivity.sensitivities.map((item, idx) => {
            const impactPct = Math.min(100, Math.max(15, (item.maxImpactMonths / 12) * 100));
            return (
              <div key={item.key} className="bg-[#1A2436] border border-[#222E42] rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="text-gray-500 font-mono">#{idx + 1}</span>
                    {item.name}
                  </span>
                  <span className="font-mono text-amber-400 font-bold">
                    ±{item.maxImpactMonths} mos runway impact
                  </span>
                </div>

                <div className="w-full bg-[#151D2A] h-2.5 rounded-full overflow-hidden border border-[#222E42]">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${impactPct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-gray-400 font-mono pt-1">
                  <span>-20% shift: {item.minus20Runway} mos</span>
                  <span>Base: {item.baseRunway} mos</span>
                  <span>+20% shift: {item.plus20Runway} mos</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
