import { describe, expect, it } from "vitest";

import { createThirdwebClient } from "../../client/client.js";
import { getNFTsByCollection } from "./getNFTsByCollection.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "chainsaw.getNFTsByCollection",
  () => {
    const SECRET_KEY = process.env.TW_SECRET_KEY as string;
    const client = createThirdwebClient({ secretKey: SECRET_KEY });

    it("gets NFTs for collection", async () => {
      const contractAddress = "0x00000000001594c61dd8a6804da9ab58ed2483ce";
      const { nfts } = await getNFTsByCollection({
        client,
        chainIds: [252],
        contractAddresses: [contractAddress],
      });
      for (const nft of nfts) {
        expect(nft.id).toBeTypeOf("bigint");
        expect(nft.tokenURI).toBeTypeOf("string");
        expect(nft.type).toEqual("ERC721");
        expect(nft.metadata?.contractAddress).toEqual(
          contractAddress.toLowerCase(),
        );
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
      const contractAddress = "0x00000000001594c61dd8a6804da9ab58ed2483ce";
      await expect(
        getNFTsByCollection({
          client,
          chainIds: [12312],
          contractAddresses: [contractAddress],
        }),
      ).rejects.toThrow("Fetch failed");
    });
  },
);
