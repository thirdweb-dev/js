import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "completeOwnershipHandover" function.
 */

export type CompleteOwnershipHandoverParams = {
  pendingOwner: AbiParameterToPrimitiveType<{
    name: "pendingOwner";
    type: "address";
    internalType: "address";
  }>;
};

const FN_SELECTOR = "0xf04e283e" as const;
const FN_INPUTS = [
  {
    name: "pendingOwner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "completeOwnershipHandover" function.
 * @param options - The options for the completeOwnershipHandover function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeCompleteOwnershipHandoverParams } "thirdweb/extensions/erc721";
 * const result = encodeCompleteOwnershipHandoverParams({
 *  pendingOwner: ...,
 * });
 * ```
 */
export function encodeCompleteOwnershipHandoverParams(
  options: CompleteOwnershipHandoverParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.pendingOwner]);
}

/**
 * Calls the "completeOwnershipHandover" function on the contract.
 * @param options - The options for the "completeOwnershipHandover" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { completeOwnershipHandover } from "thirdweb/extensions/erc721";
 *
 * const transaction = completeOwnershipHandover({
 *  contract,
 *  pendingOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function completeOwnershipHandover(
  options: BaseTransactionOptions<
    | CompleteOwnershipHandoverParams
    | {
        asyncParams: () => Promise<CompleteOwnershipHandoverParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.pendingOwner] as const;
          }
        : [options.pendingOwner],
  });
}
