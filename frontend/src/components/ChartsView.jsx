import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { IndianRupee, TrendingUp, Layers } from 'lucide-react';

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

        <div className="flex items-center gap-1 bg-[#1A2436] p-1 rounded-lg border border-[#222E42]">
          <button
            onClick={() => setChartType('cash')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              chartType === 'cash'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Cash Balance
          </button>
          <button
            onClick={() => setChartType('revenue-expenses')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              chartType === 'revenue-expenses'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Rev vs Expenses
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
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
              <Bar dataKey="revenue" name="Monthly Revenue" fill="#10B981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expenses" name="Monthly Expenses" fill="#F43F5E" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
