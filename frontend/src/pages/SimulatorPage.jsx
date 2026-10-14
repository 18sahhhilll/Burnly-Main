import React from 'react';
import { MetricsOverview } from '../components/MetricsOverview.jsx';
import { InputForm } from '../components/InputForm.jsx';
import { ChartsView } from '../components/ChartsView.jsx';
import { RiskSuggestionsPanel } from '../components/RiskSuggestionsPanel.jsx';
import { useScenario } from '../context/ScenarioContext.jsx';

export const SimulatorPage = () => {
  const {
    effectiveScenarioData,
    simulationResult,
    handleScenarioDataChange,
  } = useScenario();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financial Simulator</h1>
        <p className="text-sm text-gray-400 mt-1">
          Model your startup's financials and see 36-month projections update in real time.
        </p>
      </div>

      {/* Key metrics */}
      <MetricsOverview simulationResult={simulationResult} />

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <InputForm
            scenarioData={effectiveScenarioData}
            onChange={handleScenarioDataChange}
          />
        </div>
        <div className="lg:col-span-7 space-y-6">
          <ChartsView monthlyProjections={simulationResult.monthlyProjections} />
          <RiskSuggestionsPanel
            scenarioData={effectiveScenarioData}
            simulationResult={simulationResult}
          />
        </div>
      </div>
    </div>
  );
};
