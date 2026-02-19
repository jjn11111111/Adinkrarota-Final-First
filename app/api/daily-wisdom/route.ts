import { generateText } from "ai";
import { drawCardsWithPolarity } from "@/lib/card-data";
import { getGuidebookEntry } from "@/lib/guidebook-data";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const DAILY_WISDOM_PROMPT = `You are a wisdom keeper for the Adinkrarota Tarot system—a fusion of West African Adinkra symbolism and traditional Tarot archetypes.

Generate a brief, inspiring daily wisdom message based on the card drawn. The message should:
1. Be 2-3 sentences maximum
2. Weave the Adinkra symbol meaning with the Tarot wisdom
3. Be uplifting and actionable for the day ahead
4. Avoid being preachy or overly mystical
5. Feel personal and grounded

Do NOT include any greeting, signature, or card name in your response. Just the wisdom message itself.`;

export async function POST(req: Request) {
  try {
    // Auth check - prevent unauthorized AI usage
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    // Draw a single card for the day
    const [drawnCard] = drawCardsWithPolarity(1);
    const guidebook = getGuidebookEntry(drawnCard.id);
    
    const cardContext = `
Card: ${drawnCard.name}
Polarity: ${drawnCard.polarity === "reversed" ? "Shadow (Reversed)" : "Light (Upright)"}
Adinkra Symbol: ${drawnCard.adinkraSymbol}
Adinkra Meaning: ${drawnCard.adinkraMeaning}
Keywords: ${drawnCard.polarityKeywords.join(", ")}
Fused Interpretation: ${drawnCard.fusedInterpretation}
${guidebook?.fullDescription ? `Full Description: ${guidebook.fullDescription}` : ""}
`;

    const result = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      system: DAILY_WISDOM_PROMPT,
      prompt: cardContext,
      maxOutputTokens: 200,
      temperature: 0.9,
      abortSignal: req.signal,
    });

    return Response.json({
      card: {
        id: drawnCard.id,
        name: drawnCard.name,
        image: drawnCard.image,
        polarity: drawnCard.polarity,
        adinkraSymbol: drawnCard.adinkraSymbol,
        polarityKeywords: drawnCard.polarityKeywords,
      },
      wisdom: result.text,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Daily Wisdom Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate wisdom" },
      { status: 500 }
    );
  }
}
