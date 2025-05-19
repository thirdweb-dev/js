import { toWei } from "src/utils/units.js";
import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import * as Onramp from "./Onramp.js";

// Use the same receiver address as other bridge tests
const RECEIVER_ADDRESS = "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709";
const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/**
 * These tests call the real Bridge Onramp API. They are executed only when a
 * `TW_SECRET_KEY` environment variable is present, mirroring the behaviour of
 * the other bridge tests in this package.
 */
describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Onramp.prepare", () => {
  it("should prepare an onramp successfully", async () => {
    const prepared = await Onramp.prepare({
      client: TEST_CLIENT,
      onramp: "stripe",
      chainId: 1,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      receiver: RECEIVER_ADDRESS,
      amount: toWei("0.01"),
    });

    expect(prepared).toBeDefined();

    // The destinationAmount should be a bigint and greater than zero
    expect(typeof prepared.destinationAmount).toBe("bigint");
    expect(prepared.destinationAmount > 0n).toBe(true);

    // A redirect link for the user should be provided
    expect(prepared.link).toBeDefined();
    expect(typeof prepared.link).toBe("string");

    // Intent must be present and reference the correct receiver
    expect(prepared.intent).toBeDefined();
    expect(prepared.intent.receiver.toLowerCase()).toBe(
      RECEIVER_ADDRESS.toLowerCase(),
    );

    // Steps array should be defined (it may be empty if the provider supports the destination token natively)
    expect(Array.isArray(prepared.steps)).toBe(true);
  });

  it("should surface any errors", async () => {
    await expect(
      Onramp.prepare({
        client: TEST_CLIENT,
        onramp: "stripe",
        chainId: 444, // Unsupported chain ID
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        receiver: RECEIVER_ADDRESS,
        amount: toWei("0.01"),
      }),
    ).rejects.toThrowError();
  });

  it("should prepare a Coinbase onramp successfully", async () => {
    const prepared = await Onramp.prepare({
      client: TEST_CLIENT,
      onramp: "coinbase",
      chainId: 1,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      receiver: RECEIVER_ADDRESS,
      amount: toWei("0.01"),
    });

    expect(prepared).toBeDefined();

    // The destinationAmount should be a bigint and greater than zero
    expect(typeof prepared.destinationAmount).toBe("bigint");
    expect(prepared.destinationAmount > 0n).toBe(true);

    // A redirect link for the user should be provided
    expect(prepared.link).toBeDefined();
    expect(typeof prepared.link).toBe("string");

    // Intent must be present and reference the correct receiver
    expect(prepared.intent).toBeDefined();
    expect(prepared.intent.receiver.toLowerCase()).toBe(
      RECEIVER_ADDRESS.toLowerCase(),
    );

    // Steps array should be defined (it may be empty if the provider supports the destination token natively)
    expect(Array.isArray(prepared.steps)).toBe(true);
  });

  it("should prepare a Transak onramp successfully", async () => {
    const prepared = await Onramp.prepare({
      client: TEST_CLIENT,
      onramp: "transak",
      chainId: 1,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      receiver: RECEIVER_ADDRESS,
      amount: toWei("0.01"),
    });

    expect(prepared).toBeDefined();

    // The destinationAmount should be a bigint and greater than zero
    expect(typeof prepared.destinationAmount).toBe("bigint");
    expect(prepared.destinationAmount > 0n).toBe(true);

    // A redirect link for the user should be provided
    expect(prepared.link).toBeDefined();
    expect(typeof prepared.link).toBe("string");

    // Intent must be present and reference the correct receiver
    expect(prepared.intent).toBeDefined();
    expect(prepared.intent.receiver.toLowerCase()).toBe(
      RECEIVER_ADDRESS.toLowerCase(),
    );

    // Steps array should be defined (it may be empty if the provider supports the destination token natively)
    expect(Array.isArray(prepared.steps)).toBe(true);
  });
});
