// User-facing messages when a service is unavailable (e.g. not configured).
// Avoid "configure X" so end users aren't confused—they can't configure it.
export const AUTH_UNAVAILABLE_MESSAGE =
  "Sign-in and registration are temporarily unavailable. Please try again later.";

/**
 * Shown under AUTH_UNAVAILABLE when the deployer may be viewing the site.
 *
 * Two different env vars confuse people:
 * - NEXT_PUBLIC_SUPABASE_* → required to talk to Supabase (missing = this banner).
 * - NEXT_PUBLIC_BASE_URL → optional; your own site's URL for redirects; does NOT replace Supabase.
 */
export const AUTH_UNAVAILABLE_DEPLOYER_HINT = [
  "DEPLOYER — The app cannot reach Supabase until BOTH variables below exist in Vercel → Settings → Environment Variables. Enable them for Production (and Preview if you use *.vercel.app previews). Then redeploy — Next.js only bakes these in at build time.",
  "",
  "Required (without these, auth stays broken):",
  "  • NEXT_PUBLIC_SUPABASE_URL — Supabase → Project Settings → API → Project URL (ends with .supabase.co — that is .co, not .com).",
  "  • NEXT_PUBLIC_SUPABASE_ANON_KEY — same API page → anon / public key.",
  "",
  "Different variable (optional): NEXT_PUBLIC_BASE_URL is your live site URL for redirects. It does not substitute for the two Supabase variables above.",
].join("\n");

export const PAYMENT_UNAVAILABLE_MESSAGE =
  "Payment processing is temporarily unavailable. Please try again later.";
