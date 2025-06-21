import { getOwnedNFTs as getInsightNFTs } from "../../../insight/get-nfts.js";
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
export type GetOwnedNFTsParams = GetOwnedTokenIdsParams & {
  /**
   * Whether to use the insight API to fetch the NFTs.
   * @default true
   */
  useIndexer?: boolean;
};

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

async function getOwnedNFTsFromInsight(
  options: BaseTransactionOptions<GetOwnedNFTsParams>,
): Promise<(NFT & { quantityOwned: bigint })[]> {
  const limit = 50;
  const nfts: (NFT & { quantityOwned: bigint })[] = [];
  let page = 0;
  let hasMore = true;

  // TODO (insight): add support for contract address filters
  while (hasMore) {
    const pageResults = await getInsightNFTs({
      chains: [options.contract.chain],
      client: options.contract.client,
      ownerAddress: options.address,
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
      owner: options.address,
    }));
}

async function getOwnedNFTsFromRPC(
  options: BaseTransactionOptions<GetOwnedNFTsParams>,
): Promise<(NFT & { quantityOwned: bigint })[]> {
  const ownedBalances = await getOwnedTokenIds(options);

  const nfts = await Promise.all(
    ownedBalances.map((ob) =>
      getNFT({ ...options, tokenId: ob.tokenId, useIndexer: false }),
    ),
  );

  return nfts.map((nft, index) => ({
    ...nft,
    owner: options.address,
    quantityOwned: ownedBalances[index]?.balance || 0n,
  }));
}
