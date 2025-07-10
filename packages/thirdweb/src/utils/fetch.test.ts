import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ThirdwebClient } from "../client/client.js";
import type { Ecosystem } from "../wallets/in-app/core/wallet/types.js";
import {
  getClientFetch,
  IS_THIRDWEB_URL_CACHE,
  isThirdwebUrl,
} from "./fetch.js";

// Mock fetch
global.fetch = vi.fn();

describe("getClientFetch", () => {
  const mockClient: ThirdwebClient = {
    clientId: "test-client-id",
    secretKey: undefined,
  };
  const mockEcosystem: Ecosystem = { id: "ecosystem.test" };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should set correct headers for thirdweb URLs", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response());
    const clientFetch = getClientFetch(mockClient, mockEcosystem);
    await clientFetch("https://api.thirdweb.com/test");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.thirdweb.com/test",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );

    // biome-ignore lint/suspicious/noExplicitAny: `any` type ok for tests
    const headers = (global.fetch as any).mock.calls[0][1].headers;
    expect(headers.get("x-client-id")).toBe("test-client-id");
    expect(headers.get("x-ecosystem-id")).toBe("ecosystem.test");
  });

  it("should not set headers for non-thirdweb URLs", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response());
    const clientFetch = getClientFetch(mockClient, mockEcosystem);
    await clientFetch("https://example.com");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://example.com",
      expect.not.objectContaining({
        headers: expect.any(Headers),
      }),
    );
  });

  it("should NOT send a bearer token if secret key is a JWT", () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response());
    const clientFetch = getClientFetch({
      clientId: "test-client-id",
      secretKey: "foo.bar.baz",
    });
    clientFetch("https://api.thirdweb.com/test");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.thirdweb.com/test",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );

    // biome-ignore lint/suspicious/noExplicitAny: `any` type ok for tests
    const headers = (global.fetch as any).mock.calls[0][1].headers;
    expect(headers.get("authorization")).toBe(null);
  });

  it("should send clientId, teamId and jwt for bundler requests", () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response());
    const clientFetch = getClientFetch({
      clientId: "test-client-id",
      secretKey: "foo.bar.baz",
      teamId: "test-team-id",
    });

    clientFetch("https://84532.bundler.thirdweb-dev.com/v2", {
      useAuthToken: true, // bundler requests have useAuthToken set to true
    });

    // biome-ignore lint/suspicious/noExplicitAny: `any` type ok for tests
    const headers = (global.fetch as any).mock.calls[0][1].headers;
    expect(headers.get("x-client-id")).toBe("test-client-id");
    expect(headers.get("x-team-id")).toBe("test-team-id");
    expect(headers.get("authorization")).toBe("Bearer foo.bar.baz");
  });

  it("should send a bearer token if secret key is a JWT and useAuthToken is true", () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response());
    const clientFetch = getClientFetch({
      clientId: "test-client-id",
      secretKey: "foo.bar.baz",
    });
    clientFetch("https://api.thirdweb.com/test", {
      useAuthToken: true,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.thirdweb.com/test",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );

    // biome-ignore lint/suspicious/noExplicitAny: `any` type ok for tests
    const headers = (global.fetch as any).mock.calls[0][1].headers;
    expect(headers.get("authorization")).toBe("Bearer foo.bar.baz");
  });

  it("should abort the request after timeout", async () => {
    vi.useFakeTimers();
    const abortSpy = vi.spyOn(AbortController.prototype, "abort");
    const clientFetch = getClientFetch(mockClient);

    const fetchPromise = clientFetch("https://api.thirdweb.com/test", {
      requestTimeoutMs: 5000,
    });
    vi.advanceTimersByTime(5001);

    await expect(fetchPromise).rejects.toThrow();
    expect(abortSpy).toHaveBeenCalled();

    vi.useRealTimers();
  });
});

describe("isThirdwebUrl", () => {
  it("should return true for thirdweb domains", () => {
    expect(isThirdwebUrl("https://api.thirdweb.com")).toBe(true);
    expect(isThirdwebUrl("https://example.ipfscdn.io")).toBe(true);
  });

  it("should return false for non-thirdweb domains", () => {
    expect(isThirdwebUrl("https://example.com")).toBe(false);
    expect(isThirdwebUrl("https://otherthirdweb.com")).toBe(false);
  });

  it("should handle invalid URLs", () => {
    expect(isThirdwebUrl("not-a-url")).toBe(false);
  });

  it("should cache results", () => {
    const url = "https://api.thirdweb.com";
    isThirdwebUrl(url);
    isThirdwebUrl(url);
    // You might need to expose the cache to test this properly
    expect(IS_THIRDWEB_URL_CACHE.get(url)).toBe(true);
  });
});
