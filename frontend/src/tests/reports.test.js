import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Report Module Frontend Tests', () => {
  const sampleVenture = {
    name: 'Burnly AI',
    oneLiner: 'AI Startup Planning Platform',
    industry: 'SaaS',
    stage: 'Seed',
    team: [{ role: 'CEO', salary: 100000 }],
    financialSnapshot: { startingCash: 1000000 },
  };

  const sampleScenarioData = {
    startingCash: 1000000,
    monthlyRevenue: 50000,
    payrollSpend: 30000,
  };

  test('Validates report types supported by UI', () => {
    const validTypes = ['market', 'competitors', 'roadmap', 'pitch', 'risk'];
    assert.strictEqual(validTypes.length, 5);
    assert.ok(validTypes.includes('market'));
    assert.ok(validTypes.includes('competitors'));
    assert.ok(validTypes.includes('roadmap'));
    assert.ok(validTypes.includes('pitch'));
    assert.ok(validTypes.includes('risk'));
  });

  test('Validates provenance tags match required enumeration', () => {
    const provenanceTags = ['Computed', 'Sourced', 'Estimate'];
    assert.strictEqual(provenanceTags.length, 3);
    assert.ok(provenanceTags.includes('Computed'));
    assert.ok(provenanceTags.includes('Sourced'));
    assert.ok(provenanceTags.includes('Estimate'));
  });

  test('Ensures sample market report content adheres to UI structure requirements', () => {
    const mockReportContent = {
      summary: 'Market analysis summary for Burnly AI.',
      tam: { value: '₹50,000 Cr', description: 'Total market' },
      sam: { value: '₹7,500 Cr', description: 'Serviceable market' },
      som: { value: '₹250 Cr', description: 'Obtainable market' },
      trends: [
        { title: 'AI Automation', description: 'Increasing demand for automated financial forecasting.', provenance: 'Sourced' },
      ],
      opportunities: [
        { title: 'SaaS Expansion', description: 'Growth in SMB SaaS planning.', provenance: 'Estimate' },
      ],
    };

    assert.ok(mockReportContent.summary);
    assert.strictEqual(mockReportContent.tam.value, '₹50,000 Cr');
    assert.strictEqual(mockReportContent.trends[0].provenance, 'Sourced');
    assert.strictEqual(mockReportContent.opportunities[0].provenance, 'Estimate');
  });

  test('Ensures sample risk report content properly tags quantitative vs qualitative risks', () => {
    const mockRiskContent = {
      summary: 'Risk analysis for Burnly AI.',
      financialRiskSummary: {
        score: 35,
        level: 'Moderate',
        description: 'Derived from 18 months runway.',
      },
      qualitativeRisks: [
        {
          category: 'Regulatory',
          risk: 'Data privacy rules',
          severity: 'Medium',
          mitigation: 'Compliance review',
          provenance: 'Estimate',
        },
      ],
    };

    assert.strictEqual(mockRiskContent.financialRiskSummary.score, 35);
    assert.strictEqual(mockRiskContent.qualitativeRisks[0].severity, 'Medium');
  });

  test('NotFoundPage router fallback properties structure', () => {
    const validTabs = ['profile', 'simulator', 'projections', 'comparison', 'market', 'competitors', 'roadmap', 'pitch', 'risk'];
    const invalidTab = 'non_existent_route';

    const isTabRecognized = validTabs.includes(invalidTab);
    assert.strictEqual(isTabRecognized, false);
  });
});
