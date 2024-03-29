import { USDC_CONTRACT } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { it, expect } from "vitest";
import { prepareContractCall } from "../prepare-contract-call.js";
import { simulateTransaction } from "./simulate.js";

it("should simulate correctly (human-readable)", async () => {
  const tx = prepareContractCall({
    contract: USDC_CONTRACT,
    method: "function transfer(address, uint256) returns (bool)",
    params: [TEST_WALLET_A, 100n],
  });
  const result = await simulateTransaction({
    transaction: tx,
    from: TEST_WALLET_A,
  });
  expect(result).toMatchInlineSnapshot(`true`);
});
