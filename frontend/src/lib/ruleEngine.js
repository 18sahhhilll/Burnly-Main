/**
 * Evaluates simulation output and generates specific actionable warnings/suggestions.
 */
export const generateSuggestions = (scenarioData, simulationResult) => {
  const suggestions = [];
  const { runwayMonths, breakEvenMonth, initialBurn } = simulationResult;
  const { startingCash, marketingSpend, payrollSpend, founderSalary, hiringTimeline = [] } = scenarioData;

  // 1. Short runway warning
  if (runwayMonths < 12) {
    suggestions.push({
      id: 'short-runway',
      type: 'danger',
      title: 'Critical Runway Alert',
      message: `At your current initial net burn of ₹${initialBurn.toLocaleString()}/mo, cash depletes in ${runwayMonths} month${runwayMonths === 1 ? '' : 's'}. Target at least 18 months of runway before next raise.`,
    });
  } else if (runwayMonths < 18) {
    suggestions.push({
      id: 'moderate-runway',
      type: 'warning',
      title: 'Sub-18 Month Runway',
      message: `You have ${runwayMonths} months of cash left. Consider delaying non-essential hiring or reducing marketing spend to reach an 18-month cushion.`,
    });
  }

  // 2. Break-even advice
  if (breakEvenMonth === null) {
    suggestions.push({
      id: 'no-breakeven',
      type: 'warning',
      title: 'No Break-Even Reached',
      message: 'Revenue does not cover total monthly expenses within the 36-month horizon. Accelerate revenue growth rate or trim fixed costs.',
    });
  } else if (breakEvenMonth > 24) {
    suggestions.push({
      id: 'late-breakeven',
      type: 'info',
      title: `Break-Even at Month ${breakEvenMonth}`,
      message: `Profitability is projected in month ${breakEvenMonth}. Ensure capital reserves stay positive through month ${breakEvenMonth - 1}.`,
    });
  } else {
    suggestions.push({
      id: 'early-breakeven',
      type: 'success',
      title: `Profitability Reached in Month ${breakEvenMonth}`,
      message: `Great trajectory! Net cash flow becomes positive at month ${breakEvenMonth}.`,
    });
  }

  // 3. Marketing spend analysis
  if (marketingSpend > 0 && initialBurn > 0) {
    const mktPercent = Math.round((marketingSpend / (payrollSpend + marketingSpend + (scenarioData.infrastructureSpend || 0) + (scenarioData.opsSpend || 0) + founderSalary)) * 100);
    if (mktPercent > 40) {
      const cutAmount = Math.round(marketingSpend * 0.25);
      suggestions.push({
        id: 'high-marketing',
        type: 'info',
        title: 'High Marketing Ratio',
        message: `Marketing accounts for ${mktPercent}% of your monthly expenses. Trimming marketing by ₹${cutAmount.toLocaleString()}/mo could extend your runway significantly.`,
      });
    }
  }

  // 4. Hiring impact notice
  if (hiringTimeline.length > 0) {
    const totalNewHires = hiringTimeline.reduce((acc, h) => acc + (Number(h.count) || 1), 0);
    const addedMonthlySalary = hiringTimeline.reduce((acc, h) => acc + (Number(h.count) || 1) * (Number(h.monthlySalary) || 0), 0);
    suggestions.push({
      id: 'hiring-impact',
      type: 'info',
      title: `${totalNewHires} Planned Hire${totalNewHires > 1 ? 's' : ''}`,
      message: `Planned hiring adds ₹${addedMonthlySalary.toLocaleString()}/mo to your burn rate as hires onboard over the 36-month timeline.`,
    });
  }

  return suggestions;
};
