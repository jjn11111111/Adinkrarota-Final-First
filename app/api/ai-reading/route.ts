import { convertToModelMessages, gateway, streamText, UIMessage } from "ai";
import { UNIVERSAL_WISDOM_SYSTEM_PROMPT, SPREAD_BUILDER_ASSISTANT_PROMPT } from "@/lib/ai-wisdom-prompt";

export const maxDuration = 60;

// Use Vercel AI Gateway model strings (creator/model format)
// Works on Vercel with OIDC; locally requires AI_GATEWAY_API_KEY in .env.local
const DEFAULT_MODEL_ID = "anthropic/claude-sonnet-4-5";
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
  "xai/grok-2-1212",
  "xai/grok-beta",
]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawMessages = body?.messages;
    const messages: UIMessage[] = Array.isArray(rawMessages) ? rawMessages : [];
    const modelId = body?.modelId;
    const readingContext = body?.readingContext;

    const resolvedModelId = modelId && VALID_MODEL_IDS.has(modelId)
      ? modelId
      : DEFAULT_MODEL_ID;
    const model = gateway(resolvedModelId);

    // Determine which system prompt to use based on context
    const isSpreadBuilder = readingContext?.includes("SPREAD_BUILDER_MODE");
    let systemMessage = isSpreadBuilder 
      ? SPREAD_BUILDER_ASSISTANT_PROMPT 
      : UNIVERSAL_WISDOM_SYSTEM_PROMPT;
    
    if (readingContext) {
      systemMessage += `\n\n${readingContext}`;
    }

    let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>;
    try {
      modelMessages = await convertToModelMessages(messages);
    } catch (convertErr) {
      console.error("AI Reading convertToModelMessages Error:", convertErr);
      return Response.json(
        { error: "Invalid message format. Please try again." },
        { status: 400 }
      );
    }
    const messagesForModel = Array.from(modelMessages ?? []);

    const result = streamText({
      model,
      system: systemMessage,
      messages: messagesForModel,
      maxOutputTokens: 2500,
      temperature: 0.8,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Reading Error:", error);
    const message = error instanceof Error ? error.message : "Failed to process request";
    const isAuthError = /api[_-]?key|unauthorized|401|403/i.test(message);
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
