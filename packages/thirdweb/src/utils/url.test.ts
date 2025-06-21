import { describe, expect, it } from "vitest";
import {
  formatExplorerAddressUrl,
  formatExplorerTxUrl,
  formatNativeUrl,
  formatUniversalUrl,
  formatWalletConnectUrl,
  isHttpUrl,
} from "./url.js";

describe("formatWalletConnectUrl", () => {
  it("should format a wallet connect URL for an HTTP app URL", () => {
    const appUrl = "https://example.com";
    const wcUri = "wc:1234567890";

    const result = formatWalletConnectUrl(appUrl, wcUri);

    expect(result).toMatchInlineSnapshot(`
      {
        "href": "https://example.com/",
        "redirect": "https://example.com/wc?uri=wc%3A1234567890",
      }
    `);
  });

  it("should format a wallet connect URL for a native app URL", () => {
    const appUrl = "myapp://example";
    const wcUri = "wc:1234567890";

    const result = formatWalletConnectUrl(appUrl, wcUri);

    expect(result).toMatchInlineSnapshot(`
      {
        "href": "myapp://example/",
        "redirect": "myapp://example/wc?uri=wc%3A1234567890",
      }
    `);
  });
});

describe("Utility functions tests", () => {
  describe("isHttpUrl", () => {
    it("should return true for valid HTTP/HTTPS URLs", () => {
      expect(isHttpUrl("http://example.com")).toBe(true);
      expect(isHttpUrl("https://example.com")).toBe(true);
    });

    it("should return false for non-HTTP URLs", () => {
      expect(isHttpUrl("ftp://example.com")).toBe(false);
      expect(isHttpUrl("example://custom")).toBe(false);
      expect(isHttpUrl("example.com")).toBe(false);
    });
  });

  describe("formatUniversalUrl", () => {
    it("should format a valid HTTP URL with a WalletConnect URI", () => {
      const result = formatUniversalUrl("https://example.com", "wc:uri");
      expect(result).toEqual({
        href: "https://example.com/",
        redirect: "https://example.com/wc?uri=wc%3Auri",
      });
    });
  });

  describe("formatNativeUrl", () => {
    it("should format a valid native URL with a WalletConnect URI", () => {
      const result = formatNativeUrl("custom://example", "wc:uri");
      expect(result).toEqual({
        href: "custom://example/",
        redirect: "custom://example/wc?uri=wc%3Auri",
      });
    });
  });

  describe("formatWalletConnectUrl", () => {
    it("should call formatUniversalUrl for HTTP URLs", () => {
      const result = formatWalletConnectUrl("https://example.com", "wc:uri");
      expect(result).toEqual({
        href: "https://example.com/",
        redirect: "https://example.com/wc?uri=wc%3Auri",
      });
    });

    it("should call formatNativeUrl for non-HTTP URLs", () => {
      const result = formatWalletConnectUrl("custom://example", "wc:uri");
      expect(result).toEqual({
        href: "custom://example/",
        redirect: "custom://example/wc?uri=wc%3Auri",
      });
    });
  });

  describe("formatExplorerTxUrl", () => {
    it("should correctly format transaction URLs", () => {
      const result = formatExplorerTxUrl("https://explorer.com", "tx123");
      expect(result).toBe("https://explorer.com/tx/tx123");

      const resultWithSlash = formatExplorerTxUrl(
        "https://explorer.com/",
        "tx123",
      );
      expect(resultWithSlash).toBe("https://explorer.com/tx/tx123");
    });
  });

  describe("formatExplorerAddressUrl", () => {
    it("should correctly format address URLs", () => {
      const result = formatExplorerAddressUrl(
        "https://explorer.com",
        "addr123",
      );
      expect(result).toBe("https://explorer.com/address/addr123");

      const resultWithSlash = formatExplorerAddressUrl(
        "https://explorer.com/",
        "addr123",
      );
      expect(resultWithSlash).toBe("https://explorer.com/address/addr123");
    });
  });
});
