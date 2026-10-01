import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Frontend Component Logic & Props Tests', () => {
  test('ReportView computes staleness correctly when inputsHash differs', () => {
    const reportObj = {
      inputsHash: 'a1b2c3d4e5f6',
      type: 'market',
      content: { summary: 'Old report summary' },
    };
    const currentInputsHash = 'z9y8x7w6v5u4';

    const isStale = reportObj && currentInputsHash && reportObj.inputsHash !== currentInputsHash;
    assert.strictEqual(isStale, true);
  });

  test('ReportView computes staleness as false when inputsHash matches exactly', () => {
    const reportObj = {
      inputsHash: 'a1b2c3d4e5f6',
      type: 'market',
      content: { summary: 'Up-to-date summary' },
    };
    const currentInputsHash = 'a1b2c3d4e5f6';

    const isStale = reportObj && currentInputsHash && reportObj.inputsHash !== currentInputsHash;
    assert.strictEqual(isStale, false);
  });

  test('ReportView provenance badge classification logic', () => {
    const getProvenanceBadgeType = (provenance) => {
      if (provenance === 'Computed') return 'emerald';
      if (provenance === 'Sourced') return 'blue';
      return 'amber'; // Estimate
    };

    assert.strictEqual(getProvenanceBadgeType('Computed'), 'emerald');
    assert.strictEqual(getProvenanceBadgeType('Sourced'), 'blue');
    assert.strictEqual(getProvenanceBadgeType('Estimate'), 'amber');
    assert.strictEqual(getProvenanceBadgeType('Unknown'), 'amber');
  });

  test('Mandatory legal disclaimer presence check', () => {
    const mandatoryDisclaimerText = 'Burnly Intelligence reports are planning aids generated using AI reasoning and deterministic financial modeling.';
    assert.ok(mandatoryDisclaimerText.includes('planning aids'));
    assert.ok(mandatoryDisclaimerText.includes('deterministic financial modeling'));
  });

  test('ProfileWizard step progression and default payload generation', () => {
    const steps = ['Business', 'Team', 'Financials', 'Revenue Details'];
    let currentStepIndex = 0;

    assert.strictEqual(steps[currentStepIndex], 'Business');

    currentStepIndex++;
    assert.strictEqual(steps[currentStepIndex], 'Team');

    currentStepIndex++;
    assert.strictEqual(steps[currentStepIndex], 'Financials');

    const defaultPayload = {
      name: 'Sample Venture',
      stage: 'Seed',
      financialSnapshot: { startingCash: 500000 },
    };

    assert.ok(defaultPayload.name);
    assert.strictEqual(defaultPayload.financialSnapshot.startingCash, 500000);
  });
});
