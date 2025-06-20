import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  DROP1155_CONTRACT,
  UNISWAPV3_FACTORY_CONTRACT,
} from "~test/test-contracts.js";
import { fetchNftDescription } from "./description.js";

describe.runIf(process.env.TW_SECRET_KEY)("NFTDescription", () => {
  it("fetchNftDescription should work with ERC721", async () => {
    const desc = await fetchNftDescription({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
    });
    expect(desc).toBe(
      "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
    );
  });

  it("fetchNftDescription should work with ERC1155", async () => {
    const desc = await fetchNftDescription({
      contract: DROP1155_CONTRACT,
      tokenId: 0n,
    });
    expect(desc).toBe("");
  });

  it("fetchNftDescription should respect descriptionResolver as a string", async () => {
    const desc = await fetchNftDescription({
      contract: DOODLES_CONTRACT,
      descriptionResolver: "string",
      tokenId: 0n,
    });
    expect(desc).toBe("string");
  });

  it("fetchNftDescription should respect descriptionResolver as a non-async function", async () => {
    const desc = await fetchNftDescription({
      contract: DOODLES_CONTRACT,
      descriptionResolver: () => "non-async",
      tokenId: 0n,
    });
    expect(desc).toBe("non-async");
  });

  it("fetchNftDescription should respect descriptionResolver as a async function", async () => {
    const desc = await fetchNftDescription({
      contract: DOODLES_CONTRACT,
      descriptionResolver: async () => "async",
      tokenId: 0n,
    });
    expect(desc).toBe("async");
  });

  it("fetchNftDescription should throw error if failed to resolve nft info", async () => {
    await expect(
      fetchNftDescription({
        contract: UNISWAPV3_FACTORY_CONTRACT,
        tokenId: 0n,
      }),
    ).rejects.toThrowError("Failed to resolve NFT info");
  });
});
