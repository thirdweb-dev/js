import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  type BalanceOfParams,
  balanceOf,
} from "../__generated__/IERC721A/read/balanceOf.js";
import { tokenOfOwnerByIndex } from "../__generated__/IERC721Enumerable/read/tokenOfOwnerByIndex.js";

export type GetOwnedTokenIdsParams = BalanceOfParams;

/**
 * Retrieves the token IDs owned by a specific address.
 * @param options - The options for retrieving the owned token IDs.
 * @returns A promise that resolves to an array of bigint representing the owned token IDs.
 * @extension ERC721
 * @example
 * ```ts
 * import { getOwnedTokenIds } from "thirdweb/extensions/erc721";
 *
 * const ownedTokenIds = await getOwnedTokenIds({
 *  contract,
 *  owner: "0x1234...",
 * });
 * ```
 */
export async function getOwnedTokenIds(
  options: BaseTransactionOptions<GetOwnedTokenIdsParams>,
): Promise<bigint[]> {
  const balanceOfResult = await balanceOf(options);

  const promises: ReturnType<typeof tokenOfOwnerByIndex>[] = [];

  for (let i = 0n; i < balanceOfResult; i++) {
    promises.push(tokenOfOwnerByIndex({ ...options, index: i }));
  }

  return Promise.all(promises);
}
