import { maxUint256 } from "ox/Solidity";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { min } from "../../../utils/bigint.js";
import type { NFT } from "../../../utils/nft/parseNft.js";
import {
  isNextTokenIdToMintSupported,
  nextTokenIdToMint,
} from "../__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { getNFT, isGetNFTSupported } from "./getNFT.js";

const DEFAULT_QUERY_ALL_COUNT = 100n;

/**
 * Parameters for retrieving NFTs.
 * @extension ERC1155
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
  // try to get the totalCount (non-standard) - if this fails then just use maxUint256
  const totalCount = await nextTokenIdToMint(options).catch(() => maxUint256);
  // get the maxId to query up to (either the totalCount or the start + count, whichever is smaller)
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

/**
 * Checks if the `getNFTs` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getNFTs` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isGetNFTsSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = isGetNFTsSupported(["0x..."]);
 * ```
 */
export function isGetNFTsSupported(availableSelectors: string[]) {
  return (
    isGetNFTSupported(availableSelectors) &&
    isNextTokenIdToMintSupported(availableSelectors)
  );
}
