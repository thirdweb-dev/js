import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xe4fc6b6d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `distribute` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `distribute` method is supported.
 * @extension SPLIT
 * @example
 * ```ts
 * import { isDistributeSupported } from "thirdweb/extensions/split";
 *
 * const supported = await isDistributeSupported(contract);
 * ```
 */
export async function isDistributeSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "distribute" function on the contract.
 * @param options - The options for the "distribute" function.
 * @returns A prepared transaction object.
 * @extension SPLIT
 * @example
 * ```ts
 * import { distribute } from "thirdweb/extensions/split";
 *
 * const transaction = distribute();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function distribute(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
