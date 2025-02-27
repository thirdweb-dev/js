import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  UNISWAPV3_FACTORY_CONTRACT,
} from "~test/test-contracts.js";
import { TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { getOwnedTokenIds } from "./getOwnedTokenIds.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getOwnedTokenIds", () => {
  it("should return the correct result", async () => {
    const owner = "0x3010775D16E7B79AF280035c64a1Df5F705CfdDb";
    const tokenIds = await getOwnedTokenIds({
      contract: DOODLES_CONTRACT,
      owner,
    });

    // The following code is based on the state of the forked chain
    // so the data should not change
    expect(tokenIds.length).toBe(81);
  });

  it("should throw if tokenOfOwnerByIndex or tokensOfOwner not supported", async () => {
    // We know current Lens contract on Polygon doesn't have this.
    const contract = UNISWAPV3_FACTORY_CONTRACT;
    await expect(
      getOwnedTokenIds({ contract, owner: TEST_ACCOUNT_B.address }),
    ).rejects.toThrowError(
      `The contract at ${contract.address} on chain ${contract.chain.id} does not support the tokenOfOwnerByIndex or tokensOfOwner interface`,
    );
  });
});
