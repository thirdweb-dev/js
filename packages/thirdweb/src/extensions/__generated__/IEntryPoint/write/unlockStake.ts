import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";

/**
 * Calls the unlockStake function on the contract.
 * @param options - The options for the unlockStake function.
 * @returns A prepared transaction object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { unlockStake } from "thirdweb/extensions/IEntryPoint";
 *
 * const transaction = unlockStake();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function unlockStake(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: ["0xbb9fe6bf", [], []],
    params: [],
  });
}
