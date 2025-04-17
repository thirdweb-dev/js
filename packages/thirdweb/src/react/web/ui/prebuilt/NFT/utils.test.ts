import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  DROP1155_CONTRACT,
  UNISWAPV3_FACTORY_CONTRACT,
} from "~test/test-contracts.js";
import { getNFTInfo } from "./utils.js";

describe.runIf(process.env.TW_SECRET_KEY)("getNFTInfo", () => {
  it("should work with ERC721", async () => {
    const nft = await getNFTInfo({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
    });
    expect(nft.metadata.name).toBe("Doodle #0");
  });

  it("should work with ERC1155", async () => {
    const nft = await getNFTInfo({
      contract: DROP1155_CONTRACT,
      tokenId: 0n,
    });
    expect(nft.metadata.name).toBe("Aura OG");
  });

  it("should throw error if failed to load nft info", async () => {
    await expect(
      getNFTInfo({ contract: UNISWAPV3_FACTORY_CONTRACT, tokenId: 0n }),
    ).rejects.toThrowError("Failed to load NFT metadata");
  });
});
