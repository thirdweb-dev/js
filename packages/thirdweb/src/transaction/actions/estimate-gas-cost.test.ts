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
          "ether": "0.002468675264234022",
          "wei": 2468675264234022n,
        }
      `);
    });

    it("should estimateGasCost native token", async () => {
      const tx = prepareTransaction({
        chain: FORKED_ETHEREUM_CHAIN,
        client: TEST_CLIENT,
        to: TEST_WALLET_B,
        value: 0n,
      });
      const result = await estimateGasCost({
        transaction: tx,
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "ether": "0.00107647061028156",
          "wei": 1076470610281560n,
        }
      `);
    });
  });

  describe("op stack", () => {
    it("should estimateGasCost native token", async () => {
      const tx = prepareTransaction({
        chain: FORKED_OPTIMISM_CHAIN,
        client: TEST_CLIENT,
        to: TEST_WALLET_B,
        value: 0n,
      });
      const result = await estimateGasCost({
        transaction: tx,
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "ether": "0.000023420415571618",
          "wei": 23420415571618n,
        }
      `);
    });
  });
});
