// Central site configuration
// The NEXT_PUBLIC_BASE_URL env var takes priority, then VERCEL_URL, then the hardcoded production URL

/**
 * Parses NEXT_PUBLIC_BASE_URL into a valid origin. Vercel values like
 * `www.example.com` (no scheme) are normalized to `https://www.example.com`.
 */
export function getConfiguredSiteOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!raw) return null;
  const withScheme = raw.includes("://") ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client: never use NEXT_PUBLIC_BASE_URL if it points at another host than this tab.
    // Preview deploys change hostname every time; a stale BASE_URL breaks auth redirects.
    const current = window.location.origin;
    const envRaw = process.env.NEXT_PUBLIC_BASE_URL?.trim();
    if (envRaw) {
      try {
        const envUrl = new URL(
          envRaw.includes("://") ? envRaw : `https://${envRaw}`
        );
        if (envUrl.origin === current) {
          return envUrl.origin;
        }
      } catch {
        /* use current */
      }
    }
    return current;
  }

  // Server-side
  const configured = getConfiguredSiteOrigin();
  if (configured) {
    return configured;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Hardcoded production fallback
  return "https://v0-conversation-context-review.vercel.app";
}
