import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x54d1f13d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `cancelOwnershipHandover` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `cancelOwnershipHandover` method is supported.
 * @extension MODULES
 * @example
 * ```ts
 * import { isCancelOwnershipHandoverSupported } from "thirdweb/extensions/modules";
 *
 * const supported = isCancelOwnershipHandoverSupported(["0x..."]);
 * ```
 */
export function isCancelOwnershipHandoverSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "cancelOwnershipHandover" function on the contract.
 * @param options - The options for the "cancelOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @extension MODULES
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { cancelOwnershipHandover } from "thirdweb/extensions/modules";
 *
 * const transaction = cancelOwnershipHandover();
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function cancelOwnershipHandover(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
