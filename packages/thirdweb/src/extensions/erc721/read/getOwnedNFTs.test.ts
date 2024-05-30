import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { getOwnedNFTs } from "./getOwnedNFTs.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getOwnedNFTs", () => {
  it("should return the correct data", async () => {
    const owner = "0x3010775D16E7B79AF280035c64a1Df5F705CfdDb";
    const nfts = await getOwnedNFTs({
      contract: DOODLES_CONTRACT,
      owner,
    });

    // The following code is based on the state of the forked chain
    // so the data should not change
    expect(nfts.length).toBe(81);
    for (const item of nfts) {
      expect(item.owner).toBe(owner);
    }
  });
});
