export interface AIModel {
  id: string;
  name: string;
  description: string;
}

// All models work via Vercel AI Gateway. On Vercel, no API keys needed (OIDC). Locally, set AI_GATEWAY_API_KEY in .env.local.
export const AI_MODELS: AIModel[] = [
  {
    id: "anthropic/claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    description: "Anthropic's most capable model for nuanced interpretations",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's flagship multimodal model",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast and efficient for quick readings",
  },
  {
    id: "groq/llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    description: "Open source model with fast inference via Groq",
  },
  {
    id: "xai/grok-2-1212",
    name: "Grok 2",
    description: "xAI's conversational model",
  },
];

export const DEFAULT_MODEL_ID = "anthropic/claude-sonnet-4-5";

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
