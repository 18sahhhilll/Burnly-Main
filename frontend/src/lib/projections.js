import { runSimulation } from './simulationEngine.js';

/**
 * Generates Base, Conservative, and Aggressive scenario variants from base scenario inputs.
 */
export const generateScenarioVariants = (baseInputData = {}) => {
  const data = JSON.parse(JSON.stringify(baseInputData));

  // 1. Base Scenario
  const baseSimulation = runSimulation(data);

  // 2. Conservative Scenario (-30% revenue growth, +20% payroll/fixed spend)
  const conservativeData = {
    ...data,
    revenueGrowthRate: Math.max(0, (Number(data.revenueGrowthRate) || 0) * 0.7),
    payrollSpend: (Number(data.payrollSpend) || 0) * 1.2,
    marketingSpend: (Number(data.marketingSpend) || 0) * 1.15,
    infrastructureSpend: (Number(data.infrastructureSpend) || 0) * 1.15,
    opsSpend: (Number(data.opsSpend) || 0) * 1.15,
  };
  const conservativeSimulation = runSimulation(conservativeData);

  // 3. Aggressive Scenario (+30% revenue growth, -10% fixed spend efficiency)
  const aggressiveData = {
    ...data,
    revenueGrowthRate: (Number(data.revenueGrowthRate) || 0) * 1.3,
    marketingSpend: (Number(data.marketingSpend) || 0) * 0.9,
    infrastructureSpend: (Number(data.infrastructureSpend) || 0) * 0.9,
    opsSpend: (Number(data.opsSpend) || 0) * 0.9,
  };
  const aggressiveSimulation = runSimulation(aggressiveData);

  return {
    base: {
      name: 'Base Case',
      data,
      simulation: baseSimulation,
    },
    conservative: {
      name: 'Conservative Case',
      data: conservativeData,
      simulation: conservativeSimulation,
    },
    aggressive: {
      name: 'Aggressive Growth Case',
      data: aggressiveData,
      simulation: aggressiveSimulation,
    },
  };
};

/**
 * Calculates capital funding needs: required raise amount and closing target month
 * to maintain a target cash buffer (e.g. 6 months of expenses) before runway depletion or break-even.
 */
export const calculateFundingNeeds = (baseInputData = {}, targetBufferMonths = 6) => {
  const simulation = runSimulation(baseInputData);
  const projections = simulation.monthlyProjections || [];

  if (projections.length === 0) {
    return {
      needsFunding: false,
      recommendedRaise: 0,
      targetCloseMonth: null,
      targetBufferMonths,
    };
  }

  // Find lowest ending cash balance or cash depletion point
  let minCash = Infinity;
  let minCashMonth = 1;
  let maxDeficit = 0;

  for (const p of projections) {
    if (p.endingCash < minCash) {
      minCash = p.endingCash;
      minCashMonth = p.month;
    }
    // Required buffer = average monthly expenses * targetBufferMonths
    const requiredBuffer = p.expenses * targetBufferMonths;
    const deficit = requiredBuffer - p.endingCash;
    if (deficit > maxDeficit) {
      maxDeficit = deficit;
    }
  }

  const needsFunding = maxDeficit > 0;
  const recommendedRaise = needsFunding ? Math.ceil(maxDeficit / 10000) * 10000 : 0; // Round up to nearest 10k
  // Close funding at least 3-4 months before min cash point, or month 1 if short runway
  const targetCloseMonth = needsFunding ? Math.max(1, minCashMonth - 3) : null;

  return {
    needsFunding,
    recommendedRaise,
    targetCloseMonth,
    targetBufferMonths,
    minCashBalance: minCash,
    minCashMonth,
  };
};

/**
 * Executes a sensitivity analysis identifying which input variable moves runway the most when shifted by ±20%.
 */
export const calculateSensitivityAnalysis = (baseInputData = {}) => {
  const baseSimulation = runSimulation(baseInputData);
  const baseRunway = baseSimulation.runwayMonths;

  const variablesToTest = [
    { key: 'revenueGrowthRate', name: 'Revenue Growth Rate', step: 0.2 },
    { key: 'startingCash', name: 'Starting Cash', step: 0.2 },
    { key: 'payrollSpend', name: 'Base Payroll Spend', step: 0.2 },
    { key: 'marketingSpend', name: 'Marketing & Growth Spend', step: 0.2 },
    { key: 'monthlyRevenue', name: 'Starting Monthly Revenue', step: 0.2 },
  ];

  const results = variablesToTest.map((item) => {
    const originalVal = Number(baseInputData[item.key]) || 0;

    // Test +20%
    const plusData = { ...baseInputData, [item.key]: originalVal * (1 + item.step) };
    const plusRunway = runSimulation(plusData).runwayMonths;

    // Test -20%
    const minusData = { ...baseInputData, [item.key]: Math.max(0, originalVal * (1 - item.step)) };
    const minusRunway = runSimulation(minusData).runwayMonths;

    const maxImpact = Math.max(Math.abs(plusRunway - baseRunway), Math.abs(minusRunway - baseRunway));

    return {
      key: item.key,
      name: item.name,
      originalValue: originalVal,
      baseRunway,
      plus20Runway: plusRunway,
      minus20Runway: minusRunway,
      maxImpactMonths: maxImpact,
    };
  });

  // Sort by highest runway impact first
  results.sort((a, b) => b.maxImpactMonths - a.maxImpactMonths);

  return {
    baseRunway,
    sensitivities: results,
  };
};

/**
 * Optional revenue model math extensions (SaaS Subscription, Transactional, Marketplace, Services).
 */
export const calculateRevenueModelMetrics = (revenueModelData = {}) => {
  const {
    type = 'subscription',
    pricing = 0,
    customerCount = 0,
    churnRate = 0, // monthly churn %
    cac = 0, // customer acquisition cost
    grossMargin = 100, // %
  } = revenueModelData;

  const price = Number(pricing) || 0;
  const customers = Number(customerCount) || 0;
  const churn = (Number(churnRate) || 0) / 100;
  const cacCost = Number(cac) || 0;
  const margin = (Number(grossMargin) || 100) / 100;

  const monthlyGrossRevenue = price * customers;
  const monthlyGrossProfit = monthlyGrossRevenue * margin;
  const monthlyChurnedCustomers = Math.round(customers * churn);
  const mrrLostToChurn = monthlyChurnedCustomers * price;
  const ltv = churn > 0 ? (price * margin) / churn : price * margin * 36;
  const ltvToCacRatio = cacCost > 0 ? (ltv / cacCost).toFixed(1) : 'N/A';

  return {
    type,
    monthlyGrossRevenue,
    monthlyGrossProfit,
    monthlyChurnedCustomers,
    mrrLostToChurn,
    ltv: Math.round(ltv),
    ltvToCacRatio,
  };
};
