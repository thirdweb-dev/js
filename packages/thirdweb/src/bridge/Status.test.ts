import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { defineChain } from "../chains/utils.js";
import { status } from "./Status.js";

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.status", () => {
  it("should handle successful status", async () => {
    const result = await status({
      transactionHash:
        "0x7bedc4693e899fe81a22dac11301e77a12a6e772834bba5b698baf3ebcf86f7a",
      chainId: 8453,
      client: TEST_CLIENT,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("COMPLETED");
    expect(result).toMatchInlineSnapshot(`
      {
        "destinationAmount": 500000n,
        "destinationChainId": 466,
        "destinationTokenAddress": "0x675C3ce7F43b00045a4Dab954AF36160fb57cB45",
        "originAmount": 524750n,
        "originChainId": 8453,
        "originTokenAddress": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "status": "COMPLETED",
        "transactions": [
          {
            "chainId": 8453,
            "transactionHash": "0x7bedc4693e899fe81a22dac11301e77a12a6e772834bba5b698baf3ebcf86f7a",
          },
          {
            "chainId": 466,
            "transactionHash": "0xb0de713fbe44b7939b3c9cfa02c0233ea659d1163cc4462462e12eef57bc17f1",
          },
        ],
      }
    `);
  });

  it("should handle successfull status with chain", async () => {
    const result = await status({
      transactionHash:
        "0x7bedc4693e899fe81a22dac11301e77a12a6e772834bba5b698baf3ebcf86f7a",
      chain: defineChain(8453),
      client: TEST_CLIENT,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("COMPLETED");
  });
});
