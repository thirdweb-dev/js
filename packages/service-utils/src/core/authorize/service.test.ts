import { describe, expect, it } from "vitest";
import {
  validApiKeyMeta,
  validBundlerServiceConfig,
  validServiceConfig,
} from "../../mocks.js";
import type { CoreServiceConfig } from "../api.js";
import {
  type ServiceAuthorizationPayload,
  authorizeService,
} from "./service.js";

describe("authorizeService", () => {
  it("should authorize service with valid service scope and action", () => {
    // biome-ignore lint/suspicious/noExplicitAny: test only
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
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(validApiKeyMeta);
  });

  it("should not authorize service with unauthorized service scope", () => {
    const invalidServiceConfig: CoreServiceConfig = {
      apiUrl: "https://api.example.com",
      serviceScope: "rpc",
      serviceApiKey: "service-api-key",
      serviceAction: "action1",
      enforceAuth: true,
    };

    const result = authorizeService(
      validApiKeyMeta,
      invalidServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized service: rpc. You can view the restrictions on this API key in your dashboard:  https://thirdweb.com/create-api-key",
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
      enforceAuth: true,
    };

    const result = authorizeService(
      validApiKeyMeta,
      invalidServiceConfig,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized action: storage unauthorized-action. You can view the restrictions on this API key in your dashboard:  https://thirdweb.com/create-api-key",
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
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized address: storage unauthorized-target. You can view the restrictions on this API key in your dashboard:  https://thirdweb.com/create-api-key",
    );
    expect(result.errorCode).toBe("SERVICE_TARGET_ADDRESS_UNAUTHORIZED");
    expect(result.status).toBe(403);
  });

  it("should not authorize service with unauthorized target addresses", () => {
    const invalidAuthorizationPayload: ServiceAuthorizationPayload = {
      targetAddress: ["target1", "target2", "target3"],
    };

    const result = authorizeService(
      validApiKeyMeta,
      validServiceConfig,
      invalidAuthorizationPayload,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized address: storage target1,target2,target3. You can view the restrictions on this API key in your dashboard:  https://thirdweb.com/create-api-key",
    );
    expect(result.errorCode).toBe("SERVICE_TARGET_ADDRESS_UNAUTHORIZED");
    expect(result.status).toBe(403);
  });

  it("should authorize bundler service with * target addresses", () => {
    const authorizationPayload: ServiceAuthorizationPayload = {
      targetAddress: ["target1", "target2"],
    };

    const result = authorizeService(
      validApiKeyMeta,
      validBundlerServiceConfig,
      authorizationPayload,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(validApiKeyMeta);
  });
});
