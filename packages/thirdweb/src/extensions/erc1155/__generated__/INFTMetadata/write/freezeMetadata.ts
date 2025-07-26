import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xd111515d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `freezeMetadata` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `freezeMetadata` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isFreezeMetadataSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isFreezeMetadataSupported(["0x..."]);
 * ```
 */
export function isFreezeMetadataSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "freezeMetadata" function on the contract.
 * @param options - The options for the "freezeMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { freezeMetadata } from "thirdweb/extensions/erc1155";
 *
 * const transaction = freezeMetadata();
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function freezeMetadata(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
