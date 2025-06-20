import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../test/src/test-wallets.js";
import { generateJWT } from "./generate-jwt.js";
import { generateLoginPayload } from "./generate-login-payload.js";
import { signLoginPayload } from "./sign-login-payload.js";
import type { AuthOptions } from "./types.js";
import { verifyLoginPayload } from "./verify-login-payload.js";

const options: AuthOptions = {
  adminAccount: TEST_ACCOUNT_A,
  domain: "example.com",
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
};

describe("generateJWT", async () => {
  beforeAll(() => {
    const date = new Date(0);

    vi.useFakeTimers();
    vi.setSystemTime(date);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("should work with a valid login payload", async () => {
    const generatedPayload = await generateLoginPayload(options)({
      address: TEST_ACCOUNT_B.address,
    });
    const signedPayload = await signLoginPayload({
      account: TEST_ACCOUNT_B,
      payload: generatedPayload,
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
    expect(jwt).toMatchInlineSnapshot(
      `"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJleGFtcGxlLmNvbSIsImN0eCI6e30sImV4cCI6ODY0MDAsImlhdCI6MCwiaXNzIjoiMHhmMzlGZDZlNTFhYWQ4OEY2RjRjZTZhQjg4MjcyNzljZmZGYjkyMjY2IiwianRpIjoiOGJjZWVjMGQtMzdmNy00OGI0LWE0NDAtN2JlMzM0YjRkZmQzIiwibmJmIjotNjAwLCJzdWIiOiIweDcwOTk3OTcwQzUxODEyZGMzQTAxMEM3ZDAxYjUwZTBkMTdkYzc5QzgifQ.MHhhMDBhYjYyOTZhMDM3ZWQ1NmE0NzRmODM5ODFhNWRmZTgxYjRkMzU0ODAyOTIwMTE5YWYyYmQyNjE1YmI0ZjM1MzE5ZWY3YWVhYTYyYWQyZmViZTczNzA3Yzk0YWNkZTcxMmQ5M2JjMDg3ZmIwMjlmYWJlYjIxZmZkNDVkNzEwYTFi"`,
    );
  });

  test("should throw an error if no admin account is provided", async () => {
    const generatedPayload = await generateLoginPayload(options)({
      address: TEST_ACCOUNT_B.address,
    });
    const signedPayload = await signLoginPayload({
      account: TEST_ACCOUNT_B,
      payload: generatedPayload,
    });
    const verifiedPayload = await verifyLoginPayload(options)({
      payload: signedPayload.payload,
      signature: signedPayload.signature,
    });
    const optionsWithoutAdminAccount: AuthOptions = {
      domain: "example.com",
    };
    const generateJWTWithoutAdminAccount = generateJWT(
      optionsWithoutAdminAccount,
    );
    if (!verifiedPayload.valid) {
      throw new Error("Invalid payload");
    }
    try {
      await generateJWTWithoutAdminAccount({
        payload: verifiedPayload.payload,
      });
      throw new Error("Expected an error to be thrown");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        "[Error: No admin account provided. Cannot generate JWT.]",
      );
    }
  });
});
