import type { CoreServiceConfig, TeamResponse } from "../api.js";
import type { IRedis } from "./strategies/shared.js";
import { rateLimitSlidingWindow } from "./strategies/sliding-window.js";
import type { RateLimitResult } from "./types.js";

const SLIDING_WINDOW_SECONDS = 10;

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

  const rateLimitResult = await rateLimitSlidingWindow({
    increment,
    key: `rate-limit:${serviceScope}:${team.id}`,
    limitPerSecond,
    redis,
    windowSeconds: SLIDING_WINDOW_SECONDS,
  });

  // if the request is rate limited, return the rate limit result.
  if (rateLimitResult.rateLimited) {
    return {
      errorCode: "RATE_LIMIT_EXCEEDED",
      errorMessage: `You've exceeded your ${serviceScope} rate limit at ${limitPerSecond} requests per second. Please upgrade your plan to increase your limits: https://thirdweb.com/team/${team.slug}/~/settings/billing`,
      rateLimit: rateLimitResult.rateLimit,
      rateLimited: true,
      requestCount: rateLimitResult.requestCount,
      status: 429,
    };
  }
  // otherwise, the request is not rate limited.
  return {
    rateLimit: rateLimitResult.rateLimit,
    rateLimited: false,
    requestCount: rateLimitResult.requestCount,
  };
}
