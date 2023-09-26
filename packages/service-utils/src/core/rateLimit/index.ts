import { CoreServiceConfig, updateRateLimitedAt } from "../api";
import { AuthorizationResult } from "../authorize/types";

import { RateLimitResult } from "./types";

const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 10;
const HARD_LIMIT_MULTIPLE = 2; // 2x of allowed limit

type IRedis = {
  incr: (key: string) => Promise<number>;
};

export async function rateLimit(
  authzResult: AuthorizationResult,
  serviceConfig: CoreServiceConfig,
  redis: IRedis,
  /**
   * Sample 10% of requests by default to reduce load on Redis.
   * This scales down the request count and the rate limit threshold.
   */
  sampleRate = 0.1,
): Promise<RateLimitResult> {
  const shouldCountRequest = Math.random() < sampleRate;
  if (!shouldCountRequest || !authzResult.authorized) {
    return {
      requestCount: 0,
      rateLimited: false,
    };
  }

  const { apiKeyMeta, accountMeta } = authzResult;
  const { rateLimits } = apiKeyMeta || accountMeta || {};
  const accountId = apiKeyMeta?.accountId || accountMeta?.id;
  const { serviceScope } = serviceConfig;

  if (!rateLimits || !(serviceScope in rateLimits)) {
    // No rate limit is provided. Assume the request is not rate limited.
    return {
      requestCount: 0,
      rateLimited: false,
    };
  }

  // Floors the current time to the nearest DEFAULT_RATE_LIMIT_WINDOW_SECONDS.
  const timestampWindow =
    Math.floor(Date.now() / (1000 * DEFAULT_RATE_LIMIT_WINDOW_SECONDS)) *
    DEFAULT_RATE_LIMIT_WINDOW_SECONDS;
  const key = `rate-limit:${serviceScope}:${accountId}:${timestampWindow}`;

  // Increment the request count in the current window and get the current request count.
  const requestCount = await redis.incr(key);

  // limit is in seconds, but we need in DEFAULT_RATE_LIMIT_WINDOW_SECONDS
  const limitPerSecond = rateLimits[serviceScope] as number;
  const limitPerWindow =
    limitPerSecond * sampleRate * DEFAULT_RATE_LIMIT_WINDOW_SECONDS;
  if (requestCount > limitPerWindow) {
    // Report rate limit hits.
    if (apiKeyMeta?.id) {
      await updateRateLimitedAt(apiKeyMeta.id, serviceConfig);
    }

    // Actually rate limit only when reached hard limit.
    if (requestCount > limitPerWindow * HARD_LIMIT_MULTIPLE) {
      return {
        requestCount,
        rateLimited: true,
        status: 429,
        errorMessage: `You've exceeded your ${serviceScope} rate limit at ${limitPerSecond} reqs/sec. To get higher rate limits, contact us at https://thirdweb.com/contact-us.`,
        errorCode: "RATE_LIMIT_EXCEEDED",
      };
    }
  }

  return {
    requestCount,
    rateLimited: false,
  };
}
