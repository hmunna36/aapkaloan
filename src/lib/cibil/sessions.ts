import { CibilError } from "./types";

// Best-effort abuse limiting.
//
// Held on globalThis so every route bundle in the same process shares it (a
// plain module-level Map is duplicated per route bundle). On serverless each
// instance still counts separately, so for strict limits in production back
// this with Redis (Upstash) or your database — only this file changes.

const store: Map<string, number[]> = ((globalThis as Record<string, unknown>).__aklRateLimit as Map<string, number[]>) ?? new Map();
(globalThis as Record<string, unknown>).__aklRateLimit = store;

/** Throws once `limit` requests have been made against `key` within the window. */
export function rateLimit(key: string, limit: number, windowMs: number, message: string) {
  const now = Date.now();
  for (const [k, times] of store) {
    const recent = times.filter((t) => now - t < 60 * 60 * 1000);
    if (recent.length) store.set(k, recent);
    else store.delete(k);
  }
  const times = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= limit) throw new CibilError(message, "rate_limited", 429);
  times.push(now);
  store.set(key, times);
}
