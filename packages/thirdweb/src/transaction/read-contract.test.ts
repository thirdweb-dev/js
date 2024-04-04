import { describe, it, expect } from "vitest";

import {
  DOODLES_CONTRACT,
  USDC_CONTRACT,
} from "../../test/src/test-contracts.js";
import { VITALIK_WALLET } from "../../test/src/addresses.js";
import { readContract } from "./read-contract.js";

describe.runIf(process.env.TW_SECRET_KEY)("transaction: read", () => {
  it.skip("should read from the contract correctly", async () => {
    const result = await readContract({
      contract: USDC_CONTRACT,
      method: "function balanceOf(address) returns (uint256)",
      params: [VITALIK_WALLET],
    });
    expect(result).toMatchInlineSnapshot(`81831338n`);
  });

  it("should read from the contract 721 correctly", async () => {
    const result = await readContract({
      contract: DOODLES_CONTRACT,
      method: "function balanceOf(address) returns (uint256)",
      params: [VITALIK_WALLET],
    });
    expect(result).toMatchInlineSnapshot(0n);
  });

  it("should parse errors correctly", async () => {
    try {
      await readContract({
        contract: DOODLES_CONTRACT,
        method: "function tokenURI(uint256) returns (string)",
        params: [99999990n],
      });
    } catch (e: any) {
      expect(e.message).eq(
        "execution reverted: revert: ERC721Metadata: URI query for nonexistent token",
      );
    }
  });
});
