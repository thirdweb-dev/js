import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { nextTokenIdToMint } from "../__generated__/IERC721Enumerable/read/nextTokenIdToMint.js";
import { getTotalClaimedSupply } from "./getTotalClaimedSupply.js";

/**
 * Retrieves the total unclaimed supply of ERC721 tokens.
 * @param options - The base transaction options.
 * @returns A promise that resolves to the total unclaimed supply as a bigint.
 * @extension ERC721
 * @example
 *
 * ```ts
 * import { getTotalUnclaimedSupply } from "thirdweb/extensions/erc721";
 *
 * const totalUnclaimedSupply = await getTotalUnclaimedSupply({
 *  contract,
 * });
 */
export async function getTotalUnclaimedSupply(
  options: BaseTransactionOptions,
): Promise<bigint> {
  const [nextTokenIdToMint_, totalClaimedSupply_] = await Promise.all([
    nextTokenIdToMint(options),
    getTotalClaimedSupply(options),
  ]);
  return nextTokenIdToMint_ - totalClaimedSupply_;
}
