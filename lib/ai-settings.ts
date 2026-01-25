export interface AIProvider {
  id: string;
  name: string;
  models: { id: string; name: string }[];
  requiresApiKey: boolean;
  keyEnvVar?: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "openai/gpt-4o", name: "GPT-4o" },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
      { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
    ],
    requiresApiKey: true,
    keyEnvVar: "OPENAI_API_KEY",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "anthropic/claude-sonnet-4-5", name: "Claude Sonnet 4.5" },
      { id: "anthropic/claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
      { id: "anthropic/claude-3-haiku-20240307", name: "Claude 3 Haiku" },
    ],
    requiresApiKey: true,
    keyEnvVar: "ANTHROPIC_API_KEY",
  },
  {
    id: "google",
    name: "Google AI",
    models: [
      { id: "google/gemini-2.0-flash-exp", name: "Gemini 2.0 Flash" },
      { id: "google/gemini-1.5-pro", name: "Gemini 1.5 Pro" },
      { id: "google/gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    ],
    requiresApiKey: true,
    keyEnvVar: "GOOGLE_GENERATIVE_AI_API_KEY",
  },
  {
    id: "groq",
    name: "Groq (Free)",
    models: [
      { id: "groq/llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
      { id: "groq/mixtral-8x7b-32768", name: "Mixtral 8x7B" },
    ],
    requiresApiKey: false,
    keyEnvVar: "GROQ_API_KEY",
  },
  {
    id: "xai",
    name: "xAI Grok (Free)",
    models: [
      { id: "xai/grok-2-1212", name: "Grok 2" },
      { id: "xai/grok-beta", name: "Grok Beta" },
    ],
    requiresApiKey: false,
    keyEnvVar: "XAI_API_KEY",
  },
];

export interface AISettings {
  enabled: boolean;
  providerId: string;
  modelId: string;
  apiKey: string;
}

const STORAGE_KEY = "adinkrarota-ai-settings";

export function getAISettings(): AISettings | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveAISettings(settings: AISettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearAISettings(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getProviderById(id: string): AIProvider | undefined {
  return AI_PROVIDERS.find((p) => p.id === id);
}

export function getModelById(
  providerId: string,
  modelId: string
): { id: string; name: string } | undefined {
  const provider = getProviderById(providerId);
  return provider?.models.find((m) => m.id === modelId);
}
