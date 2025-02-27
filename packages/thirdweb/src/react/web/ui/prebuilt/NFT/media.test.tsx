import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  DROP1155_CONTRACT,
  UNISWAPV3_FACTORY_CONTRACT,
} from "~test/test-contracts.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { fetchNftMedia, getQueryKey } from "./media.js";

const testContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

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
    await expect(
      fetchNftMedia({
        contract: UNISWAPV3_FACTORY_CONTRACT,
        tokenId: 0n,
      }),
    ).rejects.toThrowError("Failed to resolve NFT info");
  });

  it("getQueryKey should work without mediaResolver", () => {
    expect(
      getQueryKey({
        chainId: 1,
        tokenId: 1n,
        contractAddress: testContractAddress,
      }),
    ).toStrictEqual([
      "_internal_nft_media_",
      1,
      testContractAddress,
      "1",
      {
        resolver: undefined,
      },
    ]);
  });

  it("getQueryKey should work with mediaResolver being an object", () => {
    expect(
      getQueryKey({
        contractAddress: testContractAddress,
        chainId: 1,
        tokenId: 1n,
        mediaResolver: {
          src: "test",
          poster: "test",
        },
      }),
    ).toStrictEqual([
      "_internal_nft_media_",
      1,
      testContractAddress,
      "1",
      {
        resolver: {
          src: "test",
          poster: "test",
        },
      },
    ]);
  });

  it("getQueryKey should work with mediaResolver being a function", () => {
    const fn = () => ({
      src: "test",
      poster: "test",
    });
    const fnId = getFunctionId(fn);
    expect(
      getQueryKey({
        chainId: 1,
        contractAddress: testContractAddress,
        tokenId: 1n,
        mediaResolver: fn,
      }),
    ).toStrictEqual([
      "_internal_nft_media_",
      1,
      testContractAddress,
      "1",
      {
        resolver: fnId,
      },
    ]);
  });
});
