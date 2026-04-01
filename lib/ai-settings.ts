import {
  DEFAULT_GROQ_MODEL_ID,
  GROQ_CHAT_MODELS,
} from "@/lib/ai-groq";

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

// Groq models — server needs `GROQ_API_KEY` (see AI Settings modal).
export const AI_MODELS: AIModel[] = GROQ_CHAT_MODELS.map((m) => ({
  id: m.id,
  name: m.name,
  description: m.description,
}));

export const DEFAULT_MODEL_ID = DEFAULT_GROQ_MODEL_ID;

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
    const parsed = JSON.parse(stored) as AISettings;
    if (!AI_MODELS.some((m) => m.id === parsed.modelId)) {
      parsed.modelId = DEFAULT_MODEL_ID;
    }
    return parsed;
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
