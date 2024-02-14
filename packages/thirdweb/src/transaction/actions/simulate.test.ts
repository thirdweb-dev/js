import { USDC_CONTRACT } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { prepareContractCall } from "../prepare-contract-call.js";
import { simulateTransaction } from "./simulate.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("transaction: simulate", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });
  it("should simulate correctly (human-readable)", async () => {
    const tx = prepareContractCall({
      contract: USDC_CONTRACT,
      method: "function transfer(address to, uint256 value) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const result = await simulateTransaction({
      transaction: tx,
      account: { address: TEST_WALLET_A },
    });
    expect(result).toMatchInlineSnapshot(`true`);

    // we should have made exactly 1 network request
    // 1. eth_call
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.lastCall?.[1]?.body).toMatchInlineSnapshot(
      `"[{"method":"eth_call","params":[{"data":"0xa9059cbb00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000064","from":"0x0000000000000000000000000000000000000001","to":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},"latest"],"id":0,"jsonrpc":"2.0"}]"`,
    );
  });
});
