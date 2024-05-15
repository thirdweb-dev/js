import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { NFT } from "../../../utils/nft/parseNft.js";
import { getNFT } from "./getNFT.js";
import {
  type GetOwnedTokenIdsParams,
  getOwnedTokenIds,
} from "./getOwnedTokenIds.js";

export type GetOwnedNFTsParams = GetOwnedTokenIdsParams;

/**
 * Retrieves the owned NFTs for a given owner.
 * @param options - The options for retrieving the owned NFTs.
 * @returns A promise that resolves to an array of NFTs owned by the specified owner.
 * @extension ERC721
 * @example
 * ```ts
 * import { getOwnedNFTs } from "thirdweb/extensions/erc721";
 *
 * const ownedNFTs = await getOwnedNFTs({
 *  contract,
 *  owner: "0x1234...",
 * });
 * ```
 */
export async function getOwnedNFTs(
  options: BaseTransactionOptions<GetOwnedNFTsParams>,
): Promise<NFT[]> {
  const tokenIds = await getOwnedTokenIds(options);

  return Promise.all(
    tokenIds.map((tokenId) =>
      getNFT({
        contract: options.contract,
        tokenId,
      }).then((nft) => ({
        ...nft,
        // add the owner to the NFT since we know it
        owner: options.owner,
      })),
    ),
  );
}
