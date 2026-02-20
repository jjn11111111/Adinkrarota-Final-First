import { convertToModelMessages, streamText, UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { xai } from "@ai-sdk/xai";
import { UNIVERSAL_WISDOM_SYSTEM_PROMPT, SPREAD_BUILDER_ASSISTANT_PROMPT } from "@/lib/ai-wisdom-prompt";

export const maxDuration = 60;

// Default model for Vercel AI Gateway (zero config)
const DEFAULT_MODEL = "anthropic/claude-sonnet-4-20250514";

// Model mapping for Vercel AI Gateway format
const MODEL_MAP: Record<string, string> = {
  // OpenAI
  "openai/gpt-4o": "openai/gpt-4o",
  "openai/gpt-4o-mini": "openai/gpt-4o-mini",
  "openai/gpt-4-turbo": "openai/gpt-4-turbo",
  // Anthropic
  "anthropic/claude-sonnet-4-5": "anthropic/claude-sonnet-4-20250514",
  "anthropic/claude-3-5-sonnet-20241022": "anthropic/claude-3-5-sonnet-20241022",
  "anthropic/claude-3-haiku-20240307": "anthropic/claude-3-haiku-20240307",
  // Groq (via gateway)
  "groq/llama-3.3-70b-versatile": "groq/llama-3.3-70b-versatile",
  "groq/mixtral-8x7b-32768": "groq/mixtral-8x7b-32768",
  // xAI (via gateway)
  "xai/grok-2-1212": "xai/grok-2-1212",
  "xai/grok-beta": "xai/grok-beta",
};

export async function POST(req: Request) {
  try {
    const {
      messages,
      modelId,
      readingContext,
    }: {
      messages: UIMessage[];
      modelId?: string;
      readingContext?: string;
    } = await req.json();

    // Use Vercel AI Gateway - resolve model ID or use default
    const model = modelId ? (MODEL_MAP[modelId] || modelId) : DEFAULT_MODEL;

    // Determine which system prompt to use based on context
    const isSpreadBuilder = readingContext?.includes("SPREAD_BUILDER_MODE");
    let systemMessage = isSpreadBuilder 
      ? SPREAD_BUILDER_ASSISTANT_PROMPT 
      : UNIVERSAL_WISDOM_SYSTEM_PROMPT;
    
    if (readingContext) {
      systemMessage += `\n\n${readingContext}`;
    }

    const result = streamText({
      model,
      system: systemMessage,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 2500,
      temperature: 0.8,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Reading Error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
