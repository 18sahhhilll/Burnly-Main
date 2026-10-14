import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useVenture } from './VentureContext.jsx';
import { PRESET_SCENARIOS } from '../lib/presets.js';
import { runSimulation } from '../lib/simulationEngine.js';

const ScenarioContext = createContext();

export const ScenarioProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { activeVenture, activeVentureId } = useVenture();

  const [scenarios, setScenarios] = useState(PRESET_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState(PRESET_SCENARIOS[0].id);

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
        body: JSON.stringify({ data: newData }),
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
          body: JSON.stringify({ ventureId: activeVentureId, title, data }),
        });

        if (res.ok) {
          const created = await res.json();
          setScenarios((prev) => [created, ...prev]);
          setActiveScenarioId(created._id);
          return created;
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
    return localScenario;
  };

  // Delete Scenario Handler
  const handleDeleteScenario = async (targetId) => {
    if (scenarios.length <= 1) return false;

    if (token) {
      try {
        const res = await fetch(`/api/scenarios/${targetId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return false;
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

    return true;
  };

  return (
    <ScenarioContext.Provider
      value={{
        scenarios,
        activeScenario,
        activeScenarioId,
        setActiveScenarioId,
        effectiveScenarioData,
        simulationResult,
        handleScenarioDataChange,
        handleCreateScenario,
        handleDeleteScenario,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
};
