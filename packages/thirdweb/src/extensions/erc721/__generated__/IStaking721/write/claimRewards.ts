import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

/**
 * Calls the "claimRewards" function on the contract.
 * @param options - The options for the "claimRewards" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { claimRewards } from "thirdweb/extensions/erc721";
 *
 * const transaction = claimRewards();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimRewards(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: ["0x372500ab", [], []],
    params: [],
  });
}
