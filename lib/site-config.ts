// Central site configuration
// The NEXT_PUBLIC_BASE_URL env var takes priority, then VERCEL_URL, then the hardcoded production URL
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use env var or current origin
    return (
      process.env.NEXT_PUBLIC_BASE_URL ||
      window.location.origin
    );
  }

  // Server-side
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Hardcoded production fallback
  return "https://v0-conversation-context-review-5m3rqt7tl-re-connect0.vercel.app";
}
