import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setSharedMetadata" function.
 */

export type SetSharedMetadataParams = {
  metadata: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_metadata";
    components: [
      { type: "string"; name: "name" },
      { type: "string"; name: "description" },
      { type: "string"; name: "imageURI" },
      { type: "string"; name: "animationURI" },
    ];
  }>;
};

export const FN_SELECTOR = "0xa7d27d9d" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "_metadata",
    components: [
      {
        type: "string",
        name: "name",
      },
      {
        type: "string",
        name: "description",
      },
      {
        type: "string",
        name: "imageURI",
      },
      {
        type: "string",
        name: "animationURI",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setSharedMetadata" function.
 * @param options - The options for the setSharedMetadata function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeSetSharedMetadataParams } "thirdweb/extensions/erc721";
 * const result = encodeSetSharedMetadataParams({
 *  metadata: ...,
 * });
 * ```
 */
export function encodeSetSharedMetadataParams(
  options: SetSharedMetadataParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.metadata]);
}

/**
 * Calls the "setSharedMetadata" function on the contract.
 * @param options - The options for the "setSharedMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { setSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = setSharedMetadata({
 *  contract,
 *  metadata: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setSharedMetadata(
  options: BaseTransactionOptions<
    | SetSharedMetadataParams
    | {
        asyncParams: () => Promise<SetSharedMetadataParams>;
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
            return [resolvedParams.metadata] as const;
          }
        : [options.metadata],
  });
}
