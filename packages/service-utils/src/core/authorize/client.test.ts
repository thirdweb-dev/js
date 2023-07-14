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
    bundleIds: [],
    services: [],
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
    expect(result.errorMessage).toBe("The secret is invalid.");
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
      "The origin is not authorized for this key.",
    );
    expect(result.errorCode).toBe("ORIGIN_UNAUTHORIZED");
    expect(result.status).toBe(401);
  });
});
