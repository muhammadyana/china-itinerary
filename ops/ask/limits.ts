// Global in-memory limits. Cloudflare hides client IPs and the origin IP is public, so per-IP limits
// would be spoofable; one shared budget per process is the honest guard. Counters reset on restart.

export class SlidingWindow {
  private readonly hits: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  private prune(now: number): void {
    while (this.hits.length && this.hits[0] <= now - this.windowMs) this.hits.shift();
  }

  /** Seconds until one more hit fits; 0 when it fits now. */
  retryAfter(now = Date.now()): number {
    this.prune(now);
    if (this.hits.length < this.limit) return 0;
    return Math.max(1, Math.ceil((this.hits[0] + this.windowMs - now) / 1000));
  }

  add(now = Date.now()): number {
    this.hits.push(now);
    return now;
  }

  remove(hit: number): void {
    const index = this.hits.indexOf(hit);
    if (index >= 0) this.hits.splice(index, 1);
  }
}

const MINUTE = 60_000;

// At most 10 failed logins per 15 minutes across all clients.
export const loginFailures = new SlidingWindow(10, 15 * MINUTE);

// Cost guard: 30 chats per 10 minutes and 300 per rolling 24 hours.
const chatBurst = new SlidingWindow(30, 10 * MINUTE);
const chatDaily = new SlidingWindow(300, 24 * 60 * MINUTE);

/** Records a chat request and returns 0, or returns the Retry-After seconds without recording it. */
export function takeChatSlot(now = Date.now()): number {
  const wait = Math.max(chatBurst.retryAfter(now), chatDaily.retryAfter(now));
  if (wait) return wait;
  chatBurst.add(now);
  chatDaily.add(now);
  return 0;
}
