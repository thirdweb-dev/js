import { describe, expect, it } from "vitest";
import type { CoreServiceConfig } from "../api.js";
import { authorize } from "./index.js";

const validServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceScope: "storage",
  serviceApiKey: "service key",
  enforceAuth: false,
};

describe("authorizeClient", () => {
  it("should skip authorization if auth not enforced and no credentials", async () => {
    const result = (await authorize(
      {
        secretKey: null,
        clientId: null,
        origin: null,
        bundleId: null,
        secretKeyHash: null,
        hashedJWT: null,
        jwt: null,
      },
      validServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    )) as any;

    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(null);
  });

  it("should continue authorization if auth enforced", async () => {
    const result = (await authorize(
      {
        secretKey: null,
        clientId: null,
        origin: null,
        bundleId: null,
        secretKeyHash: null,
        hashedJWT: null,
        jwt: null,
      },
      { ...validServiceConfig, enforceAuth: true },
      // biome-ignore lint/suspicious/noExplicitAny: test only
    )) as any;

    expect(result.authorized).toBe(false);
  });
});
