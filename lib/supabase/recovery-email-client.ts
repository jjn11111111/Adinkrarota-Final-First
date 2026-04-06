import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "@/lib/supabase/env";

/**
 * Password reset only. @supabase/ssr createBrowserClient always sets flowType PKCE,
 * which stores a code verifier cookie — fragile across devices and email clients.
 * Implicit recover omits code_challenge so the email link carries tokens (typically
 * in the URL hash) instead of ?code= PKCE.
 */
export function createImplicitRecoveryClient() {
  const cfg = getPublicSupabaseConfig();
  if (!cfg) return null;

  try {
    return createClient(cfg.url, cfg.anonKey, {
      auth: {
        flowType: "implicit",
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  } catch {
    return null;
  }
}
