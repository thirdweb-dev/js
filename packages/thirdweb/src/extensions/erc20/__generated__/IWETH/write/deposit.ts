import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

/**
 * Calls the "deposit" function on the contract.
 * @param options - The options for the "deposit" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { deposit } from "thirdweb/extensions/erc20";
 *
 * const transaction = deposit();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deposit(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: ["0xd0e30db0", [], []],
    params: [],
  });
}
