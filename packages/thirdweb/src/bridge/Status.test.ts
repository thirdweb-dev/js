import { describe, expect, it } from "vitest";
import { TEST_CLIENT } from "~test/test-clients.js";
import { status } from "./Status.js";

describe("Bridge.status", () => {
  it("should handle successful status", async () => {
    const result = await status({
      transactionHash:
        "0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d",
      chainId: 8453,
      client: TEST_CLIENT,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("COMPLETED");
    expect(result).toMatchInlineSnapshot(`
      {
        "destinationAmount": 188625148000000n,
        "destinationChainId": 2741,
        "destinationTokenAddress": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "originAmount": 200000000000000n,
        "originChainId": 8453,
        "originTokenAddress": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        "status": "COMPLETED",
        "transactions": [
          {
            "chainId": 8453,
            "transactionHash": "0xe199ef82a0b6215221536e18ec512813c1aa10b4f5ed0d4dfdfcd703578da56d",
          },
          {
            "chainId": 2741,
            "transactionHash": "0xa70a82f42330f54be95a542e1fcfe6ed2dd9f07fb8c82ae67afb4342319f7433",
          },
        ],
      }
    `);
  });
});
