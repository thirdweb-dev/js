import type { CoreServiceConfig, TeamResponse } from "../api.js";
import type { RateLimitResult } from "./types.js";

const RATE_LIMIT_WINDOW_SECONDS = 10;

// Redis interface compatible with ioredis (Node) and upstash (Cloudflare Workers).
type IRedis = {
  get: (key: string) => Promise<string | null>;
  expire(key: string, seconds: number): Promise<number>;
  incrBy(key: string, value: number): Promise<number>;
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
  /**
   * The number of requests to increment by.
   * @default 1
   */
  increment?: number;
}): Promise<RateLimitResult> {
  const {
    team,
    limitPerSecond,
    serviceConfig,
    redis,
    sampleRate = 1.0,
    increment = 1,
  } = args;

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

  // first read the request count from redis
  const requestCount = Number((await redis.get(key).catch(() => "0")) || "0");

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

  // do not await this, it just needs to execute at all
  (async () =>
    //  always incrementBy the amount specified for the key
    await redis.incrBy(key, increment).then(async () => {
      // if the initial request count was 0, set the key to expire in the future
      if (requestCount === 0) {
        await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
      }
    }))().catch(() => {
    console.error("Error incrementing rate limit key", key);
  });

  return {
    rateLimited: false,
    requestCount: requestCount + increment,
    rateLimit: limitPerWindow,
  };
}
