import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { generateLoginPayload } from "./generate-login-payload.js";

describe("generateLoginPayload", () => {
  beforeAll(() => {
    const date = new Date(0);

    vi.useFakeTimers();
    vi.setSystemTime(date);
  });
  afterAll(() => {
    vi.useRealTimers();
  });
  test("should generate the login payload correctly", async () => {
    const options = {
      client: TEST_CLIENT,
      domain: "example.com",
      login: {
        payloadExpirationTimeSeconds: 3600,
        statement: "This is a statement",
        version: "1.0",
        resources: ["resource1", "resource2"],
        uri: "https://example.com",
        nonce: {
          generate() {
            return "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
          validate(uuid: string) {
            return uuid === "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
        },
      },
    };

    const loginPayloadParams = {
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      chainId: 1,
    };

    const generatePayload = generateLoginPayload(options);
    const result = await generatePayload(loginPayloadParams);

    expect(result).toMatchInlineSnapshot(`
      {
        "address": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
        "chain_id": "1",
        "domain": "example.com",
        "expiration_time": "1970-01-01T01:00:00.000Z",
        "invalid_before": "1969-12-31T23:00:00.000Z",
        "issued_at": "1970-01-01T00:00:00.000Z",
        "nonce": "20cd4ddb-6857-4d36-8e44-9f6e026b8de9",
        "resources": [
          "resource1",
          "resource2",
        ],
        "statement": "This is a statement",
        "uri": "https://example.com",
        "version": "1.0",
      }
    `);
  });

  test("should generate the login payload with default values", async () => {
    const options = {
      client: TEST_CLIENT,
      domain: "example.com",
    };

    const loginPayloadParams = {
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      chainId: 1,
    };

    const generatePayload = generateLoginPayload(options);
    const result = await generatePayload(loginPayloadParams);

    const { nonce, ...restResult } = result;

    expect(nonce).toContain("0x");

    expect(restResult).toMatchInlineSnapshot(`
      {
        "address": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
        "chain_id": "1",
        "domain": "example.com",
        "expiration_time": "1970-01-01T00:10:00.000Z",
        "invalid_before": "1969-12-31T23:50:00.000Z",
        "issued_at": "1970-01-01T00:00:00.000Z",
        "resources": undefined,
        "statement": "Please ensure that the domain above matches the URL of the current website.",
        "uri": undefined,
        "version": "1",
      }
    `);
  });
});
