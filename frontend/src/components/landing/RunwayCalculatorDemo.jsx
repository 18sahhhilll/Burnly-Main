import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Clock, Zap, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RunwayCalculatorDemo = () => {
  const [startingCash, setStartingCash] = useState(1500000); // 15L
  const [monthlyRevenue, setMonthlyRevenue] = useState(25000); // 25k
  const [monthlyExpenses, setMonthlyExpenses] = useState(110000); // 1.1L

  const { runwayMonths, netBurn, riskTier } = useMemo(() => {
    const burn = monthlyExpenses - monthlyRevenue;
    if (burn <= 0) {
      return { runwayMonths: 36, netBurn: burn, riskTier: 'Profitable / Infinite' };
    }
    const months = Math.min(36, Math.max(0, Math.floor(startingCash / burn)));
    let tier = 'Low Risk';
    if (months < 12) tier = 'High Risk (< 1 yr)';
    else if (months < 20) tier = 'Moderate Risk';

    return { runwayMonths: months, netBurn: burn, riskTier: tier };
  }, [startingCash, monthlyRevenue, monthlyExpenses]);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-[11px] font-mono text-blue-400 mb-2">
            <Zap className="w-3 h-3" /> Interactive Live Model
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Test Your Runway Right Now
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Drag the sliders below to see instant mathematical projections.
          </p>
        </div>

        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/30 self-start md:self-auto transition-transform active:scale-95"
        >
          Model Full 36 Months <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-12 gap-8 pt-6 items-center">
        {/* Sliders (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Starting Cash */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300">Starting Cash Reserve</span>
              <span className="font-mono text-blue-400 font-bold">
                ₹{(startingCash / 100000).toFixed(1)} Lakhs (₹{startingCash.toLocaleString()})
              </span>
            </div>
            <input
              type="range"
              min={200000}
              max={15000000}
              step={100000}
              value={startingCash}
              onChange={(e) => setStartingCash(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-[#1A2436] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>₹2L</span>
              <span>₹75L</span>
              <span>₹1.5Cr</span>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300">Monthly Revenue</span>
              <span className="font-mono text-emerald-400 font-bold">
                ₹{monthlyRevenue.toLocaleString()}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={10000}
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#1A2436] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>₹0</span>
              <span>₹5L</span>
              <span>₹10L/mo</span>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300">Monthly Total Expenses (Payroll + Ops)</span>
              <span className="font-mono text-rose-400 font-bold">
                ₹{monthlyExpenses.toLocaleString()}/mo
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={2500000}
              step={25000}
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-[#1A2436] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>₹50k</span>
              <span>₹12L</span>
              <span>₹25L/mo</span>
            </div>
          </div>
        </div>

        {/* Live Output Card (5 cols) */}
        <div className="md:col-span-5 bg-[#080C14]/90 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-inner">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Projected Survival
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <motion.span
                key={runwayMonths}
                initial={{ scale: 1.15, color: '#3B82F6' }}
                animate={{ scale: 1, color: '#FFFFFF' }}
                transition={{ duration: 0.2 }}
                className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight"
              >
                {runwayMonths >= 36 ? '36+' : runwayMonths}
              </motion.span>
              <span className="text-sm text-gray-400 font-medium">Months Runway</span>
            </div>
          </div>

          {/* Runway Progress Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-gray-400">
              <span>Runway Progress</span>
              <span className="font-mono text-gray-300">{Math.round((runwayMonths / 36) * 100)}% of 3-yr horizon</span>
            </div>
            <div className="h-2.5 w-full bg-[#131B2E] rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div
                className={`h-full rounded-full ${
                  runwayMonths < 12
                    ? 'bg-rose-500'
                    : runwayMonths < 20
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                animate={{ width: `${Math.min(100, (runwayMonths / 36) * 100)}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Net Monthly Burn:</span>
              <span className="font-mono font-bold text-rose-400">
                ₹{Math.max(0, netBurn).toLocaleString()}/mo
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status Assessment:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  runwayMonths < 12
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : runwayMonths < 20
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}
              >
                {riskTier}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
