import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rateLimit } from ".";
import { validApiKeyMeta, validServiceConfig } from "../../mocks";
import { updateRateLimitedAt } from "../api";
import type { AuthorizationResult } from "../authorize/types";

const mockRedis = {
  incr: vi.fn(),
  expire: vi.fn(),
};

// Mocking the updateRateLimitedAt function
vi.mock("../../../src/core/api", () => ({
  updateRateLimitedAt: vi.fn(),
}));

const DEFAULT_AUTHZ_RESULT: AuthorizationResult = {
  authorized: true,
  apiKeyMeta: {
    ...validApiKeyMeta,
    rateLimits: { storage: 5 }, // Example limit of 5 reqs/sec
  },
  accountMeta: null,
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
      authzResult: {
        ...DEFAULT_AUTHZ_RESULT,
        // No rate limits in the authz response.
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: {} },
      },
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
      authzResult: DEFAULT_AUTHZ_RESULT,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 50,
      rateLimit: 50,
    });
    expect(updateRateLimitedAt).not.toHaveBeenCalled();
    expect(mockRedis.expire).not.toHaveBeenCalled();
  });

  it("should report rate limit if exceeded but not block", async () => {
    mockRedis.incr.mockResolvedValue(51); // Current count is 51 requests in 10 seconds.

    const result = await rateLimit({
      authzResult: DEFAULT_AUTHZ_RESULT,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 51,
      rateLimit: 50,
    });
    expect(updateRateLimitedAt).toHaveBeenCalled();
    expect(mockRedis.expire).not.toHaveBeenCalled();
  });

  it("should rate limit if exceeded hard limit", async () => {
    mockRedis.incr.mockResolvedValue(101);

    const result = await rateLimit({
      authzResult: DEFAULT_AUTHZ_RESULT,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
    });

    expect(result).toEqual({
      rateLimited: true,
      requestCount: 101,
      rateLimit: 50,
      status: 429,
      errorMessage: `You've exceeded your storage rate limit at 5 reqs/sec. To get higher rate limits, contact us at https://thirdweb.com/contact-us.`,
      errorCode: "RATE_LIMIT_EXCEEDED",
    });
    expect(updateRateLimitedAt).toHaveBeenCalled();
    expect(mockRedis.expire).not.toHaveBeenCalled();
  });

  it("expires on the first incr request only", async () => {
    mockRedis.incr.mockResolvedValue(1);

    const result = await rateLimit({
      authzResult: DEFAULT_AUTHZ_RESULT,
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
      authzResult: DEFAULT_AUTHZ_RESULT,
      serviceConfig: validServiceConfig,
      redis: mockRedis,
      sampleRate: 0.1,
    });

    expect(result).toEqual({
      rateLimited: false,
      requestCount: 10,
      rateLimit: 5,
    });
  });

  it("does not enforce rate limit if sampled (miss)", async () => {
    mockRedis.incr.mockResolvedValue(10);
    vi.spyOn(global.Math, "random").mockReturnValue(0.15);

    const result = await rateLimit({
      authzResult: DEFAULT_AUTHZ_RESULT,
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
