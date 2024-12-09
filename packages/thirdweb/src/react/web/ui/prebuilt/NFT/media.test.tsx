import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  DROP1155_CONTRACT,
  UNISWAPV3_FACTORY_CONTRACT,
} from "~test/test-contracts.js";
import { fetchNftMedia } from "./media.js";

describe.runIf(process.env.TW_SECRET_KEY)("NFTMedia", () => {
  it("fetchNftMedia should work with ERC721", async () => {
    const desc = await fetchNftMedia({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
    });
    expect(desc).toStrictEqual({
      src: "ipfs://QmUEfFfwAh4wyB5UfHCVPUxis4j4Q4kJXtm5x5p3g1fVUn",
      poster: undefined,
    });
  });

  it("fetchNftMedia should work with ERC1155", async () => {
    const desc = await fetchNftMedia({
      contract: DROP1155_CONTRACT,
      tokenId: 0n,
    });
    expect(desc).toStrictEqual({
      src: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/1.mp4",
      poster: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/0.png",
    });
  });

  it("fetchNftMedia should respect mediaResolver as a string", async () => {
    const desc = await fetchNftMedia({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
      mediaResolver: {
        src: "string",
        poster: undefined,
      },
    });
    expect(desc).toStrictEqual({ src: "string", poster: undefined });
  });

  it("fetchNftMedia should respect mediaResolver as a non-async function", async () => {
    const desc = await fetchNftMedia({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
      mediaResolver: () => ({
        src: "non-async",
        poster: undefined,
      }),
    });
    expect(desc).toStrictEqual({ src: "non-async", poster: undefined });
  });

  it("fetchNftMedia should respect mediaResolver as a async function", async () => {
    const desc = await fetchNftMedia({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
      mediaResolver: async () =>
        await {
          src: "async",
          poster: undefined,
        },
    });
    expect(desc).toStrictEqual({ src: "async", poster: undefined });
  });

  it("fetchNftMedia should throw error if failed to resolve nft info", async () => {
    await expect(() =>
      fetchNftMedia({
        contract: UNISWAPV3_FACTORY_CONTRACT,
        tokenId: 0n,
      }),
    ).rejects.toThrowError("Failed to resolve NFT info");
  });
});
