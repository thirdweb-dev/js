import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

const METHOD = ["0xd111515d", [], []] as const;

/**
 * Calls the "freezeMetadata" function on the contract.
 * @param options - The options for the "freezeMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { freezeMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = freezeMetadata();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function freezeMetadata(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
  });
}
