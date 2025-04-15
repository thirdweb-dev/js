import type { CoreServiceConfig, TeamResponse } from "../api.js";
import type { RateLimitResult } from "./types.js";

const SLIDING_WINDOW_SECONDS = 10;

// Redis interface compatible with ioredis (Node) and upstash (Cloudflare Workers).
type IRedis = {
  incrby(key: string, value: number): Promise<number>;
  mget(keys: string[]): Promise<(string | null)[]>;
  expire(key: string, seconds: number): Promise<number>;
};

/**
 * Increments the request count for this team and returns whether the team has hit their rate limit.
 * Uses a sliding 10 second window.
 * @param args
 * @returns
 */
export async function rateLimit(args: {
  team: TeamResponse;
  limitPerSecond: number;
  serviceConfig: CoreServiceConfig;
  redis: IRedis;
  /**
   * The number of requests to increment by.
   * @default 1
   */
  increment?: number;
}): Promise<RateLimitResult> {
  const { team, limitPerSecond, serviceConfig, redis, increment = 1 } = args;
  const { serviceScope } = serviceConfig;

  if (limitPerSecond === 0) {
    // No rate limit is provided. Assume the request is not rate limited.
    return {
      rateLimited: false,
      requestCount: 0,
      rateLimit: 0,
    };
  }

  // Enforce rate limit: sum the total requests in the last `SLIDING_WINDOW_SECONDS` seconds.
  const currentSecond = Math.floor(Date.now() / 1000);
  const keys = Array.from({ length: SLIDING_WINDOW_SECONDS }, (_, i) =>
    getRequestCountAtSecondCacheKey(serviceScope, team.id, currentSecond - i),
  );
  const counts = await redis.mget(keys);
  const totalCount = counts.reduce(
    (sum, count) => sum + (count ? Number.parseInt(count) : 0),
    0,
  );

  const limitPerWindow = limitPerSecond * SLIDING_WINDOW_SECONDS;

  if (totalCount > limitPerWindow) {
    return {
      rateLimited: true,
      requestCount: totalCount,
      rateLimit: limitPerWindow,
      status: 429,
      errorMessage: `You've exceeded your ${serviceScope} rate limit at ${limitPerSecond} reqs/sec. Please upgrade your plan to get higher rate limits.`,
      errorCode: "RATE_LIMIT_EXCEEDED",
    };
  }

  // Non-blocking: increment the request count for the current second.
  (async () => {
    try {
      const key = getRequestCountAtSecondCacheKey(
        serviceScope,
        team.id,
        currentSecond,
      );
      await redis.incrby(key, increment);
      // If this is the first time setting this key, expire it after the sliding window is past.
      if (counts[0] === null) {
        await redis.expire(key, SLIDING_WINDOW_SECONDS + 1);
      }
    } catch (error) {
      console.error("Error updating rate limit key:", error);
    }
  })();

  return {
    rateLimited: false,
    requestCount: totalCount + increment,
    rateLimit: limitPerWindow,
  };
}

function getRequestCountAtSecondCacheKey(
  serviceScope: CoreServiceConfig["serviceScope"],
  teamId: string,
  second: number,
) {
  return `rate-limit:${serviceScope}:${teamId}:${second}`;
}
