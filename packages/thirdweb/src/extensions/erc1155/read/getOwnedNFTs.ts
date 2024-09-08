import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { NFT } from "../../../utils/nft/parseNft.js";
import { getNFT } from "./getNFT.js";
import {
  type GetOwnedTokenIdsParams,
  getOwnedTokenIds,
} from "./getOwnedTokenIds.js";

/**
 * Parameters for retrieving NFTs.
 * @extension ERC1155
 */
export type GetOwnedNFTsParams = GetOwnedTokenIdsParams;

/**
 * Retrieves the owned ERC1155 NFTs for a given wallet address.
 * @param options - The transaction options and parameters.
 * @returns A promise that resolves to an array of ERC1155 NFTs owned by the wallet address, along with the quantity owned.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
 * const nfts = await getOwnedNFTs({
 *  contract,
 *  start: 0,
 *  count: 10,
 *  address: "0x123...",
 * });
 * ```
 */
export async function getOwnedNFTs(
  options: BaseTransactionOptions<GetOwnedNFTsParams>,
): Promise<(NFT & { quantityOwned: bigint })[]> {
  const ownedBalances = await getOwnedTokenIds(options);

  const nfts = await Promise.all(
    ownedBalances.map((ob) => getNFT({ ...options, tokenId: ob.tokenId })),
  );

  return nfts.map((nft, index) => ({
    ...nft,
    owner: options.address,
    quantityOwned: ownedBalances[index]?.balance || 0n,
  }));
}
