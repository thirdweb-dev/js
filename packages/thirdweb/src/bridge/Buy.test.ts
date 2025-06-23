import { toWei } from "src/utils/units.js";
import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import * as Buy from "./Buy.js";

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Buy.quote", () => {
  it("should get a valid quote", async () => {
    const quote = await Buy.quote({
      amount: toWei("0.01"),
      client: TEST_CLIENT,
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    });

    expect(quote).toBeDefined();
    expect(quote.destinationAmount).toEqual(toWei("0.01"));
    expect(quote.intent).toBeDefined();
    expect(quote.steps.length).toBeGreaterThan(0);
  });

  it("should surface any errors", async () => {
    await expect(
      Buy.quote({
        amount: toWei("1000000000"),
        client: TEST_CLIENT,
        destinationChainId: 444,
        destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        originChainId: 1,
        originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      }),
    ).rejects.toThrowError();
  });

  it("should limit quotes to routes with a certain number of steps", async () => {
    const quote = await Buy.quote({
      amount: toWei("0.01"),
      client: TEST_CLIENT,
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      maxSteps: 2,
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    });

    expect(quote).toBeDefined();
    expect(quote.destinationAmount).toEqual(toWei("0.01"));
    expect(quote.intent).toBeDefined();
    expect(quote.steps.length).toBeLessThanOrEqual(2);
  });
});

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Buy.prepare", () => {
  it("should get a valid prepared quote", async () => {
    const quote = await Buy.prepare({
      amount: toWei("0.01"),
      client: TEST_CLIENT,
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      purchaseData: {
        foo: "bar",
      },
      receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
    });

    expect(quote).toBeDefined();
    expect(quote.destinationAmount).toEqual(toWei("0.01"));
    for (const step of quote.steps) {
      expect(step.transactions.length).toBeGreaterThan(0);
    }
    expect(quote.intent).toBeDefined();
  });

  it("should surface any errors", async () => {
    await expect(
      Buy.prepare({
        amount: toWei("1000000000"),
        client: TEST_CLIENT,
        destinationChainId: 444,
        destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        originChainId: 1,
        originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
        sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      }),
    ).rejects.toThrowError();
  });

  it("should limit quotes to routes with a certain number of steps", async () => {
    const quote = await Buy.prepare({
      amount: toWei("0.01"),
      client: TEST_CLIENT,
      destinationChainId: 10,
      destinationTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      maxSteps: 2,
      originChainId: 1,
      originTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
    });

    expect(quote).toBeDefined();
    expect(quote.destinationAmount).toEqual(toWei("0.01"));
    expect(quote.steps.length).toBeLessThanOrEqual(2);
    expect(quote.intent).toBeDefined();
  });
});
