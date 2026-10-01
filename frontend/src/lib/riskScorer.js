/**
 * Calculates a 0-100 risk score and level bucket based on simulation outputs.
 * Higher score = Higher risk.
 */
export const calculateRiskScore = ({ runwayMonths, breakEvenMonth, initialBurn, startingCash }) => {
  let score = 0;

  // 1. Runway factor (up to 50 points)
  if (runwayMonths >= 36) {
    score += 0;
  } else if (runwayMonths >= 24) {
    score += 10;
  } else if (runwayMonths >= 18) {
    score += 20;
  } else if (runwayMonths >= 12) {
    score += 35;
  } else {
    score += 50;
  }

  // 2. Break-even factor (up to 30 points)
  if (breakEvenMonth === null) {
    // Never reaches break-even in 36 months
    score += 30;
  } else if (breakEvenMonth > 24) {
    score += 20;
  } else if (breakEvenMonth > 12) {
    score += 10;
  } else {
    score += 0;
  }

  // 3. Burn intensity ratio (up to 20 points)
  if (startingCash > 0) {
    const burnRatio = (initialBurn * 12) / startingCash;
    if (burnRatio > 1.5) {
      score += 20;
    } else if (burnRatio > 1.0) {
      score += 15;
    } else if (burnRatio > 0.5) {
      score += 10;
    } else {
      score += 5;
    }
  } else {
    score += 20;
  }

  // Clamp score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  let level = 'Low';
  if (finalScore >= 65) {
    level = 'High';
  } else if (finalScore >= 35) {
    level = 'Medium';
  }

  return {
    score: finalScore,
    level,
  };
};
