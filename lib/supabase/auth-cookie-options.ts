import type { CookieOptions } from "@supabase/ssr";

/** Keep browser + server auth cookies aligned (path / secure) for PKCE + session. */
export function getBrowserAuthCookieOptions(): CookieOptions {
  if (typeof window === "undefined") {
    return { path: "/", sameSite: "lax" };
  }
  const https = window.location.protocol === "https:";
  return {
    path: "/",
    sameSite: "lax",
    ...(https ? { secure: true } : {}),
  };
}

export function getServerAuthCookieOptions(): CookieOptions {
  const prod =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  return {
    path: "/",
    sameSite: "lax",
    ...(prod ? { secure: true } : {}),
  };
}
