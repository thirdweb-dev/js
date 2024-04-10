import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "deleteSharedMetadata" function.
 */
export type DeleteSharedMetadataParams = WithValue<{
  id: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "id" }>;
}>;

export const FN_SELECTOR = "0x1ebb2422" as const;
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
 * ```ts
 * import { encodeDeleteSharedMetadataParams } "thirdweb/extensions/erc721";
 * const result = encodeDeleteSharedMetadataParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeDeleteSharedMetadataParams(
  options: DeleteSharedMetadataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Calls the "deleteSharedMetadata" function on the contract.
 * @param options - The options for the "deleteSharedMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { deleteSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = deleteSharedMetadata({
 *  contract,
 *  id: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function deleteSharedMetadata(
  options: BaseTransactionOptions<
    | DeleteSharedMetadataParams
    | {
        asyncParams: () => Promise<DeleteSharedMetadataParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [resolvedParams.id] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
