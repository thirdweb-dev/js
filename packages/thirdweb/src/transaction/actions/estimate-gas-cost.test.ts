import { describe, expect, it } from "vitest";
import { TEST_WALLET_B } from "~test/addresses.js";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import {
  FORKED_ETHEREUM_CHAIN,
  FORKED_OPTIMISM_CHAIN,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { prepareContractCall } from "../prepare-contract-call.js";
import { prepareTransaction } from "../prepare-transaction.js";
import { estimateGasCost } from "./estimate-gas-cost.js";

describe.runIf(process.env.TW_SECRET_KEY)("estimateGasCost", () => {
  describe("normal", () => {
    it("should estimateGasCost tx correctly", async () => {
      const tx = prepareContractCall({
        contract: USDT_CONTRACT,
        method: "function approve(address, uint256) returns (bool)",
        params: [TEST_WALLET_B, 100n],
      });
      const result = await estimateGasCost({
        transaction: tx,
      });
      expect(result).toMatchInlineSnapshot(`
          {
            "ether": "0.001196638702568277",
            "wei": 1196638702568277n,
          }
        `);
    });

    it("should estimateGasCost native token", async () => {
      const tx = prepareTransaction({
        chain: FORKED_ETHEREUM_CHAIN,
        client: TEST_CLIENT,
        value: 0n,
        to: TEST_WALLET_B,
      });
      const result = await estimateGasCost({
        transaction: tx,
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "ether": "0.00052179661420146",
          "wei": 521796614201460n,
        }
      `);
    });
  });

  describe("op stack", () => {
    it("should estimateGasCost native token", async () => {
      const tx = prepareTransaction({
        chain: FORKED_OPTIMISM_CHAIN,
        client: TEST_CLIENT,
        value: 0n,
        to: TEST_WALLET_B,
      });
      const result = await estimateGasCost({
        transaction: tx,
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "ether": "0.000021198198952138",
          "wei": 21198198952138n,
        }
      `);
    });
  });
});
