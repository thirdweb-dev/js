import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "transferOwnership" function.
 */

export type TransferOwnershipParams = {
  newOwner: AbiParameterToPrimitiveType<{
    name: "newOwner";
    type: "address";
    internalType: "address";
  }>;
};

const FN_SELECTOR = "0xf2fde38b" as const;
const FN_INPUTS = [
  {
    name: "newOwner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "transferOwnership" function.
 * @param options - The options for the transferOwnership function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeTransferOwnershipParams } "thirdweb/extensions/erc721";
 * const result = encodeTransferOwnershipParams({
 *  newOwner: ...,
 * });
 * ```
 */
export function encodeTransferOwnershipParams(
  options: TransferOwnershipParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.newOwner]);
}

/**
 * Calls the "transferOwnership" function on the contract.
 * @param options - The options for the "transferOwnership" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { transferOwnership } from "thirdweb/extensions/erc721";
 *
 * const transaction = transferOwnership({
 *  contract,
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferOwnership(
  options: BaseTransactionOptions<
    | TransferOwnershipParams
    | {
        asyncParams: () => Promise<TransferOwnershipParams>;
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
            return [resolvedParams.newOwner] as const;
          }
        : [options.newOwner],
  });
}
