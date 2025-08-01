import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getUrlToken } from "./get-url-token.js";

describe.runIf(global.window !== undefined)("getUrlToken", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;

    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        search: "",
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore the original location object after each test
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("should return an empty object if not in web context", () => {
    const originalDocument = document;
    // biome-ignore lint/suspicious/noExplicitAny: Test
    (global as any).document = undefined;

    const result = getUrlToken();
    // biome-ignore lint/suspicious/noExplicitAny: Test
    (global as any).document = originalDocument;

    expect(result).toEqual(undefined);
  });

  it("should return an empty object if no parameters are present", () => {
    const result = getUrlToken();
    expect(result).toEqual(undefined);
  });

  it("should parse walletId and authResult correctly", () => {
    window.location.search =
      "?walletId=123&authResult=%7B%22token%22%3A%22abc%22%7D";

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: null,
      authProvider: null,
      authResult: { token: "abc" },
      walletId: "123",
    });
  });

  it("should handle authCookie and update URL correctly", () => {
    window.location.search = "?walletId=123&authCookie=myCookie";

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authProvider: null,
      authResult: undefined,
      walletId: "123",
    });

    // Check if URL has been updated correctly (should remove thirdweb params)
    expect(window.location.search).toBe("");
  });

  it("should handle all parameters correctly", () => {
    window.location.search =
      "?walletId=123&authResult=%7B%22token%22%3A%22xyz%22%7D&authProvider=provider1&authCookie=myCookie";

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authProvider: "provider1",
      authResult: { token: "xyz" },
      walletId: "123",
    });

    // Check if URL has been updated correctly (should remove all thirdweb params)
    expect(window.location.search).toBe("");
  });

  it("should preserve custom parameters while removing thirdweb ones", () => {
    window.location.search =
      "?custom_param=value&walletId=123&another_custom=test&authCookie=myCookie&user_id=456";

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authProvider: null,
      authResult: undefined,
      walletId: "123",
    });

    // Check if custom parameters are preserved while thirdweb ones are removed
    expect(window.location.search).toBe("?custom_param=value&another_custom=test&user_id=456");
  });

  it("should preserve custom parameters with all thirdweb parameters", () => {
    window.location.search =
      "?utm_source=google&walletId=123&authResult=%7B%22token%22%3A%22xyz%22%7D&authProvider=provider1&authCookie=myCookie&ref=homepage";

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authProvider: "provider1",
      authResult: { token: "xyz" },
      walletId: "123",
    });

    // Check if custom parameters (utm_source, ref) are preserved
    expect(window.location.search).toBe("?utm_source=google&ref=homepage");
  });

  it("should handle case where only custom parameters exist", () => {
    window.location.search = "?custom_param=value&another_param=test";

    const result = getUrlToken();

    expect(result).toEqual(undefined);

    // URL should remain unchanged when no thirdweb params are present
    expect(window.location.search).toBe("?custom_param=value&another_param=test");
  });
});
