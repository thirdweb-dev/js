import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "deleteSharedMetadata" function.
 */

type DeleteSharedMetadataParamsInternal = {
  id: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "id" }>;
};

export type DeleteSharedMetadataParams = Prettify<
  | DeleteSharedMetadataParamsInternal
  | {
      asyncParams: () => Promise<DeleteSharedMetadataParamsInternal>;
    }
>;
const FN_SELECTOR = "0x1ebb2422" as const;
const FN_INPUTS = [
  {
    type: "bytes32",
    name: "id",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "deleteSharedMetadata" function.
 * @param options - The options for the deleteSharedMetadata function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```
 * import { encodeDeleteSharedMetadataParams } "thirdweb/extensions/erc721";
 * const result = encodeDeleteSharedMetadataParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeDeleteSharedMetadataParams(
  options: DeleteSharedMetadataParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Calls the "deleteSharedMetadata" function on the contract.
 * @param options - The options for the "deleteSharedMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { deleteSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = deleteSharedMetadata({
 *  id: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deleteSharedMetadata(
  options: BaseTransactionOptions<DeleteSharedMetadataParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.id] as const;
          }
        : [options.id],
  });
}
