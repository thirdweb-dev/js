import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { defineChain } from "../chains/utils.js";
import { status } from "./Status.js";

describe.runIf(process.env.TW_SECRET_KEY)("Bridge.status", () => {
  // TODO: flaky test
  it.skip("should handle successful status", async () => {
    const result = await status({
      chainId: 8453,
      client: TEST_CLIENT,
      transactionHash:
        "0x8e8ab7c998bdfef6e10951c801a862373ce87af62c21fb870e62fca57683bf10",
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("COMPLETED");
    expect(result).toMatchInlineSnapshot(`
      {
        "destinationAmount": 502590n,
        "destinationChainId": 8453,
        "destinationTokenAddress": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "originAmount": 507688n,
        "originChainId": 137,
        "originTokenAddress": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        "purchaseData": {
          "name": "Greg",
        },
        "status": "COMPLETED",
        "transactions": [
          {
            "chainId": 137,
            "transactionHash": "0x5959b9321ec581640db531b80bac53cbd968f3d34fc6cb1d5f4ea75f26df2ad7",
          },
          {
            "chainId": 8453,
            "transactionHash": "0xa3fa708d9f8e3bf4f97bb2bc04d4f6f7d27b13eb82fa29fc8596e433ed16295d",
          },
        ],
      }
    `);
  });

  it("should handle successful status with chain", async () => {
    const result = await status({
      chain: defineChain(8453),
      client: TEST_CLIENT,
      transactionHash:
        "0x8e8ab7c998bdfef6e10951c801a862373ce87af62c21fb870e62fca57683bf10",
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("COMPLETED");
  });
});
