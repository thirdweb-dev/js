import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createLoginMessage, stripUrlScheme } from "./create-login-message.js";

describe("createLoginMessage", () => {
  beforeAll(() => {
    const date = new Date(0);

    vi.useFakeTimers();
    vi.setSystemTime(date);
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  test("should generate the login message correctly", () => {
    const payload = {
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      chain_id: "1",
      domain: "example.com",
      expiration_time: "1634567990",
      invalid_before: "1634567800",
      issued_at: "1634567890",
      nonce: "123456",
      resources: ["resource1", "resource2"],
      statement: "This is a statement",
      uri: "https://example.com",
      version: "1.0",
    };

    const result = createLoginMessage(payload);
    expect(result).toMatchInlineSnapshot(`
      "example.com wants you to sign in with your Ethereum account:
      0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B

      This is a statement

      URI: https://example.com
      Version: 1.0
      Chain ID: 1
      Nonce: 123456
      Issued At: 1634567890
      Expiration Time: 1634567990
      Not Before: 1634567800
      Resources:
      - resource1
      - resource2"
    `);
  });

  test("should generate the login message correctly without optional fields", () => {
    const payload = {
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      domain: "example.com",
      expiration_time: "1634567990",
      invalid_before: "1634567800",
      issued_at: "1634567890",
      nonce: "123456",
      statement: "This is a statement",
      version: "1.0",
    };

    const result = createLoginMessage(payload);
    expect(result).toMatchInlineSnapshot(`
      "example.com wants you to sign in with your Ethereum account:
      0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B

      This is a statement

      Version: 1.0
      Nonce: 123456
      Issued At: 1634567890
      Expiration Time: 1634567990
      Not Before: 1634567800"
    `);
  });

  test("should strip URL scheme from domain in the message", () => {
    const payload = {
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      chain_id: "1",
      domain: "https://example.com",
      expiration_time: "1634567990",
      invalid_before: "1634567800",
      issued_at: "1634567890",
      nonce: "123456",
      statement: "This is a statement",
      uri: "https://example.com",
      version: "1.0",
    };

    const result = createLoginMessage(payload);
    expect(result).toContain(
      "example.com wants you to sign in with your Ethereum account:",
    );
    expect(result).not.toContain("https://example.com wants you to sign in");
  });

  test("stripUrlScheme should strip https scheme", () => {
    expect(stripUrlScheme("https://example.com")).toBe("example.com");
  });

  test("stripUrlScheme should strip http scheme", () => {
    expect(stripUrlScheme("http://example.com")).toBe("example.com");
  });

  test("stripUrlScheme should leave bare domains unchanged", () => {
    expect(stripUrlScheme("example.com")).toBe("example.com");
  });
});
