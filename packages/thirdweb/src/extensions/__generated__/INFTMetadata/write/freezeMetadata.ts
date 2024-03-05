import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";

/**
 * Calls the freezeMetadata function on the contract.
 * @param options - The options for the freezeMetadata function.
 * @returns A prepared transaction object.
 * @extension INFTMETADATA
 * @example
 * ```
 * import { freezeMetadata } from "thirdweb/extensions/INFTMetadata";
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
    method: ["0xd111515d", [], []],
    params: [],
  });
}
