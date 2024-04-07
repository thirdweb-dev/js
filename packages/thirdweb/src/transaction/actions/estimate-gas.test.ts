import { expect, it } from "vitest";
import { TEST_WALLET_A, TEST_WALLET_B } from "~test/addresses.js";
import { USDT_CONTRACT } from "~test/test-contracts.js";
import { prepareContractCall } from "../prepare-contract-call.js";
import { estimateGas } from "./estimate-gas.js";

it.runIf(process.env.TW_SECRET_KEY)(
  "should estimate gas correctly (human-readable)",
  async () => {
    const tx = prepareContractCall({
      contract: USDT_CONTRACT,
      method: "function approve(address, uint256)",
      params: [TEST_WALLET_B, 100n],
    });
    const gasEstimate = await estimateGas({
      transaction: tx,
      from: TEST_WALLET_A,
    });
    expect(gasEstimate).toMatchInlineSnapshot("48297n");
  },
);
