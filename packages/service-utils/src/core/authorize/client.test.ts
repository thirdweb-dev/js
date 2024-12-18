import { describe, expect, it } from "vitest";
import {
  validProjectResponse,
  validTeamAndProjectResponse,
} from "../../mocks.js";
import { type ClientAuthorizationPayload, authorizeClient } from "./client.js";

describe("authorizeClient", () => {
  const validAuthOptions: ClientAuthorizationPayload = {
    secretKeyHash: "secret-hash",
    bundleId: null,
    origin: "example.com",
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
      secretKeyHash: null,
      bundleId: null,
      origin: "sub.example.com",
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
      secretKeyHash: null,
      bundleId: null,
      origin: null,
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
      secretKeyHash: null,
      bundleId: "com.foo.bar",
      origin: null,
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
      secretKeyHash: null,
      bundleId: null,
      origin: "unauthorized.com",
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
});
