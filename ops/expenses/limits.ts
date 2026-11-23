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

// At most 10 failed logins per 15 minutes across all clients.
export const loginFailures = new SlidingWindow(10, 15 * 60_000);
