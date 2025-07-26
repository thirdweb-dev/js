import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x5585258d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `stylus_constructor` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `stylus_constructor` method is supported.
 * @extension STYLUS
 * @example
 * ```ts
 * import { isStylus_constructorSupported } from "thirdweb/extensions/stylus";
 *
 * const supported = isStylus_constructorSupported(["0x..."]);
 * ```
 */
export function isStylus_constructorSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "stylus_constructor" function on the contract.
 * @param options - The options for the "stylus_constructor" function.
 * @returns A prepared transaction object.
 * @extension STYLUS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { stylus_constructor } from "thirdweb/extensions/stylus";
 *
 * const transaction = stylus_constructor();
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function stylus_constructor(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
