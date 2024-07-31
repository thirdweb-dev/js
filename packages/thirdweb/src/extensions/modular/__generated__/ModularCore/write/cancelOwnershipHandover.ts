import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x54d1f13d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `cancelOwnershipHandover` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `cancelOwnershipHandover` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isCancelOwnershipHandoverSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isCancelOwnershipHandoverSupported(contract);
 * ```
 */
export async function isCancelOwnershipHandoverSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "cancelOwnershipHandover" function on the contract.
 * @param options - The options for the "cancelOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { cancelOwnershipHandover } from "thirdweb/extensions/modular";
 *
 * const transaction = cancelOwnershipHandover();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelOwnershipHandover(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
