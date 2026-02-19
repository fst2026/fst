import { incrementRateLimit } from "@/lib/db";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function checkRateLimitMemory(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true, remaining: limit - existing.count };
}

export async function checkRateLimit(key: string, limit: number, windowMs: number) {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;

  try {
    const count = await incrementRateLimit(key, windowStart);
    if (count > limit) return { ok: false, remaining: 0 };
    return { ok: true, remaining: Math.max(limit - count, 0) };
  } catch {
    return checkRateLimitMemory(key, limit, windowMs);
  }
}
