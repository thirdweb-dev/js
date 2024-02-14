import { USDC_CONTRACT } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { estimateGas } from "./estimate-gas.js";
import { prepareContractCall } from "../prepare-contract-call.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("transaction: estimate-gas", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });
  it("should estimate gas correctly (human-readable)", async () => {
    const tx = prepareContractCall({
      contract: USDC_CONTRACT,
      method: "function transfer(address to, uint256 value) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const gasEstimate = await estimateGas({
      transaction: tx,
      account: { address: TEST_WALLET_A },
    });
    expect(gasEstimate).toMatchInlineSnapshot(`40504n`);
    // we should have made exactly 1 network request
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.lastCall?.[1]?.body).toMatchInlineSnapshot(`"[{"method":"eth_estimateGas","params":[{"to":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","data":"0xa9059cbb00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064","from":"0x0000000000000000000000000000000000000001"}],"id":0,"jsonrpc":"2.0"}]"`);
  });
});
