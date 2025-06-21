import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../test/src/test-wallets.js";
import { generateLoginPayload } from "./generate-login-payload.js";
import { signLoginPayload } from "./sign-login-payload.js";
import { verifyLoginPayload } from "./verify-login-payload.js";

describe("verifyLoginPayload", () => {
  beforeAll(() => {
    const date = new Date(0);

    vi.useFakeTimers();
    vi.setSystemTime(date);
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  test("should work with a valid login payload", async () => {
    const options = {
      client: TEST_CLIENT,
      domain: "example.com",
      login: {
        nonce: {
          generate() {
            return "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
          validate(uuid: string) {
            return uuid === "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
        },
        payloadExpirationTimeSeconds: 3600,
        resources: ["resource1", "resource2"],
        statement: "This is a statement",
        uri: "https://example.com",
        version: "1.0",
      },
    };

    const generatePayload = generateLoginPayload(options);
    const payloadToSign = await generatePayload({
      address: TEST_ACCOUNT_A.address,
    });

    // sign the payload
    const signatureResult = await signLoginPayload({
      account: TEST_ACCOUNT_A,
      payload: payloadToSign,
    });

    // verify the payload
    const verifyPayload = verifyLoginPayload(options);

    const verificationResult = await verifyPayload(signatureResult);

    expect(verificationResult.valid).toBe(true);
    if (verificationResult.valid) {
      expect(verificationResult.payload.address).toBe(TEST_ACCOUNT_A.address);
    }
  });

  test("should fail with an invalid signature", async () => {
    const options = {
      client: TEST_CLIENT,
      domain: "example.com",
      login: {
        nonce: {
          generate() {
            return "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
          validate(uuid: string) {
            return uuid === "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
        },
        payloadExpirationTime: 3600000,
        resources: ["resource1", "resource2"],
        statement: "This is a statement",
        uri: "https://example.com",
        version: "1.0",
      },
    };

    const generatePayload = generateLoginPayload(options);
    const payloadToSign = await generatePayload({
      address: TEST_ACCOUNT_A.address,
    });

    // sign the payload
    const signatureResult = await signLoginPayload({
      account: TEST_ACCOUNT_A,
      payload: payloadToSign,
    });

    // verify the payload
    const verifyPayload = verifyLoginPayload(options);

    const verificationResult = await verifyPayload({
      ...signatureResult,
      signature: "invalid",
    });

    expect(verificationResult.valid).toBe(false);
  });

  test("should fail if singed with a different account", async () => {
    const options = {
      client: TEST_CLIENT,
      domain: "example.com",
      login: {
        nonce: {
          generate() {
            return "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
          validate(uuid: string) {
            return uuid === "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
          },
        },
        payloadExpirationTime: 3600000,
        resources: ["resource1", "resource2"],
        statement: "This is a statement",
        uri: "https://example.com",
        version: "1.0",
      },
    };

    const generatePayload = generateLoginPayload(options);
    const payloadToSign = await generatePayload({
      address: TEST_ACCOUNT_A.address,
    });

    // sign the payload
    const signatureResult = await signLoginPayload({
      // this is the wrong account!
      account: TEST_ACCOUNT_B,
      payload: payloadToSign,
    });

    // verify the payload
    const verifyPayload = verifyLoginPayload(options);

    const verificationResult = await verifyPayload(signatureResult);

    expect(verificationResult.valid).toBe(false);
  });
});
