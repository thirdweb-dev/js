import { describe, expect, it } from "vitest";

import { DROP1155_CONTRACT } from "~test/test-contracts.js";
import { getOwnedNFTs } from "./getOwnedNFTs.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc1155.getOwnedNFTs", () => {
  it("with indexer", async () => {
    const nfts = await getOwnedNFTs({
      address: "0x00d4da27dedce60f859471d8f595fdb4ae861557",
      contract: DROP1155_CONTRACT,
    });
    expect(nfts.length).toBe(3);
    expect(nfts.find((nft) => nft.id === 4n)?.quantityOwned).toBe(411n);
  });

  it("without indexer", async () => {
    const nfts = await getOwnedNFTs({
      address: "0x00d4da27dedce60f859471d8f595fdb4ae861557",
      contract: DROP1155_CONTRACT,
      useIndexer: false,
    });
    expect(nfts.length).toBe(3);
    expect(nfts.find((nft) => nft.id === 4n)?.quantityOwned).toBe(411n);
  });
});
