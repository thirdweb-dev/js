import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "deleteSharedMetadata" function.
 */
export type DeleteSharedMetadataParams = {
  id: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "id";
    type: "bytes32";
  }>;
};

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
          internalType: "bytes32",
          name: "id",
          type: "bytes32",
        },
      ],
      [],
    ],
    params: [options.id],
  });
}
