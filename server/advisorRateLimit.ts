export const ADVISOR_RATE_LIMIT = 30;
export const ADVISOR_RATE_WINDOW_MS = 60 * 60 * 1000;

export type AdvisorRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

/**
 * Limitation volontairement en mémoire : elle est perdue au redémarrage et n'est
 * pas partagée entre instances. Une solution distribuée sera requise en multi-instance.
 */
export class AdvisorRateLimiter {
  private readonly requestsByIp = new Map<string, number[]>();

  consume(ipAddress: string, now = Date.now()): AdvisorRateLimitResult {
    const earliestAllowed = now - ADVISOR_RATE_WINDOW_MS;
    const recent = (this.requestsByIp.get(ipAddress) ?? []).filter((timestamp) => timestamp > earliestAllowed);
    if (recent.length >= ADVISOR_RATE_LIMIT) {
      this.requestsByIp.set(ipAddress, recent);
      const retryAt = recent[0] + ADVISOR_RATE_WINDOW_MS;
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((retryAt - now) / 1000)) };
    }

    recent.push(now);
    this.requestsByIp.set(ipAddress, recent);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

export const advisorRateLimiter = new AdvisorRateLimiter();
