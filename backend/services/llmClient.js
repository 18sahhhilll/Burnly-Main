import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

/**
 * Clean Google redirect URLs to obtain direct target URIs
 */
export function cleanGroundingUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const urlObj = new URL(rawUrl);
    if (urlObj.hostname.includes('google.') && urlObj.searchParams.has('q')) {
      const actualUrl = urlObj.searchParams.get('q');
      if (actualUrl) return actualUrl;
    }
    return rawUrl;
  } catch {
    return rawUrl;
  }
}

/**
 * Server-only LLM client for generating structured JSON reports.
 * Supports Google Search Grounding for real source retrieval.
 */
export const llmClient = {
  generateReportLLM: async ({ prompt, modelName, enableGrounding = false }) => {
    const targetModel = modelName || process.env.LLM_MODEL || 'gemini-1.5-flash';
    const modelOptions = {
      model: targetModel,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    if (enableGrounding) {
      modelOptions.tools = [{ googleSearch: {} }];
    }

    const model = getGenAI().getGenerativeModel(modelOptions);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    const usageMetadata = response.usageMetadata || {};

    // Extract search grounding metadata (chunks & supports)
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const retrievedSources = [];

    if (groundingMetadata?.groundingChunks) {
      const todayStr = new Date().toISOString().split('T')[0];
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          const directUrl = cleanGroundingUrl(chunk.web.uri);
          let domainName = '';
          try {
            domainName = new URL(directUrl).hostname.replace(/^www\./, '');
          } catch {
            domainName = '';
          }

          retrievedSources.push({
            title: chunk.web.title || domainName || 'Grounding Source',
            url: directUrl,
            domain: domainName,
            retrievalDate: todayStr,
          });
        }
      }
    }

    let parsed = null;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleanedText);
    }

    return {
      content: parsed,
      sources: retrievedSources,
      groundingSupports: groundingMetadata?.groundingSupports || [],
      tokenUsage: usageMetadata.totalTokenCount || 0,
    };
  },
};

export const generateReportLLM = (args) => llmClient.generateReportLLM(args);
