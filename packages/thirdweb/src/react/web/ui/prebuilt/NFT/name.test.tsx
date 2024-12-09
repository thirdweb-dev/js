import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  DROP1155_CONTRACT,
  UNISWAPV3_FACTORY_CONTRACT,
} from "~test/test-contracts.js";
import { fetchNftName } from "./name.js";

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
});
