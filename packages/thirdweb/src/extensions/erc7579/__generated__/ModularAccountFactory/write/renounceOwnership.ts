import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x715018a6" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `renounceOwnership` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `renounceOwnership` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isRenounceOwnershipSupported } from "thirdweb/extensions/erc7579";
 *
 * const supported = isRenounceOwnershipSupported(["0x..."]);
 * ```
 */
export function isRenounceOwnershipSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "renounceOwnership" function on the contract.
 * @param options - The options for the "renounceOwnership" function.
 * @returns A prepared transaction object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { renounceOwnership } from "thirdweb/extensions/erc7579";
 *
 * const transaction = renounceOwnership();
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function renounceOwnership(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
