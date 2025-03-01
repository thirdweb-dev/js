import type { CoreServiceConfig, TeamResponse } from "../api.js";
import type { RateLimitResult } from "./types.js";

const RATE_LIMIT_WINDOW_SECONDS = 10;

// Redis interface compatible with ioredis (Node) and upstash (Cloudflare Workers).
type IRedis = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, ttlSeconds: number) => Promise<0 | 1>;
};

export async function rateLimit(args: {
  team: TeamResponse;
  limitPerSecond: number;
  serviceConfig: CoreServiceConfig;
  redis: IRedis;
  /**
   * Sample requests to reduce load on Redis.
   * This scales down the request count and the rate limit threshold.
   * @default 1.0
   */
  sampleRate?: number;
}): Promise<RateLimitResult> {
  const { team, limitPerSecond, serviceConfig, redis, sampleRate = 1.0 } = args;

  const shouldSampleRequest = Math.random() < sampleRate;
  if (!shouldSampleRequest) {
    return {
      rateLimited: false,
      requestCount: 0,
      rateLimit: 0,
    };
  }

  if (limitPerSecond === 0) {
    // No rate limit is provided. Assume the request is not rate limited.
    return {
      rateLimited: false,
      requestCount: 0,
      rateLimit: 0,
    };
  }

  const serviceScope = serviceConfig.serviceScope;

  // Gets the 10-second window for the current timestamp.
  const timestampWindow =
    Math.floor(Date.now() / (1000 * RATE_LIMIT_WINDOW_SECONDS)) *
    RATE_LIMIT_WINDOW_SECONDS;
  const key = `rate-limit:${serviceScope}:${team.id}:${timestampWindow}`;

  // Increment and get the current request count in this window.
  const requestCount = await redis.incr(key);
  if (requestCount === 1) {
    // For the first increment, set an expiration to clean up this key.
    await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
  }

  // Get the limit for this window accounting for the sample rate.
  const limitPerWindow =
    limitPerSecond * sampleRate * RATE_LIMIT_WINDOW_SECONDS;

  if (requestCount > limitPerWindow) {
    return {
      rateLimited: true,
      requestCount,
      rateLimit: limitPerWindow,
      status: 429,
      errorMessage: `You've exceeded your ${serviceScope} rate limit at ${limitPerSecond} reqs/sec. To get higher rate limits, contact us at https://thirdweb.com/contact-us.`,
      errorCode: "RATE_LIMIT_EXCEEDED",
    };
  }

  return {
    rateLimited: false,
    requestCount,
    rateLimit: limitPerWindow,
  };
}
