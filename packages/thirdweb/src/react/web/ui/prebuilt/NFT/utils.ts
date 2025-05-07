import { getNFT as getNFT721 } from "../../../../../extensions/erc721/read/getNFT.js";
import { getNFT as getNFT1155 } from "../../../../../extensions/erc1155/read/getNFT.js";
import type { NFT } from "../../../../../utils/nft/parseNft.js";
import { withCache } from "../../../../../utils/promise/withCache.js";
import type { NFTProviderProps } from "./provider.js";

/**
 * @internal
 */
export async function getNFTInfo(options: NFTProviderProps): Promise<NFT> {
  return withCache(
    async () => {
      const nft = await Promise.allSettled([
        getNFT721({
          ...options,
          useIndexer: false, // TODO (insight): switch this call to only call insight once
        }),
        getNFT1155({
          ...options,
          useIndexer: false, // TODO (insight): switch this call to only call insight once
        }),
      ]).then(([possibleNFT721, possibleNFT1155]) => {
        // getNFT extension always return an NFT object
        // so we need to check if the tokenURI exists
        if (
          possibleNFT721.status === "fulfilled" &&
          possibleNFT721.value.tokenURI
        ) {
          return possibleNFT721.value;
        }
        if (
          possibleNFT1155.status === "fulfilled" &&
          possibleNFT1155.value.tokenURI
        ) {
          return possibleNFT1155.value;
        }
        throw new Error("Failed to load NFT metadata");
      });
      return nft;
    },
    {
      cacheKey: `nft_info:${options.contract.chain.id}:${options.contract.address}:${options.tokenId.toString()}`,
      cacheTime: 15 * 60 * 1000,
    },
  );
}
