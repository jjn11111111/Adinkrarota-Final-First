/** Groq configuration shared by client (labels, ids) and server (API model names). */

export const GROQ_CHAT_MODELS = [
  {
    id: "groq/llama-3.3-70b-versatile",
    groqModelId: "llama-3.3-70b-versatile" as const,
    name: "Llama 3.3 70B",
    description: "Best quality for interpretations and follow-ups (recommended)",
  },
  {
    id: "groq/mixtral-8x7b-32768",
    groqModelId: "mixtral-8x7b-32768" as const,
    name: "Mixtral 8×7B",
    description: "Faster, lighter—good for quick prompts",
  },
] as const;

export type GroqAppModelId = (typeof GROQ_CHAT_MODELS)[number]["id"];

export const DEFAULT_GROQ_MODEL_ID: GroqAppModelId =
  GROQ_CHAT_MODELS[0].id;

const VALID_IDS = new Set<string>(GROQ_CHAT_MODELS.map((m) => m.id));

export function resolveGroqApiModelId(appModelId: string | undefined): string {
  const id =
    appModelId && VALID_IDS.has(appModelId)
      ? appModelId
      : DEFAULT_GROQ_MODEL_ID;
  const entry = GROQ_CHAT_MODELS.find((m) => m.id === id)!;
  return entry.groqModelId;
}

/** Daily wisdom uses one fixed model for consistency */
export const GROQ_DAILY_WISDOM_MODEL_ID = "llama-3.3-70b-versatile" as const;

/** Shown when GROQ_API_KEY is missing or invalid */
export const GROQ_ENV_HINT =
  "Set GROQ_API_KEY in Vercel (Project → Settings → Environment Variables) or in .env.local for local dev. Create a key at https://console.groq.com/keys";
