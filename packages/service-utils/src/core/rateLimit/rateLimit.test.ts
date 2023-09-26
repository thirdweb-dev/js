import { rateLimit } from ".";
import { validApiKeyMeta, validServiceConfig } from "../../mocks";
import { updateRateLimitedAt } from "../api";

const mockRedis = {
  incr: jest.fn(),
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
      mockRedis,
    );

    expect(result).toEqual({ rateLimited: false });
  });

  it("should not rate limit if within limit", async () => {
    mockRedis.incr.mockResolvedValue("50"); // Current count is 50 requests in 10 seconds.

    const result = await rateLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: { storage: 5 } }, // Example limit of 5 reqs/sec
        accountMeta: null,
      },
      validServiceConfig,
      mockRedis,
    );

    expect(result).toEqual({ rateLimited: false });
    expect(updateRateLimitedAt).not.toHaveBeenCalled();
  });

  it("should report rate limit if exceeded but not block", async () => {
    mockRedis.incr.mockResolvedValue("51"); // Current count is 51 requests in 10 seconds.

    const result = await rateLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: { storage: 5 } }, // Example limit of 5 reqs/sec
        accountMeta: null,
      },
      validServiceConfig,
      mockRedis,
    );

    expect(result).toEqual({ rateLimited: false });
    expect(updateRateLimitedAt).toHaveBeenCalled();
  });

  it("should rate limit if exceeded hard limit", async () => {
    mockRedis.incr.mockResolvedValue("101");

    const result = await rateLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, rateLimits: { storage: 5 } }, // Example limit of 5 reqs/sec
        accountMeta: null,
      },
      validServiceConfig,
      mockRedis,
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
