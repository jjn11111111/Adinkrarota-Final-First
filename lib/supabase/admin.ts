import { getPublicSupabaseConfig } from "@/lib/supabase/env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseAdmin(): SupabaseClient | null {
  const cfg = getPublicSupabaseConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!cfg || !key) return null;
  try {
    return createClient(cfg.url, key);
  } catch {
    return null;
  }
}
