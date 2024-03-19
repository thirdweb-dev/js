import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
    method: [
      "0x1ebb2422",
      [
        {
          type: "bytes32",
          name: "id",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.id] as const;
      }

      return [options.id] as const;
    },
  });
}
