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

    const generatePayload = generateLoginPayload(options);
    const payloadToSign = await generatePayload({
      address: TEST_ACCOUNT_A.address,
    });

    // sign the payload
    const signatureResult = await signLoginPayload({
      payload: payloadToSign,
      account: TEST_ACCOUNT_A,
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
        payloadExpirationTime: 3600000,
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

    const generatePayload = generateLoginPayload(options);
    const payloadToSign = await generatePayload({
      address: TEST_ACCOUNT_A.address,
    });

    // sign the payload
    const signatureResult = await signLoginPayload({
      payload: payloadToSign,
      account: TEST_ACCOUNT_A,
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
        payloadExpirationTime: 3600000,
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

    const generatePayload = generateLoginPayload(options);
    const payloadToSign = await generatePayload({
      address: TEST_ACCOUNT_A.address,
    });

    // sign the payload
    const signatureResult = await signLoginPayload({
      payload: payloadToSign,
      // this is the wrong account!
      account: TEST_ACCOUNT_B,
    });

    // verify the payload
    const verifyPayload = verifyLoginPayload(options);

    const verificationResult = await verifyPayload(signatureResult);

    expect(verificationResult.valid).toBe(false);
  });
});
