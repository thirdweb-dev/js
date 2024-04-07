import { describe, expect, test } from "vitest";
import { TEST_ACCOUNT_A } from "../../test/src/test-wallets.js";
import { verifyEOASignature } from "./verifySignature.js";

describe("verifyEOASignature", () => {
  test("should return true for a valid signature", async () => {
    const message = "Hello world!";

    const signature = await TEST_ACCOUNT_A.signMessage({ message });

    const result = await verifyEOASignature({
      address: TEST_ACCOUNT_A.address,
      message,
      signature,
    });
    expect(result).toBe(true);
  });

  test("should return false for an invalid signature", async () => {
    const options = {
      message: "Hello, world!",
      signature: "invalid",
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    };

    const result = await verifyEOASignature(options);
    expect(result).toBe(false);
  });

  test("should return false for a different address", async () => {
    const message = "Hello, world!";
    const signature = await TEST_ACCOUNT_A.signMessage({ message });

    const result = await verifyEOASignature({
      address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
      message,
      signature,
    });
    expect(result).toBe(false);
  });

  test("should return false for a different message", async () => {
    const message = "Hello, world!";
    const signature = await TEST_ACCOUNT_A.signMessage({ message });

    const result = await verifyEOASignature({
      address: TEST_ACCOUNT_A.address,
      message: "Hello, world",
      signature,
    });
    expect(result).toBe(false);
  });
});
