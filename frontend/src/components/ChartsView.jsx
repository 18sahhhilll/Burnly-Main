import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { IndianRupee, TrendingUp } from 'lucide-react';
import { fadeIn } from '../lib/animations.js';

export const ChartsView = ({ monthlyProjections = [] }) => {
  const [chartType, setChartType] = useState('cash'); // 'cash' | 'revenue-expenses'

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000) {
      return `₹${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(0)}k`;
    }
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A2436] border border-[#222E42] rounded-lg p-3 shadow-xl text-xs font-mono space-y-1">
          <div className="font-sans font-bold text-gray-300 pb-1 border-b border-[#222E42]">
            Month {label}
          </div>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                ₹{Number(entry.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222E42] pb-3">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          {chartType === 'cash' ? (
            <>
              <IndianRupee className="w-4 h-4 text-blue-400" />
              Cash Balance Horizon (36 Months)
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Revenue vs. Expenses Comparison
            </>
          )}
        </h3>

        {/* Animated segmented control */}
        <div className="flex items-center gap-1 bg-[#1A2436] p-1 rounded-lg border border-[#222E42] relative">
          <button
            onClick={() => setChartType('cash')}
            className={`relative px-3 py-1 text-xs font-medium rounded transition-colors z-10 cursor-pointer ${
              chartType === 'cash' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {chartType === 'cash' && (
              <motion.div
                layoutId="chart-type-pill"
                className="absolute inset-0 bg-blue-600 rounded"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">Cash Balance</span>
          </button>
          <button
            onClick={() => setChartType('revenue-expenses')}
            className={`relative px-3 py-1 text-xs font-medium rounded transition-colors z-10 cursor-pointer ${
              chartType === 'revenue-expenses' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {chartType === 'revenue-expenses' && (
              <motion.div
                layoutId="chart-type-pill"
                className="absolute inset-0 bg-blue-600 rounded"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">Rev vs Expenses</span>
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={chartType}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'cash' ? (
                <AreaChart data={monthlyProjections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222E42" />
                  <XAxis
                    dataKey="month"
                    stroke="#8A99AD"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(m) => `M${m}`}
                  />
                  <YAxis
                    stroke="#8A99AD"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Zero Cash', fill: '#EF4444', fontSize: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="endingCash"
                    name="Ending Cash"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#cashGradient)"
                    isAnimationActive={true}
                    animationDuration={450}
                  />
                </AreaChart>
              ) : (
                <BarChart data={monthlyProjections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222E42" />
                  <XAxis
                    dataKey="month"
                    stroke="#8A99AD"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(m) => `M${m}`}
                  />
                  <YAxis
                    stroke="#8A99AD"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="revenue"
                    name="Monthly Revenue"
                    fill="#10B981"
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={450}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Monthly Expenses"
                    fill="#F43F5E"
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={450}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
