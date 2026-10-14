import React, { Suspense } from 'react';
import { useScenario } from '../context/ScenarioContext.jsx';

const ProjectionsView = React.lazy(() =>
  import('../components/ProjectionsView.jsx').then((m) => ({ default: m.ProjectionsView }))
);

export const ProjectionsPage = () => {
  const { effectiveScenarioData } = useScenario();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financial Projections</h1>
        <p className="text-sm text-gray-400 mt-1">
          36-month financial forecast table and scenario assumptions.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading projections...
          </div>
        }
      >
        <ProjectionsView scenarioData={effectiveScenarioData} />
      </Suspense>
    </div>
  );
};
