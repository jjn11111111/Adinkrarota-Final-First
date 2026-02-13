// Simple in-memory rate limiter for API routes
// Resets on deploy/restart -- sufficient for basic abuse prevention

const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  identifier: string,
  { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = requests.get(identifier);

  // Clean up expired entries periodically
  if (requests.size > 10_000) {
    for (const [key, val] of requests) {
      if (val.resetAt < now) requests.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    requests.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: maxRequests - record.count };
}
