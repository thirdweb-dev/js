import { getOwnedNFTs as getInsightNFTs } from "../../../insight/index.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { NFT } from "../../../utils/nft/parseNft.js";
import { getNFT } from "./getNFT.js";
import {
  type GetOwnedTokenIdsParams,
  getOwnedTokenIds,
} from "./getOwnedTokenIds.js";

/**
 * @extension ERC721
 */
export type GetOwnedNFTsParams = GetOwnedTokenIdsParams & {
  useIndexer?: boolean;
};

/**
 * Retrieves the owned NFTs for a given owner.
 * This extension only works with ERC721 contracts that support the [`tokenOfOwnerByIndex`](https://portal.thirdweb.com/references/typescript/v5/erc721/tokenOfOwnerByIndex) method
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
  const { useIndexer = true } = options;
  if (useIndexer) {
    try {
      return await getOwnedNFTsFromInsight(options);
    } catch {
      return await getOwnedNFTsFromRPC(options);
    }
  }
  return await getOwnedNFTsFromRPC(options);
}

async function getOwnedNFTsFromRPC(
  options: BaseTransactionOptions<GetOwnedNFTsParams>,
): Promise<NFT[]> {
  const tokenIds = await getOwnedTokenIds(options);

  return Promise.all(
    tokenIds.map((tokenId) =>
      getNFT({
        contract: options.contract,
        tokenId,
        useIndexer: false,
      }).then((nft) => ({
        ...nft,
        // add the owner to the NFT since we know it
        owner: options.owner,
      })),
    ),
  );
}

async function getOwnedNFTsFromInsight(
  options: BaseTransactionOptions<GetOwnedNFTsParams>,
): Promise<NFT[]> {
  const limit = 50;
  const nfts: NFT[] = [];
  let page = 0;
  let hasMore = true;

  // TODO (insight): add support for contract address filters
  while (hasMore) {
    const pageResults = await getInsightNFTs({
      chains: [options.contract.chain],
      client: options.contract.client,
      ownerAddress: options.owner,
      queryOptions: {
        limit,
        page,
      },
    });

    nfts.push(...pageResults);

    // If we got fewer results than the limit, we've reached the end
    if (pageResults.length < limit) {
      hasMore = false;
    } else {
      page++;
    }
  }

  const results = nfts;

  return results
    .filter(
      (n) =>
        n.tokenAddress.toLowerCase() === options.contract.address.toLowerCase(),
    )
    .map((result) => ({
      ...result,
      owner: options.owner,
    }));
}
