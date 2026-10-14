import React, { Suspense } from 'react';
import { useScenario } from '../context/ScenarioContext.jsx';
import { ProjectionsSkeleton } from '../components/common/SkeletonLoader.jsx';

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
      <Suspense fallback={<ProjectionsSkeleton />}>
        <ProjectionsView scenarioData={effectiveScenarioData} />
      </Suspense>
    </div>
  );
};
