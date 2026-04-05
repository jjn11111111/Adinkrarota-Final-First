/**
 * Read Supabase access token AMR without verifying the signature.
 * Safe for routing only; the token was just issued by exchangeCodeForSession.
 * @see https://supabase.com/docs/guides/auth/jwt-fields
 */
export function accessTokenHasAmrMethod(
  accessToken: string,
  method: string
): boolean {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return false;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(padded, "base64").toString("utf8");
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
