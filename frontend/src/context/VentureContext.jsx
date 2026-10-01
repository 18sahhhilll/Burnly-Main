import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { PRESET_SCENARIOS } from '../lib/presets.js';

const VentureContext = createContext();

const SAMPLE_VENTURE = {
  _id: 'sample-venture-1',
  id: 'sample-venture-1',
  name: 'PayFlow India (Sample)',
  oneLiner: 'Automated UPI & B2B payouts for Indian SaaS startups',
  problem: 'Manual payout reconciliation costs Indian SMBs 20+ hours weekly',
  industry: 'Fintech',
  businessModel: 'subscription',
  targetCustomer: 'B2B SMBs & Startups',
  geography: 'India',
  stage: 'Seed',
  team: {
    foundersCount: 2,
    headcount: 5,
    keyRoles: 'Engineering, Product, Growth',
  },
  financialSnapshot: {
    startingCash: 1500000,
    monthlyRevenue: 25000,
    revenueGrowthRate: 8,
    payrollSpend: 45000,
    marketingSpend: 12000,
    infrastructureSpend: 4000,
    opsSpend: 5000,
    founderSalary: 10000,
    fundingRaisedSoFar: 2000000,
    plannedRaise: 5000000,
  },
  revenueModelDetails: {
    pricing: 2500,
    customerCount: 10,
    churnRate: 1.5,
    cac: 8000,
    grossMargin: 85,
  },
  isSample: true,
};

export const VentureProvider = ({ children }) => {
  const { token } = useAuth();
  const [ventures, setVentures] = useState([SAMPLE_VENTURE]);
  const [activeVentureId, setActiveVentureId] = useState(SAMPLE_VENTURE._id);
  const [loading, setLoading] = useState(false);

  // Sync ventures from API when authenticated
  useEffect(() => {
    const fetchVentures = async () => {
      if (!token) {
        setVentures([SAMPLE_VENTURE]);
        setActiveVentureId(SAMPLE_VENTURE._id);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/ventures', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setVentures(data);
            setActiveVentureId(data[0]._id || data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch ventures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, [token]);

  const activeVenture = ventures.find((v) => (v._id || v.id) === activeVentureId) || ventures[0];

  const updateActiveVenture = async (updatedFields) => {
    const newVenture = { ...activeVenture, ...updatedFields };
    setVentures((prev) =>
      prev.map((v) => ((v._id || v.id) === (activeVenture._id || activeVenture.id) ? newVenture : v))
    );

    if (token && activeVenture._id && !activeVenture.isSample) {
      try {
        await fetch(`/api/ventures/${activeVenture._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        });
      } catch (err) {
        console.error('Failed to update venture on backend:', err);
      }
    }
  };

  const createVenture = async (venturePayload) => {
    if (token) {
      try {
        const res = await fetch('/api/ventures', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(venturePayload),
        });

        if (res.ok) {
          const created = await res.json();
          setVentures((prev) => [created, ...prev]);
          setActiveVentureId(created._id);
          return created;
        }
      } catch (err) {
        console.error('Failed to create venture:', err);
      }
    }

    // Local fallback
    const localVenture = {
      _id: 'local-v-' + Date.now(),
      id: 'local-v-' + Date.now(),
      ...venturePayload,
    };
    setVentures((prev) => [localVenture, ...prev]);
    setActiveVentureId(localVenture._id);
    return localVenture;
  };

  return (
    <VentureContext.Provider
      value={{
        ventures,
        activeVenture,
        activeVentureId,
        setActiveVentureId,
        updateActiveVenture,
        createVenture,
        loading,
        sampleVenture: SAMPLE_VENTURE,
      }}
    >
      {children}
    </VentureContext.Provider>
  );
};

export const useVenture = () => {
  const context = useContext(VentureContext);
  if (!context) {
    throw new Error('useVenture must be used within a VentureProvider');
  }
  return context;
};
