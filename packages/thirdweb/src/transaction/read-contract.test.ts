import { describe, expect, it } from "vitest";

import { VITALIK_WALLET } from "../../test/src/addresses.js";
import {
  DOODLES_CONTRACT,
  USDT_CONTRACT,
} from "../../test/src/test-contracts.js";
import { readContract } from "./read-contract.js";

describe.runIf(process.env.TW_SECRET_KEY)("transaction: read", () => {
  it("should read from the contract correctly", async () => {
    const result = await readContract({
      contract: USDT_CONTRACT,
      method: "function balanceOf(address) returns (uint256)",
      params: [VITALIK_WALLET],
    });
    expect(result).toMatchInlineSnapshot("1544900798n");
  });

  it("should parse errors correctly", async () => {
    try {
      await readContract({
        contract: DOODLES_CONTRACT,
        method: "function tokenURI(uint256) returns (string)",
        params: [99999990n],
      });
    } catch (e) {
      expect((e as Error).message).eq(
        "execution reverted: revert: ERC721Metadata: URI query for nonexistent token",
      );
    }
  });
});
