import { toWei } from "src/utils/units.js";
import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import * as Transfer from "./Transfer.js";

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.Transfer.prepare", () => {
  it("should get a valid prepared quote", async () => {
    const quote = await Transfer.prepare({
      chainId: 1,
      tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amount: toWei("0.01"),
      sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      client: TEST_CLIENT,
      purchaseData: {
        reference: "test-transfer",
      },
    });

    expect(quote).toBeDefined();
    expect(quote.intent.amount).toEqual(toWei("0.01"));
    for (const step of quote.steps) {
      expect(step.transactions.length).toBeGreaterThan(0);
    }
    expect(quote.intent).toBeDefined();
  });

  it("should surface any errors", async () => {
    await expect(
      Transfer.prepare({
        chainId: 444, // Invalid chain ID
        tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        amount: toWei("1000000000"),
        sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
        receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
        client: TEST_CLIENT,
      }),
    ).rejects.toThrowError();
  });

  it("should support the feePayer option", async () => {
    const senderQuote = await Transfer.prepare({
      chainId: 1,
      tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amount: toWei("0.01"),
      sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      feePayer: "sender",
      client: TEST_CLIENT,
    });

    expect(senderQuote).toBeDefined();
    expect(senderQuote.intent.feePayer).toBe("sender");

    const receiverQuote = await Transfer.prepare({
      chainId: 1,
      tokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amount: toWei("0.01"),
      sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
      feePayer: "receiver",
      client: TEST_CLIENT,
    });

    expect(receiverQuote).toBeDefined();
    expect(receiverQuote.intent.feePayer).toBe("receiver");

    // When receiver pays fees, the destination amount should be less than the requested amount
    expect(receiverQuote.destinationAmount).toBeLessThan(toWei("0.01"));

    // When sender pays fees, the origin amount should be more than the requested amount
    // and the destination amount should equal the requested amount
    expect(senderQuote.originAmount).toBeGreaterThan(toWei("0.01"));
    expect(senderQuote.destinationAmount).toEqual(toWei("0.01"));
  });
});
