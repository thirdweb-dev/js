import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validServiceConfig, validTeamResponse } from "../../mocks.js";
import { rateLimit } from "./index.js";

const mockRedis = {
  incr: vi.fn(),
  expire: vi.fn(),
};

describe("rateLimit", () => {
  beforeEach(() => {
    // Clear mock function calls and reset any necessary state.
    vi.clearAllMocks();
    mockRedis.incr.mockReset();
    mockRedis.expire.mockReset();
  });

  afterEach(() => {
    vi.spyOn(global.Math, "random").mockRestore();
  });

  it("should not rate limit if service scope is not in rate limits", async () => {
    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 0,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 0,
      rateLimit: 0,
    });
  });

  it("should not rate limit if within limit", async () => {
    mockRedis.incr.mockResolvedValue(50); // Current count is 50 requests in 10 seconds.

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 50,
      rateLimit: 50,
    });

    expect(mockRedis.expire).not.toHaveBeenCalled();
  });

  it("should rate limit if exceeded hard limit", async () => {
    mockRedis.incr.mockResolvedValue(51);

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: true,
      requestCount: 51,
      rateLimit: 50,
      status: 429,
      errorMessage: `You've exceeded your storage rate limit at 5 reqs/sec. To get higher rate limits, contact us at https://thirdweb.com/contact-us.`,
      errorCode: "RATE_LIMIT_EXCEEDED",
    });

    expect(mockRedis.expire).not.toHaveBeenCalled();
  });

  it("expires on the first incr request only", async () => {
    mockRedis.incr.mockResolvedValue(1);

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 1,
      rateLimit: 50,
    });
    expect(mockRedis.expire).toHaveBeenCalled();
  });

  it("enforces rate limit if sampled (hit)", async () => {
    mockRedis.incr.mockResolvedValue(10);
    vi.spyOn(global.Math, "random").mockReturnValue(0.08);

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
      sampleRate: 0.1,
    });

    expect(result).toEqual({
      rateLimited: true,
      requestCount: 10,
      rateLimit: 5,
      status: 429,
      errorMessage:
        "You've exceeded your storage rate limit at 5 reqs/sec. To get higher rate limits, contact us at https://thirdweb.com/contact-us.",
      errorCode: "RATE_LIMIT_EXCEEDED",
    });
  });

  it("does not enforce rate limit if sampled (miss)", async () => {
    mockRedis.incr.mockResolvedValue(10);
    vi.spyOn(global.Math, "random").mockReturnValue(0.15);

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
      sampleRate: 0.1,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 0,
      rateLimit: 0,
    });
  });
});
