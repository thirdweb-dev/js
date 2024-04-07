import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../test/src/test-wallets.js";
import { generateJWT } from "./generate-jwt.js";
import { generateLoginPayload } from "./generate-login-payload.js";
import { signLoginPayload } from "./sign-login-payload.js";
import type { AuthOptions } from "./types.js";
import { verifyJWT } from "./verify-jwt.js";
import { verifyLoginPayload } from "./verify-login-payload.js";

const options: AuthOptions = {
  domain: "example.com",
  adminAccount: TEST_ACCOUNT_A,
  login: {
    nonce: {
      generate() {
        return "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
      },
      validate(uuid: string) {
        return uuid === "20cd4ddb-6857-4d36-8e44-9f6e026b8de9";
      },
    },
  },
  jwt: {
    jwtId: {
      generate() {
        return "8bceec0d-37f7-48b4-a440-7be334b4dfd3";
      },
      validate(jwtId: string) {
        return jwtId === "8bceec0d-37f7-48b4-a440-7be334b4dfd3";
      },
    },
  },
};

describe("verifyJWT", () => {
  beforeAll(() => {
    const date = new Date(0);

    vi.useFakeTimers();
    vi.setSystemTime(date);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("should return valid result for a valid JWT", async () => {
    const generatedPayload = await generateLoginPayload(options)({
      address: TEST_ACCOUNT_B.address,
    });
    const signedPayload = await signLoginPayload({
      payload: generatedPayload,
      account: TEST_ACCOUNT_B,
    });
    const verifiedPayload = await verifyLoginPayload(options)({
      payload: signedPayload.payload,
      signature: signedPayload.signature,
    });
    if (!verifiedPayload.valid) {
      throw new Error("Invalid payload");
    }
    const jwt = await generateJWT(options)({
      payload: verifiedPayload.payload,
    });

    const result = await verifyJWT(options)({ jwt });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.parsedJWT.iss).toBe(TEST_ACCOUNT_A.address);
      expect(result.parsedJWT.sub).toBe(TEST_ACCOUNT_B.address);
      expect(result.parsedJWT).toMatchInlineSnapshot(`
        {
          "aud": "example.com",
          "ctx": {},
          "exp": 86400,
          "iat": 0,
          "iss": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "jti": "8bceec0d-37f7-48b4-a440-7be334b4dfd3",
          "nbf": -600,
          "sub": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        }
      `);
    }
  });

  test("should return invalid result for a JWT signed by the wrong admin wallet", async () => {
    const generatedPayload = await generateLoginPayload(options)({
      address: TEST_ACCOUNT_B.address,
    });
    const signedPayload = await signLoginPayload({
      payload: generatedPayload,
      account: TEST_ACCOUNT_B,
    });
    const verifiedPayload = await verifyLoginPayload(options)({
      payload: signedPayload.payload,
      signature: signedPayload.signature,
    });
    if (!verifiedPayload.valid) {
      throw new Error("Invalid payload");
    }
    // this is the wrong admin wallet!
    // we expect the verification to fail
    const jwt = await generateJWT({ ...options, adminAccount: TEST_ACCOUNT_B })(
      {
        payload: verifiedPayload.payload,
      },
    );

    const result = await verifyJWT(options)({ jwt });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatchInlineSnapshot(
        `"The expected issuer address '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' did not match the token issuer address '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'"`,
      );
    }
  });
});
