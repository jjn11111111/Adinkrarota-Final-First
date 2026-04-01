import "server-only";

import { groq } from "@ai-sdk/groq";
import {
  GROQ_DAILY_WISDOM_MODEL_ID,
  resolveGroqApiModelId,
} from "@/lib/ai-groq";

export function groqLanguageModel(appModelId: string | undefined) {
  return groq(resolveGroqApiModelId(appModelId));
}

export function groqDailyWisdomModel() {
  return groq(GROQ_DAILY_WISDOM_MODEL_ID);
}
