import { CoreServiceConfig, updateRateLimitedAt } from "../api";
import { AuthorizationResult } from "../authorize/types";

import { RateLimitResult } from "./types";

const DEFAULT_RATE_LIMIT_WINDOW_SECONDS = 10;
const HARD_LIMIT_MULTIPLE = 2; // 2x of allowed limit

type CacheOptions = {
  get: (bucketId: string) => Promise<string | null>;
  put: (bucketId: string, count: string) => Promise<void> | void;
};

export async function rateLimit(
  authzResult: AuthorizationResult,
  serviceConfig: CoreServiceConfig,
  cacheOptions: CacheOptions,
): Promise<RateLimitResult> {
  if (!authzResult.authorized) {
    return {
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
      rateLimited: false,
    };
  }

  const limit = rateLimits[serviceScope] as number;

  // Floors the current time to the nearest DEFAULT_RATE_LIMIT_WINDOW_SECONDS.
  const bucketId =
    Math.floor(Date.now() / (1000 * DEFAULT_RATE_LIMIT_WINDOW_SECONDS)) *
    DEFAULT_RATE_LIMIT_WINDOW_SECONDS;
  const key = [serviceScope, accountId, bucketId].join(":");
  const value = parseInt((await cacheOptions.get(key)) || "0");
  const current = value + 1;

  // limit is in seconds, but we need in DEFAULT_RATE_LIMIT_WINDOW_SECONDS
  const limitWindow = limit * DEFAULT_RATE_LIMIT_WINDOW_SECONDS;

  if (current > limitWindow) {
    // report rate limit hits
    if (apiKeyMeta?.id) {
      await updateRateLimitedAt(apiKeyMeta.id, serviceConfig);
    }

    // actually rate limit only when reached hard limit
    if (current > limitWindow * HARD_LIMIT_MULTIPLE) {
      return {
        rateLimited: true,
        status: 429,
        errorMessage: `You've exceeded your ${serviceScope} rate limit at ${limit} reqs/sec. To get higher rate limits, contact us at https://thirdweb.com/contact-us.`,
        errorCode: "RATE_LIMIT_EXCEEDED",
      };
    }
  } else {
    await cacheOptions.put(key, current.toString());
  }

  return {
    rateLimited: false,
  };
}
