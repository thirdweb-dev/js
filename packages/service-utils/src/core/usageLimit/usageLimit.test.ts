import { usageLimit } from ".";
import { validApiKeyMeta, validServiceConfig } from "../../mocks";

describe("usageLimit", () => {
  it("should not usage limit if service scope is not in limits", async () => {
    const result = await usageLimit(
      {
        authorized: true,
        apiKeyMeta: { ...validApiKeyMeta, limits: {} },
        accountMeta: null,
      },
      validServiceConfig,
    );

    expect(result).toEqual({ usageLimited: false });
  });

  it("should not usage limit if there is no usage for service scope", async () => {
    const result = await usageLimit(
      {
        authorized: true,
        apiKeyMeta: validApiKeyMeta,
        accountMeta: null,
      },
      validServiceConfig,
    );

    expect(result).toEqual({ usageLimited: false });
  });

  it("should not usage limit if within limit", async () => {
    const result = await usageLimit(
      {
        authorized: true,
        apiKeyMeta: {
          ...validApiKeyMeta,
          usage: {
            storage: { sumFileSizeBytes: 10 },
          },
        },
        accountMeta: null,
      },
      validServiceConfig,
    );

    expect(result).toEqual({ usageLimited: false });
  });

  it("should usage limit if exceeded", async () => {
    const result = await usageLimit(
      {
        authorized: true,
        apiKeyMeta: {
          ...validApiKeyMeta,
          usage: {
            storage: { sumFileSizeBytes: 110 },
          },
        },
        accountMeta: null,
      },
      validServiceConfig,
    );

    expect(result).toEqual({
      usageLimited: true,
      status: 403,
      errorMessage: `You've used all of your total usage limit for Storage Pinning. Please add your payment method at https://thirdweb.com/dashboard/settings/billing.`,
      errorCode: "PAYMENT_METHOD_REQUIRED",
    });
  });
});
