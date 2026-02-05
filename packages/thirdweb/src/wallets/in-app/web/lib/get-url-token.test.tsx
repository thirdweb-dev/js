import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
      authCookie: undefined,
      authFlow: undefined,
      authProvider: undefined,
      authResult: { token: "abc" },
      walletId: "123",
    });
  });

  it("should handle authCookie and update URL correctly", () => {
    window.location.search = "?walletId=123&authCookie=myCookie";

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authFlow: undefined,
      authProvider: undefined,
      authResult: undefined,
      walletId: "123",
    });

    // Check if URL has been updated correctly
    expect(window.location.search).toBe("?walletId=123&authCookie=myCookie");
  });

  it("should handle all parameters correctly", () => {
    window.location.search =
      "?walletId=123&authResult=%7B%22token%22%3A%22xyz%22%7D&authProvider=provider1&authCookie=myCookie";

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authFlow: undefined,
      authProvider: "provider1",
      authResult: { token: "xyz" },
      walletId: "123",
    });

    // Check if URL has been updated correctly
    expect(window.location.search).toBe(
      "?walletId=123&authResult=%7B%22token%22%3A%22xyz%22%7D&authProvider=provider1&authCookie=myCookie",
    );
  });

  it("should preserve hash fragment when cleaning up URL", () => {
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        search: "?walletId=123&authCookie=myCookie",
        hash: "#/s:wampei.eth",
        pathname: "/",
      },
      writable: true,
    });

    const pushStateSpy = vi.spyOn(window.history, "pushState");

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authFlow: undefined,
      authProvider: undefined,
      authResult: undefined,
      walletId: "123",
    });

    // Verify pushState was called with the hash preserved
    expect(pushStateSpy).toHaveBeenCalledWith({}, "", "/#/s:wampei.eth");
    pushStateSpy.mockRestore();
  });

  it("should parse auth params embedded inside the hash fragment", () => {
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        search: "",
        hash: "#/s:wampei.eth?walletId=123&authCookie=myCookie",
        pathname: "/",
      },
      writable: true,
    });

    const pushStateSpy = vi.spyOn(window.history, "pushState");

    const result = getUrlToken();

    expect(result).toEqual({
      authCookie: "myCookie",
      authFlow: undefined,
      authProvider: undefined,
      authResult: undefined,
      walletId: "123",
    });

    // Verify pushState preserves hash path but strips auth params from it
    expect(pushStateSpy).toHaveBeenCalledWith({}, "", "/#/s:wampei.eth");
    pushStateSpy.mockRestore();
  });
});
