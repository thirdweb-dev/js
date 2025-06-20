import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { balanceOfBatch } from "../__generated__/IERC1155/read/balanceOfBatch.js";
import { nextTokenIdToMint } from "../__generated__/IERC1155Enumerable/read/nextTokenIdToMint.js";
import { nextTokenId } from "../__generated__/Zora1155/read/nextTokenId.js";

const DEFAULT_QUERY_ALL_COUNT = 100;

/**
 * Parameters for retrieving owned tokenIds of an ERC1155 contract.
 * @extension ERC1155
 */
export type GetOwnedTokenIdsParams = {
  /**
   * Which tokenId to start at.
   */
  start?: number;
  /**
   * The number of NFTs to retrieve.
   */
  count?: number;
  /**
   * The address of the wallet to get the NFTs of.
   */
  address: string;
};

/**
 * Retrieves the owned ERC1155 tokenIds & the owned balance of each tokenId for a given wallet address.
 * @param options - The transaction options and parameters.
 * @returns A promise that resolves to an array of ERC1155 NFTs owned by the wallet address, along with the quantity owned.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
 * const ownedTokenIds = await getOwnedTokenIds({
 *  contract,
 *  start: 0,
 *  count: 10,
 *  address: "0x123...",
 * });
 * ```
 */
export async function getOwnedTokenIds(
  options: BaseTransactionOptions<GetOwnedTokenIdsParams>,
): Promise<{ tokenId: bigint; balance: bigint }[]> {
  const maxId = await Promise.allSettled([
    nextTokenIdToMint(options),
    nextTokenId(options),
  ]).then(([_nextToMint, _next]) => {
    if (_nextToMint.status === "fulfilled") {
      return _nextToMint.value;
    }
    if (_next.status === "fulfilled") {
      return _next.value;
    }
    throw Error("Contract doesn't have required extension");
  });

  // approach is naieve, likely can be improved
  const owners: Address[] = [];
  const tokenIds: bigint[] = [];
  for (let i = 0n; i < maxId; i++) {
    owners.push(options.address);
    tokenIds.push(i);
  }

  const balances = await balanceOfBatch({
    ...options,
    owners,
    tokenIds,
  });

  let ownedBalances = balances
    .map((b, i) => {
      return {
        balance: b,
        tokenId: BigInt(i),
      };
    })
    .filter((b) => b.balance > 0);

  if (options.start || options.count) {
    const start = options?.start || 0;
    const count = options?.count || DEFAULT_QUERY_ALL_COUNT;
    ownedBalances = ownedBalances.slice(start, start + count);
  }

  return ownedBalances;
}
