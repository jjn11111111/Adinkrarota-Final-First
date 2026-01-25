import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createXai } from "@ai-sdk/xai";
import { UNIVERSAL_WISDOM_SYSTEM_PROMPT, SPREAD_BUILDER_ASSISTANT_PROMPT } from "@/lib/ai-wisdom-prompt";

export const maxDuration = 60;

function createProviderModel(
  providerId: string,
  modelId: string,
  apiKey: string
) {
  switch (providerId) {
    case "openai": {
      const openai = createOpenAI({ apiKey });
      return openai(modelId.replace("openai/", ""));
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey });
      return anthropic(modelId.replace("anthropic/", ""));
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey });
      return google(modelId.replace("google/", ""));
    }
    case "groq": {
      const groq = createGroq({ apiKey });
      return groq(modelId.replace("groq/", ""));
    }
    case "xai": {
      const xai = createXai({ apiKey });
      return xai(modelId.replace("xai/", ""));
    }
    default:
      throw new Error(`Unsupported provider: ${providerId}`);
  }
}

// Server-side API keys for free providers
const SERVER_API_KEYS: Record<string, string | undefined> = {
  groq: process.env.GROQ_API_KEY,
  xai: process.env.XAI_API_KEY,
};

export async function POST(req: Request) {
  try {
    const {
      messages,
      providerId,
      modelId,
      apiKey,
      readingContext,
    }: {
      messages: UIMessage[];
      providerId: string;
      modelId: string;
      apiKey?: string;
      readingContext?: string;
    } = await req.json();

    // Use server API key for free providers, otherwise require user's key
    const effectiveApiKey = apiKey || SERVER_API_KEYS[providerId];

    if (!effectiveApiKey) {
      return Response.json(
        { error: "API key is required for this provider" },
        { status: 400 }
      );
    }

    const model = createProviderModel(providerId, modelId, effectiveApiKey);

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
      messages: convertToModelMessages(messages),
      maxOutputTokens: 2000,
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
