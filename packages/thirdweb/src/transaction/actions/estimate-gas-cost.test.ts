import { describe, expect, it } from "vitest";
import { TEST_WALLET_A, TEST_WALLET_B } from "~test/addresses.js";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import { prepareContractCall } from "../prepare-contract-call.js";
import { estimateGasCost } from "./estimate-gas-cost.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "transaction: estimateGasCost",
  () => {
    it("should estimateGasCost correctly", async () => {
      const tx = prepareContractCall({
        contract: USDT_CONTRACT,
        method: "function approve(address, uint256) returns (bool)",
        params: [TEST_WALLET_B, 100n],
      });
      const result = await estimateGasCost({
        transaction: tx,
        from: TEST_WALLET_A,
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "ether": "0.001196638702568277",
          "wei": 1196638702568277n,
        }
      `);
    });
  },
);
