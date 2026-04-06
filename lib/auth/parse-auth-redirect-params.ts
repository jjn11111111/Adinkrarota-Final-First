/**
 * Query + hash fragment (Supabase implicit / magic links). Search params win over hash.
 * Mirrors @supabase/auth-js parseParametersFromURL (avoid deep package import).
 */
export function parseAuthRedirectParams(href: string): Record<string, string> {
  const result: Record<string, string> = {};
  const url = new URL(href);

  if (url.hash?.startsWith("#")) {
    try {
      new URLSearchParams(url.hash.slice(1)).forEach((value, key) => {
        result[key] = value;
      });
    } catch {
      /* ignore malformed hash */
    }
  }

  url.searchParams.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}
