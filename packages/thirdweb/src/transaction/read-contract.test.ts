import { describe, it, expect, vi } from "vitest";

import { USDC_CONTRACT } from "../../test/src/test-contracts.js";
import { VITALIK_WALLET } from "../../test/src/addresses.js";
import { readContract } from "./read-contract.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("transaction: read", () => {
  it("should read from the contract correctly", async () => {
    const result = await readContract({
      contract: USDC_CONTRACT,
      method: "function balanceOf(address owner) returns (uint256)",
      params: [VITALIK_WALLET],
    });

    expect(result).toMatchInlineSnapshot(`81831338n`);
    // we should have made exactly 1 network requests
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:8555",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify([
          {
            method: "eth_call",
            params: [
              {
                data: "0x70a08231000000000000000000000000ab5801a7d398351b8be11c439e05c5b3259aec9b",
                to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              },
              "latest",
            ],
            id: 0,
            jsonrpc: "2.0",
          },
        ]),
      }),
    );
  });
});
