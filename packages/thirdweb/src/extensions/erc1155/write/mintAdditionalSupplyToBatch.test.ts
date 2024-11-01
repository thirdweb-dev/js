import { describe, expect, it } from "vitest";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { optimizeMintBatchContent } from "./mintAdditionalSupplyToBatch.js";

const account = TEST_ACCOUNT_C;

describe("ERC1155 Edition: mintToBatch", () => {
  it("should optimize the mint content", () => {
    expect(
      optimizeMintBatchContent([
        { tokenId: 0n, supply: 99n, to: account.address },
        { tokenId: 1n, supply: 49n, to: account.address },
        { tokenId: 1n, supply: 51n, to: account.address },
      ]),
    ).toStrictEqual([
      { tokenId: 0n, supply: 99n, to: account.address },
      { tokenId: 1n, supply: 100n, to: account.address },
    ]);
  });
});
