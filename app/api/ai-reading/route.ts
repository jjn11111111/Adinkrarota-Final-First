import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { UNIVERSAL_WISDOM_SYSTEM_PROMPT, SPREAD_BUILDER_ASSISTANT_PROMPT } from "@/lib/ai-wisdom-prompt";
import { GROQ_ENV_HINT } from "@/lib/ai-groq";
import { groqLanguageModel, isGroqConfigured } from "@/lib/ai-groq-server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    if (!isGroqConfigured()) {
      return Response.json(
        { error: `AI is not configured. ${GROQ_ENV_HINT}` },
        { status: 503 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawMessages = body?.messages as UIMessage[] | undefined;
    const modelId = body?.modelId as string | undefined;
    const readingContext = body?.readingContext as string | undefined;

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return Response.json(
        { error: "Invalid prompt: messages must not be empty." },
        { status: 400 },
      );
    }

    // Determine system prompt (reading / spread-builder context)
    const isSpreadBuilder = readingContext?.includes("SPREAD_BUILDER_MODE");
    let systemMessage = isSpreadBuilder
      ? SPREAD_BUILDER_ASSISTANT_PROMPT
      : UNIVERSAL_WISDOM_SYSTEM_PROMPT;

    if (readingContext) {
      systemMessage += `\n\n${readingContext}`;
    }

    const modelMessages = await convertToModelMessages(rawMessages);

    if (modelMessages.length === 0) {
      return Response.json(
        { error: "Invalid prompt: could not convert messages." },
        { status: 400 },
      );
    }

    const result = streamText({
      model: groqLanguageModel(modelId),
      system: systemMessage,
      messages: modelMessages,
      maxOutputTokens: 2500,
      temperature: 0.8,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Reading Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process request";
    const isAuthError = /api[_-]?key|unauthorized|401|403|GROQ|groq/i.test(
      message,
    );
    return Response.json(
      {
        error: isAuthError
          ? `AI is not configured. ${GROQ_ENV_HINT}`
          : message,
      },
      { status: 500 },
    );
  }
}
