import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setSharedMetadata" function.
 */
export type SetSharedMetadataParams = {
  metadata: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "string"; name: "name"; type: "string" },
      { internalType: "string"; name: "description"; type: "string" },
      { internalType: "string"; name: "imageURI"; type: "string" },
      { internalType: "string"; name: "animationURI"; type: "string" },
    ];
    internalType: "struct ISharedMetadataBatch.SharedMetadataInfo";
    name: "metadata";
    type: "tuple";
  }>;
  id: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "id";
    type: "bytes32";
  }>;
};

/**
 * Calls the setSharedMetadata function on the contract.
 * @param options - The options for the setSharedMetadata function.
 * @returns A prepared transaction object.
 * @extension ISHAREDMETADATABATCH
 * @example
 * ```
 * import { setSharedMetadata } from "thirdweb/extensions/ISharedMetadataBatch";
 *
 * const transaction = setSharedMetadata({
 *  metadata: ...,
 *  id: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setSharedMetadata(
  options: BaseTransactionOptions<SetSharedMetadataParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x696b0c1a",
      [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "string",
              name: "imageURI",
              type: "string",
            },
            {
              internalType: "string",
              name: "animationURI",
              type: "string",
            },
          ],
          internalType: "struct ISharedMetadataBatch.SharedMetadataInfo",
          name: "metadata",
          type: "tuple",
        },
        {
          internalType: "bytes32",
          name: "id",
          type: "bytes32",
        },
      ],
      [],
    ],
    params: [options.metadata, options.id],
  });
}
