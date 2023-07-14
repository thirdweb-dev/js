import { authorize } from ".";
import { CoreServiceConfig } from "../api";

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
      },
      validServiceConfig,
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
      },
      { ...validServiceConfig, enforceAuth: true },
    )) as any;

    expect(result.authorized).toBe(false);
  });
});
