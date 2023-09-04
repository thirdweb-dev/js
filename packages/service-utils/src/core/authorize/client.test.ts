import { ApiKeyMetadata } from "../api";
import { ClientAuthorizationPayload, authorizeClient } from "./client";

describe("authorizeClient", () => {
  const validApiKeyMeta: ApiKeyMetadata = {
    id: "1",
    key: "your-api-key",
    creatorWalletAddress: "creator-address",
    secretHash: "secret-hash",
    walletAddresses: [],
    domains: ["example.com", "*.example.com"],
    bundleIds: ["com.example.app"],
    services: [],
    accountId: "test-account-id",
    accountStatus: "noCustomer",
    accountPlan: "free",
  };

  const validAuthOptions: ClientAuthorizationPayload = {
    secretKeyHash: "secret-hash",
    bundleId: null,
    origin: "example.com",
  };

  it("should authorize client with valid secret key", () => {
    const result = authorizeClient(validAuthOptions, validApiKeyMeta) as any;
    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(validApiKeyMeta);
  });

  it("should authorize client with matching wildcard domain", () => {
    const authOptionsWithWildcardDomain: ClientAuthorizationPayload = {
      secretKeyHash: null,
      bundleId: null,
      origin: "sub.example.com",
    };

    const result = authorizeClient(
      authOptionsWithWildcardDomain,
      validApiKeyMeta,
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(validApiKeyMeta);
  });

  it("should authorize client with any domain w/o origin check", () => {
    const authOptionsWithAnyDomain: ClientAuthorizationPayload = {
      secretKeyHash: null,
      bundleId: null,
      origin: null,
    };

    const validApiKeyMetaAnyDomain = {
      ...validApiKeyMeta,
      domains: ["*"],
    };

    const result = authorizeClient(
      authOptionsWithAnyDomain,
      validApiKeyMetaAnyDomain,
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.apiKeyMeta).toEqual(validApiKeyMetaAnyDomain);
  });

  it("should not authorize client with non-matching bundle id", () => {
    const authOptionsWithBundleId: ClientAuthorizationPayload = {
      secretKeyHash: null,
      bundleId: "com.foo.bar",
      origin: null,
    };

    const result = authorizeClient(
      authOptionsWithBundleId,
      validApiKeyMeta,
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized Bundle ID: com.foo.bar. You can view the restrictions on this API key at https://thirdweb.com/create-api-key",
    );
    expect(result.errorCode).toBe("BUNDLE_UNAUTHORIZED");
    expect(result.status).toBe(401);
  });

  it("should not authorize client with invalid secret key", () => {
    const authOptionsWithInvalidSecret: ClientAuthorizationPayload = {
      secretKeyHash: "invalid-secret-hash",
      bundleId: null,
      origin: null,
    };

    const result = authorizeClient(
      authOptionsWithInvalidSecret,
      validApiKeyMeta,
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Incorrect key provided. You can view your active API keys at https://thirdweb.com/dashboard/settings",
    );
    expect(result.errorCode).toBe("SECRET_INVALID");
    expect(result.status).toBe(401);
  });

  it("should not authorize client with unauthorized origin", () => {
    const authOptionsWithUnauthorizedOrigin: ClientAuthorizationPayload = {
      secretKeyHash: null,
      bundleId: null,
      origin: "unauthorized.com",
    };

    const result = authorizeClient(
      authOptionsWithUnauthorizedOrigin,
      validApiKeyMeta,
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized domain: unauthorized.com. You can view the restrictions on this API key at https://thirdweb.com/create-api-key",
    );
    expect(result.errorCode).toBe("ORIGIN_UNAUTHORIZED");
    expect(result.status).toBe(401);
  });
});
