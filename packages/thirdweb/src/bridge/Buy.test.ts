import { toWei } from "src/utils/units.js";
import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import * as Buy from "./Buy.js";

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Buy.quote", () => {
  it("should get a valid quote", async () => {
    const quote = await Buy.quote({
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      buyAmountWei: toWei("0.01"),
      client: TEST_CLIENT,
    });

    expect(quote).toBeDefined();
    expect(quote.destinationAmount).toEqual(toWei("0.01"));
    expect(quote.intent).toBeDefined();
  });

  it("should surface any errors", async () => {
    await expect(
      Buy.quote({
        originChainId: 1,
        originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        destinationChainId: 10,
        destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        buyAmountWei: toWei("1000000000"),
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: AMOUNT_TOO_HIGH | The provided amount is too high for the requested route.]`,
    );
  });
});

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Buy.prepare", () => {
  it("should get a valid prepared quote", async () => {
    const quote = await Buy.prepare({
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      buyAmountWei: toWei("0.01"),
      sender: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      receiver: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      client: TEST_CLIENT,
    });

    expect(quote).toBeDefined();
    expect(quote.destinationAmount).toEqual(toWei("0.01"));
    expect(quote.transactions).toBeDefined();
    expect(quote.transactions.length).toBeGreaterThan(0);
    expect(quote.intent).toBeDefined();
  });

  it("should surface any errors", async () => {
    await expect(
      Buy.prepare({
        originChainId: 1,
        originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        destinationChainId: 10,
        destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        buyAmountWei: toWei("1000000000"),
        sender: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        receiver: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: AMOUNT_TOO_HIGH | The provided amount is too high for the requested route.]`,
    );
  });
});
