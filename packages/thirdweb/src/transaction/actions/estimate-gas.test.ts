import { USDC_CONTRACT } from "~test/test-contracts.js";
import { TEST_WALLET_A } from "~test/addresses.js";
import { describe, it, expect, vi } from "vitest";
import { estimateGas } from "./estimate-gas.js";
import { prepareContractCall } from "../transaction.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("transaction: estimate-gas", () => {
  it("should estimate gas correctly (human-readable)", async () => {
    const tx = prepareContractCall({
      contract: USDC_CONTRACT,
      method: "function transfer(address to, uint256 value) returns (bool)",
      params: [TEST_WALLET_A, 100n],
    });
    const estimate = await estimateGas({
      transaction: tx,
      account: { address: TEST_WALLET_A },
    });
    expect(estimate).toMatchInlineSnapshot(`40504n`);
    // we should have made exactly 2 network requests
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy).toHaveBeenNthCalledWith(
      1,
      "http://localhost:8555",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([
          {
            method: "eth_getBlockByNumber",
            params: ["latest", false],
            id: 0,
            jsonrpc: "2.0",
          },
          { method: "eth_maxPriorityFeePerGas", id: 1, jsonrpc: "2.0" },
        ]),
      }),
    );
  });
});
