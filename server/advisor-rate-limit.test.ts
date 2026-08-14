import { describe, expect, it } from "vitest";
import { ADVISOR_RATE_LIMIT, ADVISOR_RATE_WINDOW_MS, AdvisorRateLimiter } from "./advisorRateLimit";

describe("AdvisorRateLimiter", () => {
  it("limits one IP to 30 requests per rolling hour", () => {
    const limiter = new AdvisorRateLimiter();
    const now = 1_000_000;

    for (let index = 0; index < ADVISOR_RATE_LIMIT; index += 1) {
      expect(limiter.consume("203.0.113.10", now + index).allowed).toBe(true);
    }

    const blocked = limiter.consume("203.0.113.10", now + ADVISOR_RATE_LIMIT);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("allows a new call when the rolling window has expired", () => {
    const limiter = new AdvisorRateLimiter();
    const now = 2_000_000;
    for (let index = 0; index < ADVISOR_RATE_LIMIT; index += 1) {
      limiter.consume("203.0.113.20", now + index);
    }

    expect(limiter.consume("203.0.113.20", now + ADVISOR_RATE_WINDOW_MS + 1).allowed).toBe(true);
  });
});
