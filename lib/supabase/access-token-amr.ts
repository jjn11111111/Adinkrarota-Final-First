/**
 * Read Supabase access token AMR without verifying the signature.
 * Safe for routing only; the token was just issued by exchangeCodeForSession.
 * Works in the browser and on the server (no Buffer required in browser).
 * @see https://supabase.com/docs/guides/auth/jwt-fields
 */
function decodeJwtPayloadJson(accessToken: string): string | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf8");
    }
    return atob(base64);
  } catch {
    return null;
  }
}

export function accessTokenHasAmrMethod(
  accessToken: string,
  method: string
): boolean {
  try {
    const json = decodeJwtPayloadJson(accessToken);
    if (!json) return false;
    const payload = JSON.parse(json) as {
      amr?: Array<string | { method?: string }>;
    };
    const amr = payload.amr;
    if (!Array.isArray(amr)) return false;
    return amr.some((entry) => {
      if (entry === method) return true;
      if (
        typeof entry === "object" &&
        entry !== null &&
        entry.method === method
      ) {
        return true;
      }
      return false;
    });
  } catch {
    return false;
  }
}
