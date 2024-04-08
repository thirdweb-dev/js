import { expect, it } from "vitest";
import { TEST_WALLET_A, TEST_WALLET_B } from "~test/addresses.js";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import { prepareContractCall } from "../prepare-contract-call.js";
import { simulateTransaction } from "./simulate.js";

it.runIf(process.env.TW_SECRET_KEY)(
  "should simulate correctly (human-readable)",
  async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
      method: "function approve(address, uint256)",
      params: [TEST_WALLET_B, 100n],
    });
    const result = await simulateTransaction({
      transaction: tx,
      from: TEST_WALLET_A,
    });
    expect(result).toMatchInlineSnapshot("[]");
  },
);
