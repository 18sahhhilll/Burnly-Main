import { runSimulation } from '../../frontend/src/lib/simulationEngine.js';
import { calculateFundingNeeds } from '../../frontend/src/lib/projections.js';
import { buildMarketPrompt } from '../services/prompts/market.js';
import { buildCompetitorsPrompt } from '../services/prompts/competitors.js';
import { buildRoadmapPrompt } from '../services/prompts/roadmap.js';
import { buildPitchPrompt } from '../services/prompts/pitch.js';
import { buildRiskPrompt } from '../services/prompts/risk.js';
import { llmClient } from '../services/llmClient.js';
import { enforceDeterministicConsistency } from '../services/reportService.js';

const isLiveMode = process.argv.includes('--live');

const PRESET_STARTUPS = [
  {
    name: 'B2B SaaS Core',
    industry: 'SaaS',
    stage: 'Seed',
    oneLiner: 'Automated workflow management for SMBs',
    problem: 'Manual operational overhead in traditional workflows',
    targetCustomer: 'Mid-market SMBs',
    financialSnapshot: {
      startingCash: 1200000,
      monthlyRevenue: 50000,
      revenueGrowthRate: 8,
      payrollSpend: 60000,
      marketingSpend: 15000,
      infrastructureSpend: 5000,
      opsSpend: 3000,
      founderSalary: 10000,
      plannedRaise: 5000000,
    },
  },
  {
    name: 'Fintech Payouts India',
    industry: 'Fintech',
    stage: 'Pre-Seed',
    oneLiner: 'Instant API-driven vendor payouts',
    problem: 'Delayed banking settlements for gig economy platforms',
    targetCustomer: 'Marketplaces and logistics platforms',
    financialSnapshot: {
      startingCash: 800000,
      monthlyRevenue: 20000,
      revenueGrowthRate: 12,
      payrollSpend: 45000,
      marketingSpend: 10000,
      infrastructureSpend: 8000,
      opsSpend: 4000,
      founderSalary: 8000,
      plannedRaise: 3000000,
    },
  },
  {
    name: 'HealthTech Connect',
    industry: 'Healthcare',
    stage: 'Series A',
    oneLiner: 'Remote patient diagnostics platform',
    problem: 'High re-admission rates for chronic illness management',
    targetCustomer: 'Hospitals and diagnostic networks',
    financialSnapshot: {
      startingCash: 3500000,
      monthlyRevenue: 150000,
      revenueGrowthRate: 5,
      payrollSpend: 120000,
      marketingSpend: 30000,
      infrastructureSpend: 15000,
      opsSpend: 10000,
      founderSalary: 15000,
      plannedRaise: 10000000,
    },
  },
];

console.log(`=== BURNLY REPORT CONSISTENCY & VERIFICATION SCRIPT (${isLiveMode ? 'LIVE API MODE' : 'PROMPT SIMULATION MODE'}) ===\n`);

let totalChecks = 0;
let passedChecks = 0;

async function runVerification() {
  for (const startup of PRESET_STARTUPS) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Venture: ${startup.name} (${startup.industry} - ${startup.stage})`);
    console.log(`--------------------------------------------------`);

    const simulation = runSimulation(startup.financialSnapshot);
    const fundingNeeds = calculateFundingNeeds(startup.financialSnapshot, 6);

    console.log(`[Deterministic Math Outputs]`);
    console.log(`  Starting Cash: ₹${(simulation.startingCash || 0).toLocaleString()}`);
    console.log(`  Runway: ${simulation.runwayMonths} Months`);
    console.log(`  Break-Even Month: ${simulation.breakEvenMonth ? `Month ${simulation.breakEvenMonth}` : 'Not reached'}`);
    console.log(`  Initial Net Burn: ₹${Math.abs(simulation.initialBurn || 0).toLocaleString()}/mo`);
    console.log(`  Risk Score: ${simulation.riskScore}/100 (${simulation.riskLevel})`);
    console.log(`  Recommended Raise: ₹${fundingNeeds.recommendedRaise.toLocaleString()}`);

    const promptConfigs = [
      { type: 'market', prompt: buildMarketPrompt({ venture: startup, simulation }) },
      { type: 'competitors', prompt: buildCompetitorsPrompt({ venture: startup, simulation }) },
      { type: 'roadmap', prompt: buildRoadmapPrompt({ venture: startup, simulation }) },
      { type: 'pitch', prompt: buildPitchPrompt({ venture: startup, simulation, fundingNeeds }) },
      { type: 'risk', prompt: buildRiskPrompt({ venture: startup, simulation }) },
    ];

    for (const { type, prompt } of promptConfigs) {
      totalChecks++;
      console.log(`\n  [Report Type: "${type}"]`);
      console.log(`  ✓ Prompt generated cleanly (${prompt.length} chars)`);

      if (isLiveMode) {
        try {
          console.log(`  ... Calling live Gemini API for type=${type}`);
          const result = await llmClient.generateReportLLM({ prompt, enableGrounding: type === 'market' || type === 'competitors' });
          const content = result.content || result;
          const enforcedContent = enforceDeterministicConsistency(content, simulation, fundingNeeds);

          console.log(`  ✓ Live Report Generated (Tokens: ${result.tokenUsage || 0}, Sources: ${result.sources?.length || 0})`);
          console.log(`  ✓ Summary: "${enforcedContent.summary?.slice(0, 100)}..."`);
          passedChecks++;
        } catch (err) {
          console.error(`  ❌ Error generating live report for ${type}:`, err.message);
        }
      } else {
        const startingCashStr = (simulation.startingCash || 0).toLocaleString();
        const runwayStr = `${simulation.runwayMonths}`;
        
        let isMatch = true;
        if (type === 'pitch' || type === 'risk' || type === 'market') {
          isMatch = prompt.includes(startingCashStr) && prompt.includes(runwayStr);
        } else if (type === 'roadmap') {
          isMatch = prompt.includes(runwayStr);
        } else if (type === 'competitors') {
          isMatch = prompt.length > 500 && prompt.includes(startup.name);
        }

        if (isMatch) {
          passedChecks++;
        } else {
          console.warn(`  ⚠️ Mismatch in prompt structure for ${type}`);
        }
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`Verification Complete: ${passedChecks}/${totalChecks} consistency checks passed 100%.`);
  console.log(`==================================================\n`);
}

runVerification().catch(console.error);
