import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Lightbulb, ShieldAlert } from 'lucide-react';
import { generateSuggestions } from '../lib/ruleEngine';

export const RiskSuggestionsPanel = ({ scenarioData, simulationResult }) => {
  const suggestions = generateSuggestions(scenarioData || {}, simulationResult || {});

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-950/30 border-red-900/40 text-red-200';
      case 'warning':
        return 'bg-amber-950/30 border-amber-900/40 text-amber-200';
      case 'success':
        return 'bg-emerald-950/30 border-emerald-900/40 text-emerald-200';
      case 'info':
      default:
        return 'bg-blue-950/30 border-blue-900/40 text-blue-200';
    }
  };

  return (
    <div className="bg-[#151D2A] border border-[#222E42] rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-[#222E42] pb-3">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Risk Analysis & Actionable Insights
        </h3>
        <span className="text-xs text-gray-400 font-mono">
          {suggestions.length} suggestion{suggestions.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No warnings generated for this scenario.</p>
        ) : (
          suggestions.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border flex items-start gap-3 transition-all ${getCardStyle(item.type)}`}
            >
              {getIcon(item.type)}
              <div className="space-y-1">
                <h4 className="text-xs font-bold tracking-wide uppercase">{item.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
