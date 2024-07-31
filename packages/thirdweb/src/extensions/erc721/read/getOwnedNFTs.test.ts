import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { defineChain } from "../../../chains/utils.js";
import { getContract } from "../../../contract/contract.js";
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

  it("should detect ownership functions", async () => {
    const contract = getContract({
      client: TEST_CLIENT,
      chain: defineChain(421614),
      address: "0x90450885977EE8F8F21AC79Fc2Dd51a18B13123E",
    });

    const ownedNFTs = await getOwnedNFTs({
      contract,
      owner: "0x1813D5Ff6f2B229a6Ba8FcDFa14004d91aa58e36",
    });
    expect(ownedNFTs.length).greaterThan(0);
  });
});
