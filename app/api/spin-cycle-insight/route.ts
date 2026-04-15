import { generateText } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  GROQ_ENV_HINT,
  GROQ_INVALID_KEY_HINT,
  isGroqInvalidApiKeyMessage,
} from "@/lib/ai-groq";
import { groqLanguageModel, isGroqConfigured } from "@/lib/ai-groq-server";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  modelId: z.string().optional(),
  cycleTitle: z.string().optional(),
  situation: z.string().min(1),
  fulfillmentPole: z.string().min(1),
  anxietyPole: z.string().min(1),
  natalProfile: z.string().optional(),
  numerologyProfile: z.string().optional(),
  transitContext: z.string().optional(),
  ephemerisBlock: z.string().optional(),
});

const SYSTEM = `You are ADINKRAROTA Spin Cycle Strategist.

Your task:
1) Identify the user's polarity ("spell"): the central tension between fulfillment and fear/cost.
2) Synthesize natal/numerology baseline with current transit weather.
3) Produce practical present-moment actions aligned with the highest desired outcome.

Output format (strict):
## Polarity Spell
2-4 sentences.

## Highest-Outcome Strategy
3-5 bullet points with concrete actions for this week.

## Neutral Node Reframe
2-3 sentences that integrate both poles without bypassing fear.

## 24-Hour Action
One specific action the user can do today.

Tone:
- grounded, clear, direct
- spiritually literate but not vague
- no fluff, no disclaimers, no greetings`;

export async function POST(req: Request) {
  try {
    if (!isGroqConfigured()) {
      return Response.json(
        { error: `AI is not configured. ${GROQ_ENV_HINT}` },
        { status: 503 },
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return Response.json({ error: "Authentication is not configured." }, { status: 503 });
    }
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Sign in required for Spin Cycle AI insight." }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .single();
    const accountType = profile?.account_type ?? user.user_metadata?.account_type;
    if (accountType !== "member") {
      return Response.json(
        { error: "Spin Cycle AI insight is available with Membership ($2.22)." },
        { status: 403 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          error:
            "Please provide situation, fulfillmentPole, and anxietyPole at minimum.",
        },
        { status: 400 },
      );
    }

    const {
      modelId,
      cycleTitle,
      situation,
      fulfillmentPole,
      anxietyPole,
      natalProfile,
      numerologyProfile,
      transitContext,
      ephemerisBlock,
    } = parsed.data;

    const prompt = [
      `Cycle title: ${cycleTitle || "Untitled"}`,
      `Situation: ${situation}`,
      `Fulfillment pole: ${fulfillmentPole}`,
      `Anxiety/cost pole: ${anxietyPole}`,
      `Natal profile: ${natalProfile || "(not provided)"}`,
      `Numerology profile: ${numerologyProfile || "(not provided)"}`,
      `Transit context: ${transitContext || "(not provided)"}`,
      `Ephemeris snapshot: ${ephemerisBlock || "(not provided)"}`,
    ].join("\n");

    const result = await generateText({
      model: groqLanguageModel(modelId),
      system: SYSTEM,
      prompt,
      maxOutputTokens: 700,
      temperature: 0.7,
      abortSignal: req.signal,
    });

    return Response.json({ insight: result.text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate spin insight";
    if (isGroqInvalidApiKeyMessage(message)) {
      return Response.json(
        { error: `Invalid Groq API key. ${GROQ_INVALID_KEY_HINT}` },
        { status: 401 },
      );
    }
    return Response.json({ error: message }, { status: 500 });
  }
}

