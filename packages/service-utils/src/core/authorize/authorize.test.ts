import { describe, expect, it } from "vitest";
import type { CoreServiceConfig } from "../api.js";
import { authorize } from "./index.js";

const validServiceConfig: CoreServiceConfig = {
  apiUrl: "https://api.example.com",
  serviceScope: "storage",
  serviceApiKey: "service key",
};

describe("authorizeClient", () => {
  it("should not authorize if auth not enforced and no credentials", async () => {
    const result = (await authorize(
      {
        secretKey: null,
        clientId: null,
        origin: null,
        bundleId: null,
        secretKeyHash: null,
        hashedJWT: null,
        jwt: null,
        ecosystemId: null,
        ecosystemPartnerId: null,
      },
      validServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    )) as any;

    expect(result.authorized).toBe(false);
  });
});
