import React, { useState } from 'react';
import {
  Building2,
  Users,
  IndianRupee,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useVenture } from '../context/VentureContext';

export const ProfileWizard = ({ onComplete }) => {
  const { activeVenture, updateActiveVenture, sampleVenture } = useVenture();
  const [step, setStep] = useState(1);

  // Initialize form state from activeVenture
  const [formData, setFormData] = useState({
    name: activeVenture?.name || '',
    oneLiner: activeVenture?.oneLiner || '',
    problem: activeVenture?.problem || '',
    industry: activeVenture?.industry || 'Technology',
    businessModel: activeVenture?.businessModel || 'subscription',
    targetCustomer: activeVenture?.targetCustomer || 'B2B SMBs',
    geography: activeVenture?.geography || 'India',
    stage: activeVenture?.stage || 'Seed',
    team: {
      foundersCount: activeVenture?.team?.foundersCount ?? 2,
      headcount: activeVenture?.team?.headcount ?? 5,
      keyRoles: activeVenture?.team?.keyRoles || 'Engineering, Product, Sales',
    },
    financialSnapshot: {
      startingCash: activeVenture?.financialSnapshot?.startingCash ?? 1500000,
      monthlyRevenue: activeVenture?.financialSnapshot?.monthlyRevenue ?? 25000,
      revenueGrowthRate: activeVenture?.financialSnapshot?.revenueGrowthRate ?? 8,
      payrollSpend: activeVenture?.financialSnapshot?.payrollSpend ?? 45000,
      marketingSpend: activeVenture?.financialSnapshot?.marketingSpend ?? 12000,
      infrastructureSpend: activeVenture?.financialSnapshot?.infrastructureSpend ?? 4000,
      opsSpend: activeVenture?.financialSnapshot?.opsSpend ?? 5000,
      founderSalary: activeVenture?.financialSnapshot?.founderSalary ?? 10000,
      fundingRaisedSoFar: activeVenture?.financialSnapshot?.fundingRaisedSoFar ?? 0,
      plannedRaise: activeVenture?.financialSnapshot?.plannedRaise ?? 5000000,
    },
    revenueModelDetails: {
      pricing: activeVenture?.revenueModelDetails?.pricing ?? 2500,
      customerCount: activeVenture?.revenueModelDetails?.customerCount ?? 10,
      churnRate: activeVenture?.revenueModelDetails?.churnRate ?? 1.5,
      cac: activeVenture?.revenueModelDetails?.cac ?? 8000,
      grossMargin: activeVenture?.revenueModelDetails?.grossMargin ?? 85,
    },
    isSample: activeVenture?.isSample ?? false,
  });

  const handleFieldChange = (section, field, value) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleUseSampleStartup = () => {
    setFormData({
      ...sampleVenture,
      isSample: true,
    });
  };

  const handleFinish = async () => {
    await updateActiveVenture(formData);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Sample Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222E42] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Startup Profile & Intake Wizard
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Tell us about your venture once. This single profile anchors your 36-month projections and intelligence reports.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseSampleStartup}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 bg-blue-950/80 hover:bg-blue-900 border border-blue-800/60 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          Use Sample Startup Data
        </button>
      </div>

      {/* Sample Data Alert Banner */}
      {formData.isSample && (
        <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3.5 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Sample Profile Active:</strong> You are currently viewing <em>{formData.name}</em> sample data. Edit any fields below to customize.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">
            Sample Data
          </span>
        </div>
      )}

      {/* Wizard Progress Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, title: 'Business' },
          { num: 2, title: 'Team' },
          { num: 3, title: 'Financial Snapshot' },
          { num: 4, title: 'Revenue Details' },
        ].map((item) => (
          <div
            key={item.num}
            onClick={() => setStep(item.num)}
            className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
              step === item.num
                ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500/40'
                : step > item.num
                ? 'bg-[#151D2A] border-emerald-800/60 text-emerald-400'
                : 'bg-[#151D2A] border-[#222E42] text-gray-500 hover:border-gray-600'
            }`}
          >
            <div className="text-[10px] uppercase font-mono font-bold tracking-wider mb-0.5">
              Step 0{item.num}
            </div>
            <div className="text-xs font-semibold text-white truncate">{item.title}</div>
          </div>
        ))}
      </div>

      {/* Step Content Cards */}
      <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-6 shadow-xl space-y-6 text-[#E8EAF0]">
        {/* Step 1: Business */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222E42] pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              1. Business Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Startup / Venture Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleFieldChange(null, 'name', e.target.value)}
                  placeholder="e.g. PayFlow India"
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleFieldChange(null, 'industry', e.target.value)}
                  placeholder="e.g. Fintech / SaaS"
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  One-Line Description
                </label>
                <input
                  type="text"
                  value={formData.oneLiner}
                  onChange={(e) => handleFieldChange(null, 'oneLiner', e.target.value)}
                  placeholder="e.g. Automated B2B payouts and reconciliation for Indian SaaS startups"
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleFieldChange(null, 'stage', e.target.value)}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500"
                >
                  <option value="Idea">Idea Stage</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Growth">Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Target Geography
                </label>
                <input
                  type="text"
                  value={formData.geography}
                  onChange={(e) => handleFieldChange(null, 'geography', e.target.value)}
                  placeholder="e.g. India, SE Asia"
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Team */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222E42] pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              2. Team & Key Roles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Number of Founders
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.team.foundersCount}
                  onChange={(e) => handleFieldChange('team', 'foundersCount', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Total Current Headcount
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.team.headcount}
                  onChange={(e) => handleFieldChange('team', 'headcount', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Key Department Roles Covered
                </label>
                <input
                  type="text"
                  value={formData.team.keyRoles}
                  onChange={(e) => handleFieldChange('team', 'keyRoles', e.target.value)}
                  placeholder="e.g. Engineering, Product, Growth Marketing, Sales"
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Financial Snapshot */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222E42] pb-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              3. Baseline Financial Snapshot
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Starting Cash (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.financialSnapshot.startingCash}
                  onChange={(e) => handleFieldChange('financialSnapshot', 'startingCash', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Monthly Revenue (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.financialSnapshot.monthlyRevenue}
                  onChange={(e) => handleFieldChange('financialSnapshot', 'monthlyRevenue', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Revenue Growth (%/mo)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.financialSnapshot.revenueGrowthRate}
                  onChange={(e) => handleFieldChange('financialSnapshot', 'revenueGrowthRate', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Base Payroll (₹/mo)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.financialSnapshot.payrollSpend}
                  onChange={(e) => handleFieldChange('financialSnapshot', 'payrollSpend', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Marketing Spend (₹/mo)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.financialSnapshot.marketingSpend}
                  onChange={(e) => handleFieldChange('financialSnapshot', 'marketingSpend', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Planned Target Raise (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.financialSnapshot.plannedRaise}
                  onChange={(e) => handleFieldChange('financialSnapshot', 'plannedRaise', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Revenue Model Details (Optional) */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#222E42] pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                4. Revenue Model Details (Optional)
              </h3>
              <span className="text-[11px] text-gray-400 italic">Enables deeper unit economic math</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Avg Pricing / ARPU (₹/mo)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.revenueModelDetails.pricing}
                  onChange={(e) => handleFieldChange('revenueModelDetails', 'pricing', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Active Customer Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.revenueModelDetails.customerCount}
                  onChange={(e) => handleFieldChange('revenueModelDetails', 'customerCount', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Monthly Churn Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.revenueModelDetails.churnRate}
                  onChange={(e) => handleFieldChange('revenueModelDetails', 'churnRate', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Gross Margin (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.revenueModelDetails.grossMargin}
                  onChange={(e) => handleFieldChange('revenueModelDetails', 'grossMargin', Number(e.target.value))}
                  className="w-full bg-[#1A2436] border border-[#222E42] rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-[#222E42] pt-4">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white bg-[#1A2436] border border-[#222E42] px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Venture & View Projections
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
