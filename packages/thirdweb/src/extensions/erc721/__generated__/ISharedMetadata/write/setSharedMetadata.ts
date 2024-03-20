import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setSharedMetadata" function.
 */

type SetSharedMetadataParamsInternal = {
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

export type SetSharedMetadataParams = Prettify<
  | SetSharedMetadataParamsInternal
  | {
      asyncParams: () => Promise<SetSharedMetadataParamsInternal>;
    }
>;
const METHOD = [
  "0xa7d27d9d",
  [
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
  ],
  [],
] as const;

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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.metadata] as const;
          }
        : [options.metadata],
  });
}
