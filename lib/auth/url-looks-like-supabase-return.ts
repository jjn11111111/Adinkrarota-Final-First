/**
 * True when the URL carries Supabase auth tokens or errors (query and/or hash).
 * Used so one layout-level redirect can send any stray landing URL to /auth/callback.
 */
export function urlLooksLikeSupabaseAuthReturn(
  search: string,
  hash: string,
): boolean {
  const q = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  if (
    q.get("code") ||
    q.get("token_hash") ||
    q.get("type") ||
    q.get("error") ||
    q.get("error_description")
  ) {
    return true;
  }

  if (!hash.startsWith("#")) return false;
  try {
    const h = new URLSearchParams(hash.slice(1));
    return !!(
      (h.get("access_token") && h.get("refresh_token")) ||
      h.get("code") ||
      (h.get("token_hash") && h.get("type")) ||
      h.get("error") ||
      h.get("error_description")
    );
  } catch {
    return false;
  }
}
