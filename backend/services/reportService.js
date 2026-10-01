import crypto from 'crypto';
import Report from '../models/Report.js';
import Venture from '../models/Venture.js';
import Scenario from '../models/Scenario.js';
import { runSimulation } from '../../frontend/src/lib/simulationEngine.js';
import { calculateFundingNeeds } from '../../frontend/src/lib/projections.js';
import { llmClient } from './llmClient.js';
import { buildMarketPrompt } from './prompts/market.js';
import { buildCompetitorsPrompt } from './prompts/competitors.js';
import { buildRoadmapPrompt } from './prompts/roadmap.js';
import { buildPitchPrompt } from './prompts/pitch.js';
import { buildRiskPrompt } from './prompts/risk.js';

export const computeInputsHash = (venture, scenarioData) => {
  const payload = {
    venture: {
      name: venture.name,
      oneLiner: venture.oneLiner,
      industry: venture.industry,
      stage: venture.stage,
      team: venture.team,
      financialSnapshot: venture.financialSnapshot,
    },
    scenarioData: scenarioData || {},
  };
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
};

/**
 * Ensures claims without supporting grounding segments are strictly tagged as "Estimate".
 */
export const sanitizeProvenance = (content, verifiedSources, groundingSupports = []) => {
  if (!content || typeof content !== 'object') return content;
  const sanitized = JSON.parse(JSON.stringify(content));
  const hasSources = Array.isArray(verifiedSources) && verifiedSources.length > 0;

  const isClaimSupported = (item) => {
    if (!hasSources) return false;
    if (!Array.isArray(groundingSupports) || groundingSupports.length === 0) {
      return false;
    }
    const itemText = `${item.title || item.name || item.gap || ''} ${item.description || item.positioning || item.opportunity || ''}`.toLowerCase().trim();
    if (!itemText) return false;

    return groundingSupports.some((sup) => {
      if (!Array.isArray(sup.groundingChunkIndices) || sup.groundingChunkIndices.length === 0) return false;
      const supText = (sup.segment?.text || '').toLowerCase().trim();
      return supText && (itemText.includes(supText) || supText.includes(itemText));
    });
  };

  const processItem = (item) => {
    if (item && typeof item === 'object') {
      if (item.provenance === 'Sourced') {
        if (!isClaimSupported(item)) {
          item.provenance = 'Estimate';
        }
      }
    }
  };

  ['trends', 'opportunities', 'directCompetitors', 'marketGaps', 'phases', 'slides', 'qualitativeRisks'].forEach((key) => {
    if (Array.isArray(sanitized[key])) {
      sanitized[key].forEach(processItem);
    }
  });

  return sanitized;
};

/**
 * Enforces strict consistency between generated report financial figures and deterministic simulation math.
 */
export const enforceDeterministicConsistency = (content, simulation, fundingNeeds) => {
  if (!content || typeof content !== 'object') return content;
  const sanitized = JSON.parse(JSON.stringify(content));

  // 1. Risk Score & Level Consistency
  if (sanitized.financialRiskSummary) {
    if (sanitized.financialRiskSummary.score !== simulation.riskScore) {
      console.warn(`[Consistency Enforcer] Mismatch in risk score: LLM returned ${sanitized.financialRiskSummary.score}, expected ${simulation.riskScore}. Overwriting.`);
      sanitized.financialRiskSummary.score = simulation.riskScore;
    }
    if (sanitized.financialRiskSummary.level !== simulation.riskLevel) {
      console.warn(`[Consistency Enforcer] Mismatch in risk level: LLM returned ${sanitized.financialRiskSummary.level}, expected ${simulation.riskLevel}. Overwriting.`);
      sanitized.financialRiskSummary.level = simulation.riskLevel;
    }
  }

  // 2. Pitch Deck Financial Slides & Ask
  if (Array.isArray(sanitized.slides)) {
    const raiseAmountStr = fundingNeeds && fundingNeeds.recommendedRaise > 0
      ? `₹${fundingNeeds.recommendedRaise.toLocaleString()}`
      : `₹${(simulation.plannedRaise || 5000000).toLocaleString()}`;
    const breakEvenStr = simulation.breakEvenMonth ? `Month ${simulation.breakEvenMonth}` : 'Path to Profitability';

    sanitized.slides.forEach((slide) => {
      if (slide.slideNumber === 7 || slide.title?.toLowerCase().includes('financial')) {
        slide.keyBulletPoints = [
          `Starting Cash: ₹${(simulation.startingCash || 0).toLocaleString()}`,
          `Initial Net Burn: ₹${Math.abs(simulation.initialBurn || 0).toLocaleString()}/mo`,
          `Break-Even Target: ${breakEvenStr}`,
        ];
        slide.headline = `36-Month Model: ${simulation.runwayMonths} Months Runway`;
        slide.provenance = 'Computed';
      }
      if (slide.slideNumber === 8 || slide.title?.toLowerCase().includes('ask')) {
        slide.keyBulletPoints = [
          `Funding Target: ${raiseAmountStr}`,
          `Use of Funds: 50% Product & Engineering, 30% Growth & Sales, 20% Reserve`,
        ];
        slide.headline = `Raising ${raiseAmountStr} to reach break-even`;
        slide.provenance = 'Computed';
      }
    });
  }

  // 3. Roadmap Runway Markers
  if (Array.isArray(sanitized.phases)) {
    sanitized.phases.forEach((ph) => {
      if (!ph.runwayMarker || !ph.runwayMarker.includes(`${simulation.runwayMonths}`)) {
        ph.runwayMarker = `Target Phase / ${simulation.runwayMonths} Months Runway`;
      }
    });
  }

  // 4. Prose Text Scanner & Mismatch Corrector
  const scanAndFixProse = (str) => {
    if (typeof str !== 'string') return str;
    let fixed = str;

    // Scan for "X months of runway" or "runway of X months" where X != simulation.runwayMonths
    const runwayRegex = /(\b\d+\b)\s*(?:months?|mos?)\s*(?:of\s*)?runway/gi;
    fixed = fixed.replace(runwayRegex, (match, p1) => {
      if (parseInt(p1, 10) !== simulation.runwayMonths) {
        console.warn(`[Prose Consistency Scanner] Overwriting prose runway mismatch: "${p1} months" -> "${simulation.runwayMonths} months"`);
        return `${simulation.runwayMonths} months of runway`;
      }
      return match;
    });

    return fixed;
  };

  const walkAndSanitizeProse = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const k in obj) {
      if (typeof obj[k] === 'string') {
        obj[k] = scanAndFixProse(obj[k]);
      } else if (typeof obj[k] === 'object') {
        walkAndSanitizeProse(obj[k]);
      }
    }
  };

  walkAndSanitizeProse(sanitized);

  return sanitized;
};

export const generateReportService = async ({ userId, ventureId, scenarioId, type }) => {
  // 1. Fetch venture directly from DB to prevent spoofing
  const venture = await Venture.findOne({ _id: ventureId, userId });
  if (!venture) {
    throw new Error('Venture profile not found or unauthorized');
  }

  // 2. Fetch scenario directly from DB if supplied, or load default scenario
  let scenario = null;
  if (scenarioId) {
    scenario = await Scenario.findOne({ _id: scenarioId, userId });
  }
  if (!scenario) {
    scenario = await Scenario.findOne({ ventureId, userId }).sort({ updatedAt: -1 });
  }

  const scenarioData = scenario?.data || venture.financialSnapshot || {};
  const simulation = runSimulation(scenarioData);
  const fundingNeeds = calculateFundingNeeds(scenarioData, 6);
  const inputsHash = computeInputsHash(venture, scenarioData);

  // 3. Select prompt builder based on report type
  let prompt = '';
  try {
    switch (type) {
      case 'market':
        prompt = buildMarketPrompt({ venture, scenario, simulation });
        break;
      case 'competitors':
        prompt = buildCompetitorsPrompt({ venture, scenario, simulation });
        break;
      case 'roadmap':
        prompt = buildRoadmapPrompt({ venture, scenario, simulation });
        break;
      case 'pitch':
        prompt = buildPitchPrompt({ venture, scenario, simulation, fundingNeeds });
        break;
      case 'risk':
        prompt = buildRiskPrompt({ venture, scenario, simulation });
        break;
      default:
        throw new Error(`Invalid report type "${type}"`);
    }
  } catch (err) {
    console.error('Error building prompt in reportService:', err);
    throw err;
  }

  // 4. Call LLM with retry once if JSON parsing fails
  const modelName = process.env.LLM_MODEL || 'gemini-1.5-flash';
  const enableGrounding = type === 'market' || type === 'competitors';

  let rawLlmOutput = null;
  try {
    rawLlmOutput = await llmClient.generateReportLLM({ prompt, modelName, enableGrounding });
  } catch (err) {
    console.warn(`[ReportService] First LLM attempt failed for type ${type}. Retrying once...`, err);
    rawLlmOutput = await llmClient.generateReportLLM({ prompt, modelName, enableGrounding });
  }

  const reportJson = rawLlmOutput?.content ? rawLlmOutput.content : rawLlmOutput;
  const retrievedSources = Array.isArray(rawLlmOutput?.sources) ? rawLlmOutput.sources : [];
  const groundingSupports = Array.isArray(rawLlmOutput?.groundingSupports) ? rawLlmOutput.groundingSupports : [];
  const tokenUsage = rawLlmOutput?.tokenUsage || 0;

  if (!reportJson || typeof reportJson !== 'object') {
    throw new Error('LLM output failed JSON validation');
  }

  if (!reportJson.summary) {
    throw new Error('LLM output missing required "summary" section');
  }

  console.log(`[ReportService] Generated report type="${type}" tokenUsage=${tokenUsage}`);

  const verifiedSources = retrievedSources.map((s) => ({
    title: s.title || 'Search Citation',
    url: s.url || '',
    domain: s.domain || '',
    retrievalDate: s.retrievalDate || new Date().toISOString().split('T')[0],
  }));

  // Sanitize per-claim provenance against segment-level grounding supports
  const sanitizedContent = sanitizeProvenance(reportJson, verifiedSources, groundingSupports);

  // Enforce 100% deterministic consistency against simulation math
  const finalContent = enforceDeterministicConsistency(sanitizedContent, simulation, fundingNeeds);

  // 5. Save or update Report document in MongoDB
  let reportDoc = await Report.findOne({ userId, ventureId, type });

  if (reportDoc) {
    reportDoc.scenarioId = scenario?._id;
    reportDoc.content = finalContent;
    reportDoc.sources = verifiedSources;
    reportDoc.inputsHash = inputsHash;
    reportDoc.model = modelName;
    reportDoc.status = 'completed';
    reportDoc.generatedAt = new Date();
    await reportDoc.save();
  } else {
    reportDoc = await Report.create({
      userId,
      ventureId,
      scenarioId: scenario?._id,
      type,
      content: finalContent,
      sources: verifiedSources,
      inputsHash,
      model: modelName,
      status: 'completed',
      generatedAt: new Date(),
    });
  }

  return reportDoc;
};
