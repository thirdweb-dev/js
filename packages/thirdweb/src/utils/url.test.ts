import { describe, expect, it } from "vitest";
import { formatWalletConnectUrl } from "./url.js";

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
