import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the getAllSharedMetadata function on the contract.
 * @param options - The options for the getAllSharedMetadata function.
 * @returns The parsed result of the function call.
 * @extension ISHAREDMETADATABATCH
 * @example
 * ```
 * import { getAllSharedMetadata } from "thirdweb/extensions/ISharedMetadataBatch";
 *
 * const result = await getAllSharedMetadata();
 *
 * ```
 */
export async function getAllSharedMetadata(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xfc3c2a73",
      [],
      [
        {
          components: [
            {
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
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
          ],
          internalType: "struct ISharedMetadataBatch.SharedMetadataWithId[]",
          name: "metadata",
          type: "tuple[]",
        },
      ],
    ],
    params: [],
  });
}
