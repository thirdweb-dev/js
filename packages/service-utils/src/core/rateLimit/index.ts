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
    redis,
    limitPerSecond,
    key: `rate-limit:${serviceScope}:${team.id}`,
    increment,
    windowSeconds: SLIDING_WINDOW_SECONDS,
  });

  // if the request is rate limited, return the rate limit result.
  if (rateLimitResult.rateLimited) {
    return {
      rateLimited: true,
      requestCount: rateLimitResult.requestCount,
      rateLimit: rateLimitResult.rateLimit,
      status: 429,
      errorMessage: `You've exceeded your ${serviceScope} rate limit at ${limitPerSecond} requests per second. Please upgrade your plan to increase your limits: https://thirdweb.com/team/${team.slug}/~/settings/billing`,
      errorCode: "RATE_LIMIT_EXCEEDED",
    };
  }
  // otherwise, the request is not rate limited.
  return {
    rateLimited: false,
    requestCount: rateLimitResult.requestCount,
    rateLimit: rateLimitResult.rateLimit,
  };
}
