import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0xd111515d" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `freezeMetadata` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `freezeMetadata` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isFreezeMetadataSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isFreezeMetadataSupported(contract);
 * ```
 */
export async function isFreezeMetadataSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "freezeMetadata" function on the contract.
 * @param options - The options for the "freezeMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { freezeMetadata } from "thirdweb/extensions/erc721";
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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}
