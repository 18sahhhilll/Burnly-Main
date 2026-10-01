import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    if (apiKey.startsWith('AQ.') || apiKey.startsWith('ya29.')) {
      console.warn('[LLM Client] Warning: GEMINI_API_KEY appears to be an OAuth token. Google AI Studio API Keys start with "AIzaSy...". Get a free key at https://aistudio.google.com');
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
    const requestedModel = modelName || process.env.LLM_MODEL || 'gemini-2.5-flash';
    const fallbackModels = [
      requestedModel,
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ];

    const candidateModels = [...new Set(fallbackModels)];
    let result = null;
    let lastError = null;

    for (const targetModel of candidateModels) {
      try {
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
        result = await model.generateContent(prompt);
        if (result) break;
      } catch (err) {
        lastError = err;
        if (err.message && (err.message.includes('404') || err.message.includes('not found'))) {
          console.warn(`[LLM Client] Model ${targetModel} not found. Retrying with next fallback...`);
          continue;
        }
        throw err;
      }
    }

    if (!result && lastError) {
      throw lastError;
    }

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
