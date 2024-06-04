import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x25692962" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `requestOwnershipHandover` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `requestOwnershipHandover` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isRequestOwnershipHandoverSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isRequestOwnershipHandoverSupported(contract);
 * ```
 */
export async function isRequestOwnershipHandoverSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "requestOwnershipHandover" function on the contract.
 * @param options - The options for the "requestOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { requestOwnershipHandover } from "thirdweb/extensions/modular";
 *
 * const transaction = requestOwnershipHandover();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function requestOwnershipHandover(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
