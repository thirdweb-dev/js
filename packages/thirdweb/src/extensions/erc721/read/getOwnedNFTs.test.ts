import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { getOwnedNFTs } from "./getOwnedNFTs.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getAllOwners", () => {
  it("works for a contract with 0 indexed NFTs", async () => {
    const owner = "0x3010775D16E7B79AF280035c64a1Df5F705CfdDb";
    const nfts = await getOwnedNFTs({
      contract: DOODLES_CONTRACT,
      owner,
    });

    // The following code is based on the test result from "./getAllOwners.test.ts"
    expect(nfts.length).toBe(1);
    expect(nfts[0]?.owner).toBe(owner);
  });
});
