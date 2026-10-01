import { calculateRiskScore } from './riskScorer.js';

/**
 * Pure function to execute a 36-month financial projection loop based on input scenario.
 */
export const runSimulation = (inputData = {}) => {
  const startingCash = Number(inputData.startingCash) || 0;
  const initialMonthlyRevenue = Number(inputData.monthlyRevenue) || 0;
  const revenueGrowthRate = (Number(inputData.revenueGrowthRate) || 0) / 100;
  const basePayroll = Number(inputData.payrollSpend) || 0;
  const marketing = Number(inputData.marketingSpend) || 0;
  const infrastructure = Number(inputData.infrastructureSpend) || 0;
  const ops = Number(inputData.opsSpend) || 0;
  const founderSalary = Number(inputData.founderSalary) || 0;
  const hiringTimeline = Array.isArray(inputData.hiringTimeline) ? inputData.hiringTimeline : [];

  const baseFixedExpenses = marketing + infrastructure + ops + founderSalary;

  let currentCash = startingCash;
  let currentRevenue = initialMonthlyRevenue;
  let runwayMonths = 36;
  let breakEvenMonth = null;
  let cashDepleted = false;

  const monthlyProjections = [];

  for (let month = 1; month <= 36; month++) {
    // Calculate hiring additions active in this month
    let activeHiringSpend = 0;
    hiringTimeline.forEach((hire) => {
      const startM = Number(hire.startMonth) || 1;
      if (month >= startM) {
        const count = Number(hire.count) || 1;
        const salary = Number(hire.monthlySalary) || 0;
        activeHiringSpend += count * salary;
      }
    });

    const totalPayroll = basePayroll + activeHiringSpend;
    const totalExpenses = totalPayroll + baseFixedExpenses;
    const netBurn = totalExpenses - currentRevenue; // Positive if losing money, negative if profitable

    const startingMonthCash = currentCash;
    const endingCash = startingMonthCash - netBurn;

    // Check runway / zero cash threshold
    if (!cashDepleted && endingCash <= 0 && startingCash > 0) {
      // Calculate fraction of month or exact month zero cash is reached
      runwayMonths = month - 1;
      cashDepleted = true;
    }

    // Check break-even (net burn <= 0 meaning revenue >= expenses)
    if (breakEvenMonth === null && netBurn <= 0 && currentRevenue > 0) {
      breakEvenMonth = month;
    }

    monthlyProjections.push({
      month,
      startingCash: Math.round(startingMonthCash),
      endingCash: Math.round(endingCash),
      revenue: Math.round(currentRevenue),
      expenses: Math.round(totalExpenses),
      payrollExpenses: Math.round(totalPayroll),
      fixedExpenses: Math.round(baseFixedExpenses),
      netBurn: Math.round(netBurn),
    });

    // Compound revenue growth for next month
    currentRevenue = currentRevenue * (1 + revenueGrowthRate);
    // Update cash for next loop
    currentCash = endingCash;
  }

  const initialNetBurn = monthlyProjections[0]?.netBurn || 0;

  // Calculate Risk Score
  const riskMetrics = calculateRiskScore({
    runwayMonths: cashDepleted ? runwayMonths : 36,
    breakEvenMonth,
    initialBurn: initialNetBurn,
    startingCash,
  });

  return {
    runwayMonths: cashDepleted ? runwayMonths : 36,
    breakEvenMonth,
    initialBurn: initialNetBurn,
    startingCash,
    monthlyProjections,
    riskScore: riskMetrics.score,
    riskLevel: riskMetrics.level,
  };
};
