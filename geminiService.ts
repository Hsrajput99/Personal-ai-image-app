
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ModelType, GenerationConfig } from "../types";

const IDENTITY_LOCK_PROMPT = `
STRICT IDENTITY PROTOCOL:
- SUBJECT: You MUST replicate the EXACT facial structure, skin tone, and features of the young Indian female influencer in the reference image.
- CHARACTERISTICS: Mid-20s, warm wheatish-fair skin, natural visible pores, dark messy hair, expressive eyes, soft natural lips.
- NO VARIATION: Do not "beautify", do not slim the face, do not change the jawline. Any deviation from the reference identity is a failure.
- PHOTOGRAPHY: Casual smartphone RAW, slightly uneven lighting, candid framing, minor digital noise. No studio lighting.
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateLifestyleImage = async (
  referenceImageBase64: string,
  config: GenerationConfig,
  apiKey?: string,
  onStatusUpdate?: (status: string, progress: number) => void
): Promise<string[]> => {
  const currentApiKey = apiKey || process.env.API_KEY;
  if (!currentApiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey: currentApiKey });
  const batchSeed = Math.floor(Math.random() * 2147483647);
  const results: string[] = [];
  const base64Data = referenceImageBase64.split(',')[1];

  // Robust delay for free users (RPM limits for gemini-2.5-flash-image are tight)
  const waitTime = config.model === ModelType.PRO ? 3000 : 12000;

  for (let i = 0; i < config.imageCount; i++) {
    if (onStatusUpdate) {
      onStatusUpdate(`Capturing Frame ${i + 1}/${config.imageCount}...`, (i / config.imageCount) * 100);
    }

    const prompt = `
      ${IDENTITY_LOCK_PROMPT}
      CURRENT FRAME: ${i + 1} of ${config.imageCount}.
      OUTFIT: ${config.outfit} (High material realism, natural wrinkles).
      LOCATION: ${config.location}.
      ACTION: Candid moment, looking away or subtle smile, phone-shot perspective.
      STRICT: The face MUST be 100% identical to the reference image provided.
    `;

    let attempts = 0;
    const maxAttempts = 2;
    let success = false;

    while (attempts < maxAttempts && !success) {
      try {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: config.model,
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
              { text: prompt },
            ],
          },
          config: {
            seed: batchSeed,
            imageConfig: {
              aspectRatio: config.aspectRatio,
              ...(config.model === ModelType.PRO ? { imageSize: config.imageSize || "1K" } : {})
            }
          }
        });

        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
          results.push(`data:image/png;base64,${part.inlineData.data}`);
          success = true;
        } else {
          throw new Error("Empty simulation data.");
        }
      } catch (error: any) {
        attempts++;
        const isRateLimit = error.message?.includes("RESOURCE_EXHAUSTED") || error.status === 429;
        
        if (isRateLimit && attempts < maxAttempts) {
          if (onStatusUpdate) onStatusUpdate("Rate limit hit. Cooling down (15s)...", 0);
          await delay(15000);
          continue;
        }
        
        if (results.length > 0) return results; // Return what we have
        throw new Error(isRateLimit ? "API Limit reached. Please try 'SNAP x1' or wait 60s." : "Capture failed.");
      }
    }

    if (i < config.imageCount - 1) {
      if (onStatusUpdate) onStatusUpdate(`Cooling sensor for Frame ${i+2}...`, ((i+1) / config.imageCount) * 100);
      await delay(waitTime);
    }
  }

  return results;
};
