import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  generateScenarioVariants,
  calculateFundingNeeds,
  calculateSensitivityAnalysis,
  calculateRevenueModelMetrics,
} from '../lib/projections.js';

describe('Projections Module Unit Tests', () => {
  const sampleInput = {
    startingCash: 500000,
    monthlyRevenue: 20000,
    revenueGrowthRate: 5,
    payrollSpend: 40000,
    marketingSpend: 10000,
    infrastructureSpend: 3000,
    opsSpend: 2000,
    founderSalary: 5000,
    hiringTimeline: [],
  };

  test('generateScenarioVariants returns Base, Conservative, and Aggressive variants', () => {
    const variants = generateScenarioVariants(sampleInput);

    assert.ok(variants.base);
    assert.ok(variants.conservative);
    assert.ok(variants.aggressive);

    assert.strictEqual(variants.base.name, 'Base Case');
    assert.strictEqual(variants.conservative.name, 'Conservative Case');
    assert.strictEqual(variants.aggressive.name, 'Aggressive Growth Case');

    // Conservative revenue growth should be lower than Base
    assert.ok(variants.conservative.data.revenueGrowthRate < sampleInput.revenueGrowthRate);
    // Aggressive revenue growth should be higher than Base
    assert.ok(variants.aggressive.data.revenueGrowthRate > sampleInput.revenueGrowthRate);
  });

  test('calculateFundingNeeds identifies raise amount and target close month for buffer', () => {
    const funding = calculateFundingNeeds(sampleInput, 6);

    assert.strictEqual(funding.needsFunding, true);
    assert.ok(funding.recommendedRaise > 0);
    assert.ok(funding.targetCloseMonth >= 1);
    assert.strictEqual(funding.targetBufferMonths, 6);
  });

  test('calculateSensitivityAnalysis ranks financial variables by runway impact', () => {
    const sensitivity = calculateSensitivityAnalysis(sampleInput);

    assert.strictEqual(typeof sensitivity.baseRunway, 'number');
    assert.ok(Array.isArray(sensitivity.sensitivities));
    assert.ok(sensitivity.sensitivities.length >= 4);

    // Verify ordering: maxImpactMonths should be sorted descending
    for (let i = 0; i < sensitivity.sensitivities.length - 1; i++) {
      assert.ok(
        sensitivity.sensitivities[i].maxImpactMonths >= sensitivity.sensitivities[i + 1].maxImpactMonths
      );
    }
  });

  test('calculateRevenueModelMetrics computes SaaS LTV, Churn loss, and gross profit', () => {
    const revenueData = {
      type: 'subscription',
      pricing: 5000, // ₹5,000 / month per customer
      customerCount: 20, // 20 customers = ₹100,000 MRR
      churnRate: 2, // 2% churn / mo
      cac: 15000, // ₹15,000 CAC
      grossMargin: 80, // 80% margin
    };

    const metrics = calculateRevenueModelMetrics(revenueData);

    assert.strictEqual(metrics.monthlyGrossRevenue, 100000);
    assert.strictEqual(metrics.monthlyGrossProfit, 80000);
    assert.strictEqual(metrics.monthlyChurnedCustomers, 0); // 20 * 0.02 = 0.4 -> rounded 0
    assert.ok(metrics.ltv > 0);
    assert.ok(metrics.ltvToCacRatio !== 'N/A');
  });
});
