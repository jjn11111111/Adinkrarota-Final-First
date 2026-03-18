import { streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { UNIVERSAL_WISDOM_SYSTEM_PROMPT, SPREAD_BUILDER_ASSISTANT_PROMPT } from "@/lib/ai-wisdom-prompt";

export const maxDuration = 60;

// Use direct provider models (no Vercel Gateway).
// Default to Groq Llama 3.3 70B via GROQ_API_KEY.
const DEFAULT_MODEL_ID = "groq/llama-3.3-70b-versatile";
const VALID_MODEL_IDS = new Set([
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "openai/gpt-4-turbo",
  "anthropic/claude-sonnet-4-5",
  "anthropic/claude-sonnet-4.6",
  "anthropic/claude-3-5-sonnet-20241022",
  "anthropic/claude-3-haiku-20240307",
  "groq/llama-3.3-70b-versatile",
  "groq/mixtral-8x7b-32768",
]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawMessages = body?.messages as UIMessage[] | undefined;
    const modelId = body?.modelId as string | undefined;
    const readingContext = body?.readingContext as string | undefined;

    const resolvedModelId =
      modelId && VALID_MODEL_IDS.has(modelId) ? modelId : DEFAULT_MODEL_ID;

    // Map our string ids to concrete Groq models (only Groq is free/direct now)
    const model =
      resolvedModelId === "groq/llama-3.3-70b-versatile"
        ? groq("llama-3.3-70b-versatile")
        : groq("llama-3.3-70b-versatile");

    // Determine which system prompt to use based on context
    const isSpreadBuilder = readingContext?.includes("SPREAD_BUILDER_MODE");
    let systemMessage = isSpreadBuilder
      ? SPREAD_BUILDER_ASSISTANT_PROMPT
      : UNIVERSAL_WISDOM_SYSTEM_PROMPT;

    if (readingContext) {
      systemMessage += `\n\n${readingContext}`;
    }

    // For robustness, derive a single prompt from the latest user message
    let userText = "";
    if (Array.isArray(rawMessages) && rawMessages.length > 0) {
      const userMessages = rawMessages.filter((m) => m.role === "user");
      const lastUser = userMessages[userMessages.length - 1];
      if (lastUser && Array.isArray(lastUser.parts)) {
        userText = lastUser.parts
          .filter((p: any) => p?.type === "text" && typeof p.text === "string")
          .map((p: any) => p.text)
          .join("\n\n")
          .trim();
      }
    }

    if (!userText) {
      return Response.json(
        { error: "Invalid prompt: messages must not be empty." },
        { status: 400 }
      );
    }

    const prompt = `${systemMessage}\n\nUser question:\n${userText}`;

    const result = streamText({
      model,
      prompt,
      maxOutputTokens: 2500,
      temperature: 0.8,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Reading Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process request";
    const isAuthError = /api[_-]?key|unauthorized|401|403|GROQ_API_KEY/i.test(
      message,
    );
    return Response.json(
      {
        error: isAuthError
          ? "AI is not configured. Add AI_GATEWAY_API_KEY to your environment (or deploy on Vercel for automatic setup)."
          : message,
      },
      { status: 500 }
    );
  }
}
