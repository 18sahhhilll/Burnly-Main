import React, { Suspense } from 'react';
import { useScenario } from '../context/ScenarioContext.jsx';

const ScenarioComparison = React.lazy(() =>
  import('../components/ScenarioComparison.jsx').then((m) => ({ default: m.ScenarioComparison }))
);

export const ComparePage = () => {
  const {
    scenarios,
    activeScenarioId,
    setActiveScenarioId,
    handleCreateScenario,
    handleDeleteScenario,
  } = useScenario();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Compare Scenarios</h1>
        <p className="text-sm text-gray-400 mt-1">
          Evaluate multiple financial models side by side.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading comparison view...
          </div>
        }
      >
        <ScenarioComparison
          scenarios={scenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={(id) => setActiveScenarioId(id)}
          onOpenCreateModal={() => {}}
          onOpenDeleteModal={() => {}}
        />
      </Suspense>
    </div>
  );
};
