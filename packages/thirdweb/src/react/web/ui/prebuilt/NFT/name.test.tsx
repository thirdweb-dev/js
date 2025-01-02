import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  DROP1155_CONTRACT,
  UNISWAPV3_FACTORY_CONTRACT,
} from "~test/test-contracts.js";
import { getFunctionId } from "../../../../../utils/function-id.js";
import { fetchNftName, getQueryKey } from "./name.js";

describe.runIf(process.env.TW_SECRET_KEY)("NFTName", () => {
  it("fetchNftName should work with ERC721", async () => {
    const desc = await fetchNftName({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
    });
    expect(desc).toBe("Doodle #0");
  });

  it("fetchNftName should work with ERC1155", async () => {
    const desc = await fetchNftName({
      contract: DROP1155_CONTRACT,
      tokenId: 0n,
    });
    expect(desc).toBe("Aura OG");
  });

  it("fetchNftName should respect nameResolver as a string", async () => {
    const desc = await fetchNftName({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
      nameResolver: "string",
    });
    expect(desc).toBe("string");
  });

  it("fetchNftName should respect nameResolver as a non-async function", async () => {
    const desc = await fetchNftName({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
      nameResolver: () => "non-async",
    });
    expect(desc).toBe("non-async");
  });

  it("fetchNftName should respect nameResolver as a async function", async () => {
    const desc = await fetchNftName({
      contract: DOODLES_CONTRACT,
      tokenId: 0n,
      nameResolver: async () => "async",
    });
    expect(desc).toBe("async");
  });

  it("fetchNftName should throw error if failed to resolve nft info", async () => {
    await expect(() =>
      fetchNftName({
        contract: UNISWAPV3_FACTORY_CONTRACT,
        tokenId: 0n,
      }),
    ).rejects.toThrowError("Failed to resolve NFT info");
  });

  it("getQueryKey should work without nameResolver", () => {
    expect(getQueryKey({ chainId: 1, tokenId: 1n })).toStrictEqual([
      "_internal_nft_name_",
      1,
      "1",
      { resolver: undefined },
    ]);
  });

  it("getQueryKey should work with nameResolver being a string", () => {
    expect(
      getQueryKey({ chainId: 1, tokenId: 1n, nameResolver: "test" }),
    ).toStrictEqual(["_internal_nft_name_", 1, "1", { resolver: "test" }]);
  });

  it("getQueryKey should work with nameResolver being a () => string", () => {
    const fn = () => "test";
    const fnId = getFunctionId(fn);
    expect(
      getQueryKey({ chainId: 1, tokenId: 1n, nameResolver: fn }),
    ).toStrictEqual(["_internal_nft_name_", 1, "1", { resolver: fnId }]);
  });

  it("getQueryKey should work with nameResolver being a async () => string", () => {
    const fn = async () => "test";
    const fnId = getFunctionId(fn);
    expect(
      getQueryKey({
        chainId: 1,
        tokenId: 1n,
        nameResolver: fn,
      }),
    ).toStrictEqual(["_internal_nft_name_", 1, "1", { resolver: fnId }]);
  });
});
