import React from 'react';
import { Plus, Trash2, Users, IndianRupee, TrendingUp, ShieldAlert, Building, Server, Megaphone, UserCheck } from 'lucide-react';

export const InputForm = ({ scenarioData, onChange }) => {
  const data = scenarioData || {};

  const handleFieldChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleNumberChange = (field, rawValue) => {
    const num = rawValue === '' ? '' : Math.max(0, Number(rawValue));
    handleFieldChange(field, num);
  };

  // Hiring Timeline Handlers
  const hiringTimeline = Array.isArray(data.hiringTimeline) ? data.hiringTimeline : [];

  const addHireRow = () => {
    const newHire = {
      id: 'hire-' + Date.now(),
      role: 'Software Engineer',
      startMonth: 3,
      count: 1,
      monthlySalary: 8000,
    };
    handleFieldChange('hiringTimeline', [...hiringTimeline, newHire]);
  };

  const updateHireRow = (index, field, value) => {
    const updated = hiringTimeline.map((item, i) => {
      if (i === index) {
        let val = value;
        if (field === 'startMonth') {
          val = Math.min(36, Math.max(1, Number(value) || 1));
        } else if (field === 'count' || field === 'monthlySalary') {
          val = Math.max(0, Number(value) || 0);
        }
        return { ...item, [field]: val };
      }
      return item;
    });
    handleFieldChange('hiringTimeline', updated);
  };

  const removeHireRow = (index) => {
    const updated = hiringTimeline.filter((_, i) => i !== index);
    handleFieldChange('hiringTimeline', updated);
  };

  return (
    <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-5 space-y-6 text-[#E8EAF0] shadow-lg">
      <div className="flex items-center justify-between border-b border-[#222E42] pb-3">
        <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2 text-white">
          <Building className="w-5 h-5 text-blue-400" />
          Financial Model Inputs
        </h2>
        <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800/40">
          Live Sync Active
        </span>
      </div>

      {/* 1. Cash & Revenue Section */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5">
          <IndianRupee className="w-4 h-4 text-emerald-400" />
          Cash & Revenue
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Starting Cash (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">₹</span>
              <input
                type="number"
                min="0"
                value={data.startingCash ?? 0}
                onChange={(e) => handleNumberChange('startingCash', e.target.value)}
                className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-7 pr-3 py-2 text-sm text-white font-mono transition-colors"
                placeholder="1000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Monthly Revenue (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">₹</span>
              <input
                type="number"
                min="0"
                value={data.monthlyRevenue ?? 0}
                onChange={(e) => handleNumberChange('monthlyRevenue', e.target.value)}
                className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-7 pr-3 py-2 text-sm text-white font-mono transition-colors"
                placeholder="25000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center justify-between">
              <span>Growth Rate (%/mo)</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.5"
                value={data.revenueGrowthRate ?? 0}
                onChange={(e) => handleNumberChange('revenueGrowthRate', e.target.value)}
                className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white font-mono transition-colors"
                placeholder="5"
              />
              <span className="absolute right-3 top-2.5 text-gray-500 text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#222E42]" />

      {/* 2. Fixed & Recurring Spend */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5">
          <Server className="w-4 h-4 text-indigo-400" />
          Recurring Monthly Spend
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Base Payroll (₹/mo)
            </label>
            <input
              type="number"
              min="0"
              value={data.payrollSpend ?? 0}
              onChange={(e) => handleNumberChange('payrollSpend', e.target.value)}
              className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Founder Salary (₹/mo)
            </label>
            <input
              type="number"
              min="0"
              value={data.founderSalary ?? 0}
              onChange={(e) => handleNumberChange('founderSalary', e.target.value)}
              className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Marketing & Growth (₹/mo)
            </label>
            <input
              type="number"
              min="0"
              value={data.marketingSpend ?? 0}
              onChange={(e) => handleNumberChange('marketingSpend', e.target.value)}
              className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Infrastructure & Cloud (₹/mo)
            </label>
            <input
              type="number"
              min="0"
              value={data.infrastructureSpend ?? 0}
              onChange={(e) => handleNumberChange('infrastructureSpend', e.target.value)}
              className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Ops & Overhead (₹/mo)
            </label>
            <input
              type="number"
              min="0"
              value={data.opsSpend ?? 0}
              onChange={(e) => handleNumberChange('opsSpend', e.target.value)}
              className="w-full bg-[#1A2436] border border-[#222E42] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-sm text-white font-mono transition-colors"
            />
          </div>
        </div>
      </div>

      <hr className="border-[#222E42]" />

      {/* 3. Hiring Timeline Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              Hiring Plan Timeline
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Future headcount additions and start months (1–36)
            </p>
          </div>
          <button
            type="button"
            onClick={addHireRow}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-950/70 hover:bg-blue-900 border border-blue-700/50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Hire Row
          </button>
        </div>

        {hiringTimeline.length === 0 ? (
          <div className="bg-[#1A2436]/50 border border-dashed border-[#222E42] rounded-lg p-4 text-center text-xs text-gray-400">
            No planned hires added yet. Click "Add Hire Row" to model headcount growth over time.
          </div>
        ) : (
          <div className="space-y-2.5">
            {hiringTimeline.map((hire, index) => (
              <div
                key={hire.id || index}
                className="bg-[#1A2436] border border-[#222E42] rounded-lg p-3 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center transition-all hover:border-gray-600"
              >
                {/* Role Title */}
                <div className="sm:col-span-5">
                  <label className="block text-[10px] text-gray-400 uppercase font-medium mb-0.5">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    value={hire.role || ''}
                    onChange={(e) => updateHireRow(index, 'role', e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full bg-[#151D2A] border border-[#222E42] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Start Month */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 uppercase font-medium mb-0.5">
                    Start Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={hire.startMonth ?? 1}
                    onChange={(e) => updateHireRow(index, 'startMonth', e.target.value)}
                    className="w-full bg-[#151D2A] border border-[#222E42] rounded px-2 py-1.5 text-xs text-white text-center font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Count */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 uppercase font-medium mb-0.5">
                    Headcount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={hire.count ?? 1}
                    onChange={(e) => updateHireRow(index, 'count', e.target.value)}
                    className="w-full bg-[#151D2A] border border-[#222E42] rounded px-2 py-1.5 text-xs text-white text-center font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Monthly Salary per Hire */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 uppercase font-medium mb-0.5">
                    Salary (₹/mo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hire.monthlySalary ?? 0}
                    onChange={(e) => updateHireRow(index, 'monthlySalary', e.target.value)}
                    className="w-full bg-[#151D2A] border border-[#222E42] rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Remove button */}
                <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => removeHireRow(index)}
                    title="Remove Hire"
                    className="text-gray-400 hover:text-red-400 p-1.5 rounded hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
