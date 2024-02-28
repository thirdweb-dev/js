import { nextTokenIdToMint } from "./nextTokenIdToMint.js";
import { getNFT } from "./getNFT.js";
import type { NFT } from "../../../utils/nft/parseNft.js";
import { min } from "../../../utils/bigint.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

/**
 * Parameters for retrieving NFTs.
 */
export type GetNFTsParams = {
  /**
   * Which tokenId to start at.
   */
  start?: number;
  /**
   * The number of NFTs to retrieve.
   */
  count?: number;
};

/**
 * Retrieves an array of NFTs ("ERC1155") based on the provided options.
 * @param options - The options for retrieving the NFTs.
 * @returns A promise that resolves to an array of NFTs.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getNFTs } from "thirdweb/extensions/erc1155";
 * const nfts = await getNFTs({
 *  contract,
 *  start: 0,
 *  count: 10,
 * });
 * ```
 */
export async function getNFTs(
  options: BaseTransactionOptions<GetNFTsParams>,
): Promise<NFT[]> {
  const start = BigInt(options.start || 0);
  const count = BigInt(options.count || DEFAULT_QUERY_ALL_COUNT);
  const totalCount = await nextTokenIdToMint(options);
  const maxId = min(totalCount, start + count);

  const promises: ReturnType<typeof getNFT>[] = [];

  for (let i = start; i < maxId; i++) {
    promises.push(
      getNFT({
        ...options,
        tokenId: i,
      }),
    );
  }

  return await Promise.all(promises);
}
