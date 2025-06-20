import { describe, expect, it } from "vitest";
import type { CoreServiceConfig } from "../api.js";
import { authorize } from "./index.js";

const validServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceApiKey: "service key",
  serviceScope: "storage",
};

describe("authorizeClient", () => {
  it("should not authorize if auth not enforced and no credentials", async () => {
    const result = (await authorize(
      {
        bundleId: null,
        clientId: null,
        ecosystemId: null,
        ecosystemPartnerId: null,
        hashedJWT: null,
        incomingServiceApiKey: null,
        incomingServiceApiKeyHash: null,
        jwt: null,
        origin: null,
        secretKey: null,
        secretKeyHash: null,
      },
      validServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    )) as any;

    expect(result.authorized).toBe(false);
  });
});
