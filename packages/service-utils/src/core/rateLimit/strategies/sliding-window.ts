import type { CoreRateLimitResult, IRedis } from "./shared.js";

type RateLimitSlidingWindowOptions = {
  redis: IRedis;
  limitPerSecond: number;
  key: string;
  /**
   * The number of requests to increment by.
   * @default 1
   */
  increment?: number;
  /**
   * The number of seconds to look back for the sliding window.
   * @default 10
   */
  windowSeconds?: number;
};

export async function rateLimitSlidingWindow(
  options: RateLimitSlidingWindowOptions,
): Promise<CoreRateLimitResult> {
  const WINDOW_SIZE = options.windowSeconds || 10;
  const INCREMENT_BY = options.increment || 1;

  // No rate limit is provided. Assume the request is not rate limited.
  if (options.limitPerSecond <= 0) {
    return {
      rateLimit: 0,
      rateLimited: false,
      requestCount: INCREMENT_BY,
    };
  }

  // Enforce rate limit: sum the total requests in the last `SLIDING_WINDOW_SECONDS` seconds.
  const currentSecond = Math.floor(Date.now() / 1000);
  const keys = Array.from({ length: WINDOW_SIZE }, (_, i) =>
    getRequestCountAtSecondCacheKey(options.key, currentSecond - i),
  );
  const counts = await options.redis.mget(keys);
  const totalCount = counts.reduce(
    (sum, count) => sum + (count ? Number.parseInt(count) : 0),
    0,
  );

  const limitPerWindow = options.limitPerSecond * WINDOW_SIZE;

  if (totalCount > limitPerWindow) {
    return {
      rateLimit: limitPerWindow,
      rateLimited: true,
      requestCount: totalCount,
    };
  }

  // Non-blocking: increment the request count for the current second.
  (async () => {
    try {
      const incrKey = getRequestCountAtSecondCacheKey(
        options.key,
        currentSecond,
      );
      await options.redis.incrby(incrKey, INCREMENT_BY);
      // If this is the first time setting this key, expire it after the sliding window is past.
      if (counts[0] === null) {
        await options.redis.expire(incrKey, WINDOW_SIZE + 1);
      }
    } catch (error) {
      console.error("Error updating rate limit key:", error);
    }
  })();

  return {
    rateLimit: limitPerWindow,
    rateLimited: false,
    requestCount: totalCount + INCREMENT_BY,
  };
}

function getRequestCountAtSecondCacheKey(key: string, second: number) {
  return `${key}:s_${second}`;
}
