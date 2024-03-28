import { USDC_CONTRACT } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { describe, it, expect } from "vitest";
import { prepareContractCall } from "../prepare-contract-call.js";
import { estimateGasCost } from "./estimate-gas-cost.js";

describe("transaction: estimateGasCost", () => {
  it("should estimateGasCost correctly", async () => {
    const tx = prepareContractCall({
      contract: USDC_CONTRACT,
      method: "function transfer(address, uint256) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const result = await estimateGasCost({
      transaction: tx,
      from: TEST_WALLET_A,
    });
    expect(result).toEqual({
      ether: "0.001003554133979864",
      wei: 1003554133979864n,
    });
  });
});
