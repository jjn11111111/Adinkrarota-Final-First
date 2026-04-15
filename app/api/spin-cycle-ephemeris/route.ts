import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  computePlanetRows,
  computeCrossAspects,
  formatAspectBlock,
  formatEphemerisBlock,
} from "@/lib/spin-cycle-ephemeris";

export const runtime = "nodejs";

const bodySchema = z.object({
  transitIso: z.string().min(1),
  birthIso: z.string().optional(),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Sign in required for Spin Cycle ephemeris." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", user.id)
    .single();
  const accountType = profile?.account_type ?? user.user_metadata?.account_type;
  if (accountType !== "member") {
    return NextResponse.json(
      { error: "Spin Cycle interactive ephemeris is available with Membership ($2.22)." },
      { status: 403 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "transitIso required (ISO 8601); birthIso optional" },
      { status: 400 },
    );
  }

  const transitDate = new Date(parsed.data.transitIso);
  if (Number.isNaN(transitDate.getTime())) {
    return NextResponse.json({ error: "transitIso is not a valid date" }, { status: 400 });
  }

  const transitRows = computePlanetRows(transitDate);
  const transitText = formatEphemerisBlock("Transit sky", transitDate, transitRows);

  let birthText: string | undefined;
  let birthRows: ReturnType<typeof computePlanetRows> | undefined;
  let aspectText: string | undefined;
  if (parsed.data.birthIso) {
    const birthDate = new Date(parsed.data.birthIso);
    if (Number.isNaN(birthDate.getTime())) {
      return NextResponse.json({ error: "birthIso is not a valid date" }, { status: 400 });
    }
    birthRows = computePlanetRows(birthDate);
    birthText = formatEphemerisBlock("Natal sky (same longitudes as birth moment)", birthDate, birthRows);
    const aspects = computeCrossAspects(transitRows, birthRows);
    aspectText = formatAspectBlock("Transit-to-natal major aspects", aspects);
  }

  return NextResponse.json({
    source: "astronomy-engine",
    licenseNote: "MIT Astronomy Engine — tropical geocentric longitudes; educational / synoptic use.",
    transit: { iso: transitDate.toISOString(), rows: transitRows, text: transitText },
    birth:
      birthRows && birthText
        ? { iso: new Date(parsed.data.birthIso!).toISOString(), rows: birthRows, text: birthText }
        : null,
    aspects: aspectText ? { text: aspectText } : null,
    /** Ready to paste into Spin Cycle notes */
    combinedText: birthText
      ? `${transitText}\n\n${birthText}${aspectText ? `\n\n${aspectText}` : ""}`
      : transitText,
  });
}
