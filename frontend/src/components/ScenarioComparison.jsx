import React from 'react';
import { runSimulation } from '../lib/simulationEngine';
import { CheckCircle, ArrowRight, Layers, Trash2, Plus } from 'lucide-react';

export const ScenarioComparison = ({
  scenarios = [],
  activeScenarioId,
  onSelectScenario,
  onOpenCreateModal,
  onOpenDeleteModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222E42] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Scenario Comparison Matrix
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Compare cash runway, break-even month, net burn, and risk score across all your saved models.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenarios.map((scenario) => {
          const id = scenario.id || scenario._id;
          const isActive = id === activeScenarioId;
          const result = runSimulation(scenario.data || {});

          return (
            <div
              key={id}
              className={`bg-[#151D2A] border rounded-xl p-5 flex flex-col justify-between transition-all relative ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                  : 'border-[#222E42] hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white leading-tight">{scenario.title}</h3>
                  {isActive && (
                    <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-blue-400" /> Active
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDeleteModal(scenario);
                  }}
                  title="Delete Scenario"
                  className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-950/40 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div
                onClick={() => onSelectScenario(id)}
                className="space-y-2.5 text-xs cursor-pointer"
              >
                <div className="flex justify-between py-1.5 border-b border-[#222E42]/60">
                  <span className="text-gray-400">Runway:</span>
                  <span className="font-mono font-bold text-white">
                    {result.runwayMonths >= 36 ? '36+ Months' : `${result.runwayMonths} Months`}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#222E42]/60">
                  <span className="text-gray-400">Break-Even:</span>
                  <span className="font-mono font-bold text-white">
                    {result.breakEvenMonth ? `Month ${result.breakEvenMonth}` : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#222E42]/60">
                  <span className="text-gray-400">Starting Cash:</span>
                  <span className="font-mono text-white">
                    ₹{(Number(scenario.data?.startingCash) || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#222E42]/60">
                  <span className="text-gray-400">Initial Net Burn:</span>
                  <span className="font-mono text-rose-400">
                    ₹{Math.abs(result.initialBurn).toLocaleString()}/mo
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[#222E42]/60">
                  <span className="text-gray-400">Risk Level:</span>
                  <span className={`font-bold ${
                    result.riskLevel === 'High' ? 'text-red-400' :
                    result.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {result.riskScore}/100 ({result.riskLevel})
                  </span>
                </div>
              </div>

              <div
                onClick={() => onSelectScenario(id)}
                className="mt-5 pt-3 border-t border-[#222E42] flex items-center justify-between text-xs text-blue-400 font-medium cursor-pointer"
              >
                <span>{isActive ? 'Currently Editing' : 'Select to Edit'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
