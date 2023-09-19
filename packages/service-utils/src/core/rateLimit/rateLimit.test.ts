import { rateLimit } from ".";
import { validApiKeyMeta, validServiceConfig } from "../../mocks";
import { updateRateLimitedAt } from "../api";

// Mocking the cacheOptions object
const mockCacheOptions = {
  get: jest.fn(),
  put: jest.fn(),
};

// Mocking the updateRateLimitedAt function
jest.mock("../../../src/core/api", () => ({
  updateRateLimitedAt: jest.fn(),
}));

describe("rateLimit", () => {
  beforeEach(() => {
    // Clear mock function calls and reset any necessary state
    jest.clearAllMocks();
  });

  it("should not rate limit if service scope is not in rate limits", async () => {
    const result = await rateLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: {} },
        accountMeta: null,
      },
      validServiceConfig,
      mockCacheOptions,
    );

    expect(result).toEqual({ rateLimited: false });
  });

  it("should not rate limit if within limit", async () => {
    mockCacheOptions.get.mockResolvedValue("49"); // Current count is 49 requests in 10 seconds.

    const result = await rateLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: { storage: 5 } }, // Example limit of 5 reqs/sec
        accountMeta: null,
      },
      validServiceConfig,
      mockCacheOptions,
    );

    expect(result).toEqual({ rateLimited: false });
    expect(updateRateLimitedAt).not.toHaveBeenCalled();
  });

  it("should report rate limit if exceeded but not block", async () => {
    mockCacheOptions.get.mockResolvedValue("50"); // Current count is 50 requests in 10 seconds.

    const result = await rateLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: { storage: 5 } }, // Example limit of 5 reqs/sec
        accountMeta: null,
      },
      validServiceConfig,
      mockCacheOptions,
    );

    expect(result).toEqual({ rateLimited: false });
    expect(updateRateLimitedAt).toHaveBeenCalled();
  });

  it("should rate limit if exceeded hard limit", async () => {
    mockCacheOptions.get.mockResolvedValue("100");

    const result = await rateLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: { storage: 5 } }, // Example limit of 5 reqs/sec
        accountMeta: null,
      },
      validServiceConfig,
      mockCacheOptions,
    );

    expect(result).toEqual({
      rateLimited: true,
      status: 429,
      errorMessage: `You've exceeded your storage rate limit at 5 reqs/sec. To get higher rate limits, contact us at https://thirdweb.com/contact-us.`,
      errorCode: "RATE_LIMIT_EXCEEDED",
    });
    expect(updateRateLimitedAt).toHaveBeenCalled();
  });
});
