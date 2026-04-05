// User-facing messages when a service is unavailable (e.g. not configured).
// Avoid "configure X" so end users aren't confused—they can't configure it.
export const AUTH_UNAVAILABLE_MESSAGE =
  "Sign-in and registration are temporarily unavailable. Please try again later.";

/** Shown under AUTH_UNAVAILABLE when deployer may be viewing the site */
export const AUTH_UNAVAILABLE_DEPLOYER_HINT =
  "If you deployed this app: in Vercel → Environment Variables, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for Production, then redeploy.";

export const PAYMENT_UNAVAILABLE_MESSAGE =
  "Payment processing is temporarily unavailable. Please try again later.";
