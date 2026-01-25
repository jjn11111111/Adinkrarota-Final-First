import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { readingId, interpretation } = await req.json();

    if (!readingId || !interpretation) {
      return Response.json(
        { error: "Reading ID and interpretation are required" },
        { status: 400 }
      );
    }

    // Update the reading with AI interpretation
    const { error: updateError } = await supabase
      .from("readings")
      .update({ ai_interpretation: interpretation })
      .eq("id", readingId)
      .eq("user_id", user.id); // Ensure user owns this reading

    if (updateError) {
      console.error("Save interpretation error:", updateError);
      return Response.json(
        { error: "Failed to save interpretation" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Save interpretation error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 }
    );
  }
}
