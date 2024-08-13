import { describe, expect, it } from "vitest";

import { defineChain } from "../../chains/utils.js";
import { createThirdwebClient } from "../../client/client.js";
import { getNFTsByOwner } from "./getNFTsByOwner.js";

describe.runIf(process.env.TW_SECRET_KEY)("indexer.getNFTsByOwner", () => {
  const SECRET_KEY = process.env.TW_SECRET_KEY as string;
  const client = createThirdwebClient({ secretKey: SECRET_KEY });

  it("gets NFTs for an address", async () => {
    const ownerAddress = "0x29FFD91a3efe09504b0b3404cf15c133a5b8b19c";
    const { nfts } = await getNFTsByOwner({
      client,
      chain: defineChain(252),
      owner: ownerAddress,
    });
    for (const nft of nfts) {
      expect(nft.id).toBeTypeOf("bigint");
      expect(nft.tokenURI).toBeTypeOf("string");
      expect(nft.type).toBeTypeOf("string");
      expect(nft.owner).toEqual(ownerAddress.toLowerCase());
      expect(nft.metadata?.chainId).toEqual(252);
      expect(nft.metadata?.balance).toBeTypeOf("bigint");
      expect(nft.metadata).toMatchObject(
        expect.objectContaining({
          id: expect.any(BigInt),
          uri: expect.any(String),
        }),
      );
    }
    expect(true).toEqual(true);
  });

  it("fails for unsupported chain", async () => {
    const ownerAddress = "0x29FFD91a3efe09504b0b3404cf15c133a5b8b19c";
    await expect(
      getNFTsByOwner({
        client,
        chain: defineChain(12312),
        owner: ownerAddress,
      }),
    ).rejects.toThrow("Fetch failed");
  });
});
