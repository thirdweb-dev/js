import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createLoginMessage } from "./create-login-message.js";

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
      domain: "example.com",
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      statement: "This is a statement",
      uri: "https://example.com",
      version: "1.0",
      chain_id: "1",
      nonce: "123456",
      issued_at: "1634567890",
      expiration_time: "1634567990",
      invalid_before: "1634567800",
      resources: ["resource1", "resource2"],
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
      domain: "example.com",
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      statement: "This is a statement",
      version: "1.0",
      nonce: "123456",
      issued_at: "1634567890",
      expiration_time: "1634567990",
      invalid_before: "1634567800",
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
});
