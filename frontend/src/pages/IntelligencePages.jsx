import React, { Suspense } from 'react';
import { useScenario } from '../context/ScenarioContext.jsx';
import { useVenture } from '../context/VentureContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

import { ReportSkeleton } from '../components/common/SkeletonLoader.jsx';

const ReportView = React.lazy(() =>
  import('../components/ReportView.jsx').then((m) => ({ default: m.ReportView }))
);

const IntelligencePage = ({ type, title, subtitle }) => {
  const { activeScenario } = useScenario();
  const { activeVenture } = useVenture();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>
      <Suspense fallback={<ReportSkeleton />}>
        <ReportView
          type={type}
          activeScenario={activeScenario}
          activeVenture={activeVenture}
          token={token}
          onOpenAuth={() => navigate('/login')}
        />
      </Suspense>
    </div>
  );
};

export const MarketPage = () => (
  <IntelligencePage
    type="market"
    title="Market Intelligence"
    subtitle="TAM, SAM, SOM sizing with industry trends and growth signals."
  />
);

export const CompetitorsPage = () => (
  <IntelligencePage
    type="competitors"
    title="Competitor Mapping"
    subtitle="Competitor comparison table, positioning matrix, and gaps you can own."
  />
);

export const RoadmapPage = () => (
  <IntelligencePage
    type="roadmap"
    title="Execution Roadmap"
    subtitle="Runway-driven milestones and simulation hiring triggers."
  />
);

export const PitchPage = () => (
  <IntelligencePage
    type="pitch"
    title="Investor Pitch Outline"
    subtitle="8-slide narrative outline auto-filled with your financial figures."
  />
);

export const RiskPage = () => (
  <IntelligencePage
    type="risk"
    title="Risk Intelligence"
    subtitle="Financial risk score breakdown and severity × likelihood risk matrix."
  />
);
