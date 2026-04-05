import { NextResponse } from "next/server";
import { getServerSupabaseConfig } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/**
 * Exposes anon URL + key to the browser when only server-named env vars exist.
 * Same security model as NEXT_PUBLIC_* (anon key is public; RLS enforces access).
 */
export async function GET() {
  const cfg = getServerSupabaseConfig();
  if (!cfg) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  return NextResponse.json(
    { url: cfg.url, anonKey: cfg.anonKey },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
