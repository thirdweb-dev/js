import { toWei } from "src/utils/units.js";
import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import * as Sell from "./Sell.js";

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Sell.quote", () => {
  it("should get a valid quote", async () => {
    const quote = await Sell.quote({
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      sellAmountWei: toWei("0.01"),
      client: TEST_CLIENT,
    });

    expect(quote).toBeDefined();
    expect(quote.originAmount).toEqual(toWei("0.01"));
    expect(quote.intent).toBeDefined();
  });

  it("should surface any errors", async () => {
    await expect(
      Sell.quote({
        originChainId: 1,
        originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        destinationChainId: 444,
        destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        sellAmountWei: toWei("1000000000"),
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError();
  });
});

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Sell.prepare", () => {
  it("should get a valid prepared quote", async () => {
    const quote = await Sell.prepare({
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      sellAmountWei: toWei("0.01"),
      sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      client: TEST_CLIENT,
    });

    expect(quote).toBeDefined();
    expect(quote.originAmount).toEqual(toWei("0.01"));
    expect(quote.transactions).toBeDefined();
    expect(quote.transactions.length).toBeGreaterThan(0);
    expect(quote.intent).toBeDefined();
  });

  it("should surface any errors", async () => {
    await expect(
      Sell.prepare({
        originChainId: 1,
        originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        destinationChainId: 444,
        destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        sellAmountWei: toWei("1000000000"),
        sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
        receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError();
  });
});
