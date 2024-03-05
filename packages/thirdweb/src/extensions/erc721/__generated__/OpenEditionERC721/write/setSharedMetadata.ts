import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
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
    internalType: "struct ISharedMetadata.SharedMetadataInfo";
    name: "_metadata";
    type: "tuple";
  }>;
};

/**
 * Calls the "setSharedMetadata" function on the contract.
 * @param options - The options for the "setSharedMetadata" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { setSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const transaction = setSharedMetadata({
 *  metadata: ...,
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
      "0xa7d27d9d",
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
          internalType: "struct ISharedMetadata.SharedMetadataInfo",
          name: "_metadata",
          type: "tuple",
        },
      ],
      [],
    ],
    params: [options.metadata],
  });
}
