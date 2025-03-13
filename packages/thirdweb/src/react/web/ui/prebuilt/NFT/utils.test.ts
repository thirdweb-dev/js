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
    expect(nft).toStrictEqual({
      id: 0n,
      metadata: {
        attributes: [
          {
            trait_type: "face",
            value: "mustache",
          },
          {
            trait_type: "hair",
            value: "purple long",
          },
          {
            trait_type: "body",
            value: "blue and yellow jacket",
          },
          {
            trait_type: "background",
            value: "green",
          },
          {
            trait_type: "head",
            value: "tan",
          },
        ],
        description:
          "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
        image: "ipfs://QmUEfFfwAh4wyB5UfHCVPUxis4j4Q4kJXtm5x5p3g1fVUn",
        name: "Doodle #0",
      },
      owner: null,
      tokenURI: "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/0",
      type: "ERC721",
    });
  });

  it("should work with ERC1155", async () => {
    const nft = await getNFTInfo({
      contract: DROP1155_CONTRACT,
      tokenId: 0n,
    });
    expect(nft).toStrictEqual({
      id: 0n,
      metadata: {
        animation_url:
          "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/1.mp4",
        attributes: [
          {
            trait_type: "Revenue Share",
            value: "40%",
          },
          {
            trait_type: "Max Supply",
            value: "50",
          },
          {
            trait_type: "Max Per Wallet",
            value: "1",
          },
        ],
        background_color: "",
        description: "",
        external_url: "https://auraexchange.org",
        image: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/0.png",
        name: "Aura OG",
      },
      owner: null,
      supply: 33n,
      tokenURI: "ipfs://QmNgevzVNwJWJdErFY2B7KsuKdJz3gVuBraNKaSxPktLh5/0",
      type: "ERC1155",
    });
  });

  it("should throw error if failed to load nft info", async () => {
    await expect(
      getNFTInfo({ contract: UNISWAPV3_FACTORY_CONTRACT, tokenId: 0n }),
    ).rejects.toThrowError("Failed to load NFT metadata");
  });
});
