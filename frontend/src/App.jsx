import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ModuleNav } from './components/ModuleNav';
import { ProfileWizard } from './components/ProfileWizard';
import { MetricsOverview } from './components/MetricsOverview';
import { InputForm } from './components/InputForm';
import { ChartsView } from './components/ChartsView';
import { RiskSuggestionsPanel } from './components/RiskSuggestionsPanel';
import { NotFoundPage } from './components/NotFoundPage';
import { CreateScenarioModal } from './components/CreateScenarioModal';

// Code-split heavy intelligence & projection modules
const ProjectionsView = React.lazy(() => import('./components/ProjectionsView').then(m => ({ default: m.ProjectionsView })));
const ScenarioComparison = React.lazy(() => import('./components/ScenarioComparison').then(m => ({ default: m.ScenarioComparison })));
const ReportView = React.lazy(() => import('./components/ReportView').then(m => ({ default: m.ReportView })));
import { DeleteScenarioModal } from './components/DeleteScenarioModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { PRESET_SCENARIOS } from './lib/presets';
import { runSimulation } from './lib/simulationEngine';
import { useAuth } from './context/AuthContext';
import { VentureProvider, useVenture } from './context/VentureContext';

function MainAppContent() {
  const { user, token } = useAuth();
  const { activeVenture, activeVentureId } = useVenture();

  const [activeTab, setActiveTab] = useState('simulator'); // 'profile' | 'simulator' | 'projections' | 'comparison' | intelligence tabs
  const [scenarios, setScenarios] = useState(PRESET_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState(PRESET_SCENARIOS[0].id);
  const [toast, setToast] = useState(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [deletingScenario, setDeletingScenario] = useState(null);

  // Fetch scenarios whenever token or activeVentureId changes
  useEffect(() => {
    const fetchUserScenarios = async () => {
      if (!token) {
        setScenarios(PRESET_SCENARIOS);
        setActiveScenarioId(PRESET_SCENARIOS[0].id);
        return;
      }

      try {
        const url = activeVentureId ? `/api/scenarios?ventureId=${activeVentureId}` : '/api/scenarios';
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const userScenarios = await res.json();
          if (userScenarios.length > 0) {
            setScenarios(userScenarios);
            setActiveScenarioId(userScenarios[0]._id);
          } else {
            // Seed starter scenario linked to active venture
            const createRes = await fetch('/api/scenarios', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ventureId: activeVentureId,
                title: `${activeVenture?.name || 'Venture'} — Base Model`,
                data: activeVenture?.financialSnapshot || PRESET_SCENARIOS[0].data,
              }),
            });

            if (createRes.ok) {
              const newScen = await createRes.json();
              setScenarios([newScen]);
              setActiveScenarioId(newScen._id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching scenarios:', err);
      }
    };

    fetchUserScenarios();
  }, [token, activeVentureId]);

  // Find active scenario object
  const activeScenario = useMemo(() => {
    return scenarios.find((s) => (s._id || s.id) === activeScenarioId) || scenarios[0];
  }, [scenarios, activeScenarioId]);

  // Merge venture snapshot into active scenario if scenario data is empty
  const effectiveScenarioData = useMemo(() => {
    const scenData = activeScenario?.data || {};
    if (Object.keys(scenData).length === 0 && activeVenture?.financialSnapshot) {
      return activeVenture.financialSnapshot;
    }
    return scenData;
  }, [activeScenario, activeVenture]);

  // Execute simulation in real-time
  const simulationResult = useMemo(() => {
    return runSimulation(effectiveScenarioData);
  }, [effectiveScenarioData]);

  // Handle live updating of scenario input data
  const handleScenarioDataChange = (newData) => {
    setScenarios((prev) =>
      prev.map((s) => {
        if ((s._id || s.id) === activeScenarioId) {
          return { ...s, data: newData };
        }
        return s;
      })
    );

    // If authenticated, persist edit silently to backend
    if (token && activeScenario?._id) {
      fetch(`/api/scenarios/${activeScenario._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: newData,
        }),
      }).catch((err) => console.error('Failed to sync scenario update:', err));
    }
  };

  // Create Scenario Handler
  const handleCreateScenario = async ({ title, data }) => {
    if (token) {
      try {
        const res = await fetch('/api/scenarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ventureId: activeVentureId,
            title,
            data,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setScenarios((prev) => [created, ...prev]);
          setActiveScenarioId(created._id);
          setToast({ message: `Created scenario "${title}"`, type: 'success' });
          return;
        }
      } catch (err) {
        console.error('Failed to create scenario:', err);
      }
    }

    // Local fallback
    const localScenario = {
      id: 'custom-' + Date.now(),
      title,
      data,
    };
    setScenarios((prev) => [localScenario, ...prev]);
    setActiveScenarioId(localScenario.id);
    setToast({ message: `Created local scenario "${title}"`, type: 'success' });
  };

  // Delete Scenario Handler
  const handleDeleteScenario = async (targetId) => {
    if (scenarios.length <= 1) {
      setToast({ message: 'At least one scenario must remain active', type: 'error' });
      return;
    }

    if (token) {
      try {
        const res = await fetch(`/api/scenarios/${targetId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          setToast({ message: errData.error || 'Failed to delete scenario', type: 'error' });
          return;
        }
      } catch (err) {
        console.error('Failed to delete scenario:', err);
      }
    }

    const remainingScenarios = scenarios.filter((s) => (s._id || s.id) !== targetId);
    setScenarios(remainingScenarios);

    if ((activeScenario?._id || activeScenario?.id) === targetId) {
      const nextActive = remainingScenarios[0];
      setActiveScenarioId(nextActive._id || nextActive.id);
    }

    setToast({ message: 'Scenario deleted successfully', type: 'success' });
  };

  const handleAuthSuccess = (msg) => {
    setToast({ message: msg, type: 'success' });
  };

  const handleComingSoonNotice = (label) => {
    setToast({ message: `${label} intelligence module coming in Phase 3!`, type: 'info' });
  };

  return (
    <div className="min-h-screen bg-[#0E1420] text-[#E8EAF0] flex flex-col font-sans">
      <Header
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelectScenario={setActiveScenarioId}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenDeleteModal={(scen) => setDeletingScenario(scen)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <ModuleNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onComingSoonNotice={handleComingSoonNotice}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ProfileWizard
            onComplete={() => {
              setActiveTab('simulator');
              setToast({ message: 'Startup profile updated successfully!', type: 'success' });
            }}
          />
        )}

        {/* Simulator Tab */}
        {activeTab === 'simulator' && (
          <>
            <MetricsOverview simulationResult={simulationResult} />

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
          </>
        )}

        <React.Suspense fallback={
          <div className="p-12 text-center text-xs text-gray-400 space-y-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>Loading module...</div>
          </div>
        }>
          {/* Projections Tab */}
          {activeTab === 'projections' && (
            <ProjectionsView scenarioData={effectiveScenarioData} />
          )}

          {/* Compare Tab */}
          {activeTab === 'comparison' && (
            <ScenarioComparison
              scenarios={scenarios}
              activeScenarioId={activeScenarioId}
              onSelectScenario={(id) => {
                setActiveScenarioId(id);
                setActiveTab('simulator');
              }}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onOpenDeleteModal={(scen) => setDeletingScenario(scen)}
            />
          )}

          {/* Intelligence Tabs (Market, Competitors, Roadmap, Pitch, Risk) */}
          {['market', 'competitors', 'roadmap', 'pitch', 'risk'].includes(activeTab) && (
            <ReportView
              type={activeTab}
              activeScenario={activeScenario}
              activeVenture={activeVenture}
              token={token}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}
        </React.Suspense>

        {/* 404 Fallback for unrecognized route tabs */}
        {!['profile', 'simulator', 'projections', 'comparison', 'market', 'competitors', 'roadmap', 'pitch', 'risk'].includes(activeTab) && (
          <NotFoundPage onGoHome={() => setActiveTab('simulator')} />
        )}
      </main>

      {/* Modals */}
      <CreateScenarioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateScenario}
      />

      <DeleteScenarioModal
        isOpen={!!deletingScenario}
        scenario={deletingScenario}
        isLastScenario={scenarios.length <= 1}
        onClose={() => setDeletingScenario(null)}
        onConfirmDelete={handleDeleteScenario}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <VentureProvider>
      <MainAppContent />
    </VentureProvider>
  );
}
