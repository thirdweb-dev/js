import { ApiKeyMetadata, CoreServiceConfig } from "../api";
import { ServiceAuthorizationPayload, authorizeService } from "./service";

describe("authorizeService", () => {
  const validApiKeyMeta: ApiKeyMetadata = {
    id: "1",
    key: "your-api-key",
    creatorWalletAddress: "creator-address",
    secretHash: "secret-hash",
    walletAddresses: [],
    domains: [],
    bundleIds: [],
    services: [
      {
        name: "storage",
        targetAddresses: ["target1", "target2"],
        actions: ["action1", "action2"],
      },
      {
        name: "service2",
        targetAddresses: ["target3"],
        actions: ["action3"],
      },
    ],
  };

  const validServiceConfig: CoreServiceConfig = {
    apiUrl: "https://api.example.com",
    serviceScope: "storage",
    serviceApiKey: "service-api-key",
    serviceAction: "action1",
  };

  it("should authorize service with valid service scope and action", () => {
    const result = authorizeService(validApiKeyMeta, validServiceConfig) as any;
    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(validApiKeyMeta);
  });

  it("should authorize service with valid target address", () => {
    const validAuthorizationPayload: ServiceAuthorizationPayload = {
      targetAddress: "target2",
    };

    const result = authorizeService(
      validApiKeyMeta,
      validServiceConfig,
      validAuthorizationPayload,
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(validApiKeyMeta);
  });

  it("should not authorize service with unauthorized service scope", () => {
    const invalidServiceConfig: CoreServiceConfig = {
      apiUrl: "https://api.example.com",
      serviceScope: "bundler",
      serviceApiKey: "service-api-key",
      serviceAction: "action1",
    };

    const result = authorizeService(
      validApiKeyMeta,
      invalidServiceConfig,
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      'The service "bundler" is not authorized for this key.',
    );
    expect(result.errorCode).toBe("SERVICE_UNAUTHORIZED");
    expect(result.status).toBe(403);
  });

  it("should not authorize service with unauthorized service action", () => {
    const invalidServiceConfig: CoreServiceConfig = {
      apiUrl: "https://api.example.com",
      serviceScope: "storage",
      serviceApiKey: "service-api-key",
      serviceAction: "unauthorized-action",
    };

    const result = authorizeService(
      validApiKeyMeta,
      invalidServiceConfig,
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      'The service "storage" action "unauthorized-action" is not authorized for this key.',
    );
    expect(result.errorCode).toBe("SERVICE_ACTION_UNAUTHORIZED");
    expect(result.status).toBe(403);
  });

  it("should not authorize service with unauthorized target address", () => {
    const invalidAuthorizationPayload: ServiceAuthorizationPayload = {
      targetAddress: "unauthorized-target",
    };

    const result = authorizeService(
      validApiKeyMeta,
      validServiceConfig,
      invalidAuthorizationPayload,
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      'The service "storage" target address "unauthorized-target" is not authorized for this key.',
    );
    expect(result.errorCode).toBe("SERVICE_TARGET_ADDRESS_UNAUTHORIZED");
    expect(result.status).toBe(403);
  });
});
