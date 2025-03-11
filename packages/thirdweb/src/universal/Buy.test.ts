import { describe, expect, it } from "vitest";
import * as Buy from "./Buy.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { toWei } from "src/utils/units.js";

describe("Universal.Buy.quote", () => {
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
});

describe("Universal.Buy.prepare", () => {
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
});
