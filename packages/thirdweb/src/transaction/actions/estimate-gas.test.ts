import { USDC_CONTRACT } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { it, expect } from "vitest";
import { estimateGas } from "./estimate-gas.js";
import { prepareContractCall } from "../prepare-contract-call.js";

it.runIf(process.env.TW_SECRET_KEY)(
  "should estimate gas correctly (human-readable)",
  async () => {
    const tx = prepareContractCall({
      contract: USDC_CONTRACT,
      method: "function transfer(address, uint256) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const gasEstimate = await estimateGas({
      transaction: tx,
      from: TEST_WALLET_A,
    });
    expect(gasEstimate).toMatchInlineSnapshot(`40504n`);
  },
);
