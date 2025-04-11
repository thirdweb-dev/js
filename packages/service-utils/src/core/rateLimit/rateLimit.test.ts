import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validServiceConfig, validTeamResponse } from "../../mocks.js";
import { rateLimit } from "./index.js";

const mockRedis = {
  get: vi.fn(),
  expire: vi.fn(),
  incrby: vi.fn(),
};

describe("rateLimit", () => {
  beforeEach(() => {
    // Clear mock function calls and reset any necessary state.
    vi.clearAllMocks();
    mockRedis.get.mockReset();
    mockRedis.expire.mockReset();
    mockRedis.incrby.mockReset();
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
    mockRedis.get.mockResolvedValue("50"); // Current count is 50 requests in 10 seconds.

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 51,
      rateLimit: 50,
    });

    expect(mockRedis.incrby).toHaveBeenCalledTimes(1);
  });

  it("should rate limit if exceeded hard limit", async () => {
    mockRedis.get.mockResolvedValue(51);

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

    expect(mockRedis.incrby).not.toHaveBeenCalled();
  });

  it("expires on the first incr request only", async () => {
    mockRedis.get.mockResolvedValue("1");

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 2,
      rateLimit: 50,
    });
    expect(mockRedis.incrby).toHaveBeenCalled();
  });

  it("enforces rate limit if sampled (hit)", async () => {
    mockRedis.get.mockResolvedValue("10");
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
    mockRedis.get.mockResolvedValue(10);
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

  it("should handle redis get failure gracefully", async () => {
    mockRedis.get.mockRejectedValue(new Error("Redis connection error"));

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
  });

  it("should handle zero requests correctly", async () => {
    mockRedis.get.mockResolvedValue("0");

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
    expect(mockRedis.incrby).toHaveBeenCalledWith(expect.any(String), 1);
  });

  it("should handle null response from redis", async () => {
    mockRedis.get.mockResolvedValue(null);

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
  });

  it("should handle very low sample rates", async () => {
    mockRedis.get.mockResolvedValue("100");
    vi.spyOn(global.Math, "random").mockReturnValue(0.001);

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 5,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
      sampleRate: 0.01,
    });

    expect(result).toEqual({
      rateLimited: true,
      requestCount: 100,
      rateLimit: 0.5,
      status: 429,
      errorMessage: expect.any(String),
      errorCode: "RATE_LIMIT_EXCEEDED",
    });
  });

  it("should handle multiple concurrent requests with redis lag", async () => {
    // Mock initial state
    mockRedis.get.mockResolvedValue("0");

    // Mock redis.set to have 100ms delay
    mockRedis.incrby.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(1), 100);
        }),
    );

    // Make 3 concurrent requests
    const requests = Promise.all([
      rateLimit({
        team: validTeamResponse,
        limitPerSecond: 5,
        serviceConfig: validServiceConfig,
        redis: mockRedis,
      }),
      rateLimit({
        team: validTeamResponse,
        limitPerSecond: 5,
        serviceConfig: validServiceConfig,
        redis: mockRedis,
      }),
      rateLimit({
        team: validTeamResponse,
        limitPerSecond: 5,
        serviceConfig: validServiceConfig,
        redis: mockRedis,
      }),
    ]);

    const results = await requests;
    // All requests should succeed since they all see initial count of 0
    for (const result of results) {
      expect(result).toEqual({
        rateLimited: false,
        requestCount: 1,
        rateLimit: 50,
      });
    }

    // Redis set should be called 3 times
    expect(mockRedis.incrby).toHaveBeenCalledTimes(3);
  });

  it("should handle custom increment values", async () => {
    // Mock initial state
    mockRedis.get.mockResolvedValue("5");
    mockRedis.incrby.mockResolvedValue(10);

    const result = await rateLimit({
      team: validTeamResponse,
      limitPerSecond: 20,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
      increment: 5,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 10,
      rateLimit: 200,
    });

    // Verify redis was called with correct increment
    expect(mockRedis.incrby).toHaveBeenCalledWith(
      expect.stringContaining("rate-limit"),
      5,
    );
  });
});
