export interface AIModel {
  id: string;
  name: string;
  description: string;
}

// Models are served directly via provider APIs.
// Default setup uses Groq (free tier) via GROQ_API_KEY.
export const AI_MODELS: AIModel[] = [
  {
    id: "groq/llama-3.3-70b-versatile",
    name: "Llama 3.3 70B (Groq)",
    description: "Fast, high-quality open model served from Groq's free tier",
  },
];

// Default to Groq Llama 3.3 70B (free tier friendly)
export const DEFAULT_MODEL_ID = "groq/llama-3.3-70b-versatile";

export interface AISettings {
  enabled: boolean;
  modelId: string;
}

const STORAGE_KEY = "adinkrarota-ai-settings";

export function getAISettings(): AISettings | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load AI settings:", e);
    return null;
  }
}

export function saveAISettings(settings: AISettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save AI settings:", e);
  }
}

export function clearAISettings(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear AI settings:", e);
  }
}

export function getModelById(modelId: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === modelId);
}

export function getDefaultSettings(): AISettings {
  return {
    enabled: true,
    modelId: DEFAULT_MODEL_ID,
  };
}
