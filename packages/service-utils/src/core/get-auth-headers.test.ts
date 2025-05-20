import { describe, expect, it } from "vitest";

import type { AuthorizationInput } from "./authorize/index.js";
import { getAuthHeaders } from "./get-auth-headers.js";

describe("getAuthHeaders", () => {
  const mockServiceApiKey = "test-service-api-key";
  const defaultAuthData: AuthorizationInput = {
    incomingServiceApiKey: null,
    incomingServiceApiKeyHash: null,
    secretKey: null,
    clientId: null,
    ecosystemId: null,
    ecosystemPartnerId: null,
    origin: null,
    bundleId: null,
    secretKeyHash: null,
    jwt: null,
    hashedJWT: null,
  };

  it("should use secret key when provided", () => {
    const authData: AuthorizationInput = {
      ...defaultAuthData,
      secretKey: "test-secret-key",
    };

    const headers = getAuthHeaders(authData, mockServiceApiKey);

    expect(headers).toEqual({
      "x-secret-key": "test-secret-key",
    });
  });

  it("should use JWT when both JWT and teamId are provided", () => {
    const authData: AuthorizationInput = {
      ...defaultAuthData,
      jwt: "test-jwt",
      teamId: "test-team-id",
    };

    const headers = getAuthHeaders(authData, mockServiceApiKey);

    expect(headers).toEqual({
      Authorization: "Bearer test-jwt",
    });
  });

  it("should use JWT when both JWT and clientId are provided", () => {
    const authData: AuthorizationInput = {
      ...defaultAuthData,
      jwt: "test-jwt",
      clientId: "test-client-id",
    };

    const headers = getAuthHeaders(authData, mockServiceApiKey);

    expect(headers).toEqual({
      Authorization: "Bearer test-jwt",
    });
  });

  it("should use incoming service api key when provided", () => {
    const authData: AuthorizationInput = {
      ...defaultAuthData,
      incomingServiceApiKey: "test-incoming-service-api-key",
    };

    const headers = getAuthHeaders(authData, mockServiceApiKey);

    expect(headers).toEqual({
      "x-service-api-key": "test-incoming-service-api-key",
    });
  });

  it("should fall back to service api key when no other auth method is provided", () => {
    const headers = getAuthHeaders(defaultAuthData, mockServiceApiKey);

    expect(headers).toEqual({
      "x-service-api-key": mockServiceApiKey,
    });
  });

  it("should prioritize secret key over other auth methods", () => {
    const authData: AuthorizationInput = {
      ...defaultAuthData,
      secretKey: "test-secret-key",
      jwt: "test-jwt",
      teamId: "test-team-id",
      incomingServiceApiKey: "test-incoming-service-api-key",
    };

    const headers = getAuthHeaders(authData, mockServiceApiKey);

    expect(headers).toEqual({
      "x-secret-key": "test-secret-key",
    });
  });

  it("should prioritize JWT over incoming service api key when teamId is present", () => {
    const authData: AuthorizationInput = {
      ...defaultAuthData,
      jwt: "test-jwt",
      teamId: "test-team-id",
      incomingServiceApiKey: "test-incoming-service-api-key",
    };

    const headers = getAuthHeaders(authData, mockServiceApiKey);

    expect(headers).toEqual({
      Authorization: "Bearer test-jwt",
    });
  });
});
