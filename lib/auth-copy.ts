// User-facing messages when a service is unavailable (e.g. not configured).
// Avoid "configure X" so end users aren't confused—they can't configure it.
export const AUTH_UNAVAILABLE_MESSAGE =
  "Sign-in and registration are temporarily unavailable. Please try again later.";

/** Shown under AUTH_UNAVAILABLE when deployer may be viewing the site */
export const AUTH_UNAVAILABLE_DEPLOYER_HINT =
  "If you deployed this app: in Vercel → Environment Variables, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for each environment you use (Production and Preview — preview URLs need Preview checked), then redeploy.";

export const PAYMENT_UNAVAILABLE_MESSAGE =
  "Payment processing is temporarily unavailable. Please try again later.";

/** Shown when resetPasswordForEmail fails (often redirect URL or SMTP) */
export const PASSWORD_RESET_DEPLOYER_HINT =
  "If you manage this app: In Supabase → Authentication → URL Configuration, add Redirect URL https://YOUR_DOMAIN/auth/callback (wildcard https://YOUR_DOMAIN/** is fine). Set Site URL to your live app URL. If you use custom SMTP, check for send failures there too.";
