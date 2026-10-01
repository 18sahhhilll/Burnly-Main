import { test, describe } from 'node:test';
import assert from 'node:assert';
import { runSimulation } from '../lib/simulationEngine.js';
import { calculateRiskScore } from '../lib/riskScorer.js';

describe('Simulation Engine Unit Tests', () => {
  test('calculates 36-month projections and detects zero-cash runway month accurately', () => {
    const scenarioData = {
      startingCash: 100000,
      monthlyRevenue: 0,
      revenueGrowthRate: 0,
      payrollSpend: 20000,
      marketingSpend: 5000,
      infrastructureSpend: 0,
      opsSpend: 0,
      founderSalary: 0,
      hiringTimeline: [],
    };

    const result = runSimulation(scenarioData);

    // Initial burn = 25000/mo. 100000 starting cash / 25000 = 4 months until zero cash.
    // 3 full months of positive buffer before month 4 ending cash hits 0.
    assert.strictEqual(result.startingCash, 100000);
    assert.strictEqual(result.initialBurn, 25000);
    assert.strictEqual(result.runwayMonths, 3);
    assert.strictEqual(result.breakEvenMonth, null);
    assert.strictEqual(result.riskLevel, 'High');
    assert.strictEqual(result.monthlyProjections.length, 36);
  });

  test('detects break-even month timing when revenue overtakes total expenses', () => {
    const scenarioData = {
      startingCash: 500000,
      monthlyRevenue: 10000,
      revenueGrowthRate: 20, // 20% growth per month
      payrollSpend: 20000,
      marketingSpend: 5000,
      infrastructureSpend: 0,
      opsSpend: 0,
      founderSalary: 0,
      hiringTimeline: [],
    };

    const result = runSimulation(scenarioData);

    // Total expenses = 25000/mo.
    // Mo 1: 10000, Mo 2: 12000, Mo 3: 14400, Mo 4: 17280, Mo 5: 20736, Mo 6: 24883, Mo 7: 29859 (exceeds 25000).
    assert.strictEqual(result.breakEvenMonth, 7);
  });

  test('accounts for dynamic hiring timeline additions in monthly payroll', () => {
    const scenarioData = {
      startingCash: 1000000,
      monthlyRevenue: 50000,
      revenueGrowthRate: 0,
      payrollSpend: 30000,
      marketingSpend: 5000,
      infrastructureSpend: 2000,
      opsSpend: 3000,
      founderSalary: 5000,
      hiringTimeline: [
        { startMonth: 3, count: 2, monthlySalary: 10000 }, // +20000 starting Month 3
      ],
    };

    const result = runSimulation(scenarioData);

    // Month 1 expenses: 30k base + 5k mkt + 2k infra + 3k ops + 5k founder = 45k
    assert.strictEqual(result.monthlyProjections[0].expenses, 45000);

    // Month 3 expenses: 45k + (2 * 10k) = 65k
    assert.strictEqual(result.monthlyProjections[2].expenses, 65000);
  });

  describe('Risk Scorer Logic', () => {
    test('assigns Low risk bucket for long runway and early break-even', () => {
      const risk = calculateRiskScore({
        runwayMonths: 36,
        breakEvenMonth: 6,
        initialBurn: 10000,
        startingCash: 1000000,
      });

      assert.ok(risk.score < 35);
      assert.strictEqual(risk.level, 'Low');
    });

    test('assigns High risk bucket for short runway (< 12 months)', () => {
      const risk = calculateRiskScore({
        runwayMonths: 6,
        breakEvenMonth: null,
        initialBurn: 50000,
        startingCash: 300000,
      });

      assert.ok(risk.score >= 65);
      assert.strictEqual(risk.level, 'High');
    });
  });
});
