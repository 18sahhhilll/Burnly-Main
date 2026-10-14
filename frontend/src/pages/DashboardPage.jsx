import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Layers, Globe, ShieldAlert, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useScenario } from '../context/ScenarioContext.jsx';
import { useVenture } from '../context/VentureContext.jsx';
import { MetricsOverview } from '../components/MetricsOverview.jsx';
import { ChartsView } from '../components/ChartsView.jsx';

const QuickLink = ({ to, icon: Icon, label, description, color }) => (
  <Link
    to={to}
    className="flex items-center gap-4 p-4 bg-[#151D2A] border border-[#222E42] rounded-xl hover:border-blue-800/50 transition-all group"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="font-semibold text-gray-100 text-sm group-hover:text-white transition-colors">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
  </Link>
);

export const DashboardPage = () => {
  const { simulationResult, effectiveScenarioData, activeScenario } = useScenario();
  const { activeVenture } = useVenture();

  const { monthlyProjections = [], runwayMonths, riskLevel } = simulationResult || {};

  // Only show first 6 months in mini table
  const recentMonths = monthlyProjections.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Financial overview for{' '}
            <span className="text-blue-400 font-medium">{activeVenture?.name || 'your venture'}</span>
            {activeScenario && (
              <> · Scenario: <span className="text-gray-300">{activeScenario.title}</span></>
            )}
          </p>
        </div>
        {activeVenture?.isSample && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/60 border border-amber-800/60 rounded-lg text-xs text-amber-300">
            <AlertCircle className="w-3.5 h-3.5" />
            Sample Data
          </div>
        )}
      </div>

      {/* Key metrics */}
      <MetricsOverview simulationResult={simulationResult} />

      {/* Chart */}
      <ChartsView monthlyProjections={monthlyProjections} />

      {/* Monthly table (first 6 months) */}
      {recentMonths.length > 0 && (
        <div className="bg-[#151D2A] border border-[#222E42] rounded-xl overflow-hidden shadow-md">
          <div className="px-5 py-3.5 border-b border-[#222E42] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-200">First 6 Months</h3>
            <Link to="/projections" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all 36 months <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#222E42] text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="px-5 py-2.5 text-left">Month</th>
                  <th className="px-5 py-2.5 text-right">Revenue</th>
                  <th className="px-5 py-2.5 text-right">Expenses</th>
                  <th className="px-5 py-2.5 text-right">Net Burn</th>
                  <th className="px-5 py-2.5 text-right">Cash Balance</th>
                </tr>
              </thead>
              <tbody>
                {recentMonths.map((m, i) => (
                  <tr key={m.month} className={`border-b border-[#222E42]/50 hover:bg-[#1A2436]/30 transition-colors ${i === recentMonths.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-3 text-gray-400 font-medium">Month {m.month}</td>
                    <td className="px-5 py-3 text-right text-emerald-400 font-mono">₹{m.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-rose-400 font-mono">₹{m.expenses.toLocaleString()}</td>
                    <td className={`px-5 py-3 text-right font-mono font-semibold ${m.netBurn > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {m.netBurn > 0 ? '-' : '+'}₹{Math.abs(m.netBurn).toLocaleString()}
                    </td>
                    <td className={`px-5 py-3 text-right font-mono font-bold ${m.endingCash > 0 ? 'text-white' : 'text-red-400'}`}>
                      ₹{m.endingCash.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Access</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <QuickLink to="/simulator" icon={BarChart3} label="Financial Simulator" description="Edit inputs, model hiring plans" color="bg-blue-950/60 text-blue-400" />
          <QuickLink to="/projections" icon={TrendingUp} label="Projections" description="View full 36-month data table" color="bg-emerald-950/60 text-emerald-400" />
          <QuickLink to="/compare" icon={Layers} label="Compare Scenarios" description="Side-by-side scenario analysis" color="bg-cyan-950/60 text-cyan-400" />
          <QuickLink to="/risk-intelligence" icon={ShieldAlert} label="Risk Intelligence" description="AI risk analysis & mitigation" color="bg-rose-950/60 text-rose-400" />
        </div>
      </div>
    </div>
  );
};
