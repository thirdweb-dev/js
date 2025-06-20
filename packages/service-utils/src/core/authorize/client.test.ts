import { describe, expect, it } from "vitest";
import {
  validProjectResponse,
  validTeamAndProjectResponse,
} from "../../mocks.js";
import { authorizeClient, type ClientAuthorizationPayload } from "./client.js";

describe("authorizeClient", () => {
  const validAuthOptions: ClientAuthorizationPayload = {
    bundleId: null,
    incomingServiceApiKey: null,
    origin: "example.com",
    secretKeyHash: "secret-hash",
  };

  it("should authorize client with valid secret key", () => {
    const result = authorizeClient(
      validAuthOptions,
      validTeamAndProjectResponse,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.project).toEqual(validProjectResponse);
  });

  it("should authorize client with matching wildcard domain", () => {
    const authOptionsWithWildcardDomain: ClientAuthorizationPayload = {
      bundleId: null,
      incomingServiceApiKey: null,
      origin: "sub.example.com",
      secretKeyHash: null,
    };

    const result = authorizeClient(
      authOptionsWithWildcardDomain,
      validTeamAndProjectResponse,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.project).toEqual(validProjectResponse);
  });

  it("should authorize client with any domain w/o origin check", () => {
    const authOptionsWithAnyDomain: ClientAuthorizationPayload = {
      bundleId: null,
      incomingServiceApiKey: null,
      origin: null,
      secretKeyHash: null,
    };

    const validProjectResponseAnyDomain = {
      ...validTeamAndProjectResponse,
      project: {
        ...validProjectResponse,
        domains: ["*"],
      },
    };

    const result = authorizeClient(
      authOptionsWithAnyDomain,
      validProjectResponseAnyDomain,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.project).toEqual(validProjectResponseAnyDomain.project);
  });

  it("should not authorize client with non-matching bundle id", () => {
    const authOptionsWithBundleId: ClientAuthorizationPayload = {
      bundleId: "com.foo.bar",
      incomingServiceApiKey: null,
      origin: null,
      secretKeyHash: null,
    };

    const result = authorizeClient(
      authOptionsWithBundleId,
      validTeamAndProjectResponse,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized Bundle ID: com.foo.bar. You can view the restrictions on this API key at https://thirdweb.com/create-api-key",
    );
    expect(result.errorCode).toBe("BUNDLE_UNAUTHORIZED");
    expect(result.status).toBe(401);
  });

  it("should not authorize client with unauthorized origin", () => {
    const authOptionsWithUnauthorizedOrigin: ClientAuthorizationPayload = {
      bundleId: null,
      incomingServiceApiKey: null,
      origin: "unauthorized.com",
      secretKeyHash: null,
    };

    const result = authorizeClient(
      authOptionsWithUnauthorizedOrigin,
      validTeamAndProjectResponse,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(false);
    expect(result.errorMessage).toBe(
      "Invalid request: Unauthorized domain: unauthorized.com. You can view the restrictions on this API key at https://thirdweb.com/create-api-key",
    );
    expect(result.errorCode).toBe("ORIGIN_UNAUTHORIZED");
    expect(result.status).toBe(401);
  });

  it("should authorize client with incoming service api key", () => {
    const authOptionsWithServiceKey: ClientAuthorizationPayload = {
      bundleId: null,
      incomingServiceApiKey: "test-service-key",
      origin: "unauthorized.com", // Even unauthorized origin should work with service key
      secretKeyHash: null,
    };

    const result = authorizeClient(
      authOptionsWithServiceKey,
      validTeamAndProjectResponse,
      // biome-ignore lint/suspicious/noExplicitAny: test only
    ) as any;
    expect(result.authorized).toBe(true);
    expect(result.project).toEqual(validTeamAndProjectResponse.project);
  });
});
