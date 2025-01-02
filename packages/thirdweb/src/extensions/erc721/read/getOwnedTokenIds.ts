import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {
  type BalanceOfParams,
  balanceOf,
} from "../__generated__/IERC721A/read/balanceOf.js";
import { tokensOfOwner } from "../__generated__/IERC721AQueryable/read/tokensOfOwner.js";
import { tokenOfOwnerByIndex } from "../__generated__/IERC721Enumerable/read/tokenOfOwnerByIndex.js";

/**
 * @extension ERC721
 */
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
  // try both paths, we take whichever one resolves first
  const result = await Promise.any([
    // get all the tokens owned by the owner
    tokensOfOwner({ ...options }) as Promise<bigint[]>,
    // get the balance of the owner and then fetch each token ID
    // this is the "fallback" path really
    (async () => {
      const balanceOfResult = await balanceOf(options);
      const promises: ReturnType<typeof tokenOfOwnerByIndex>[] = [];

      for (let i = 0n; i < balanceOfResult; i++) {
        promises.push(tokenOfOwnerByIndex({ ...options, index: i }));
      }

      return Promise.all(promises);
    })(),
  ]).catch(() => null);

  if (result) {
    return result;
  }

  throw new Error(
    `The contract at ${options.contract.address} on chain ${options.contract.chain.id} does not support the tokenOfOwnerByIndex or tokensOfOwner interface`,
  );
}
