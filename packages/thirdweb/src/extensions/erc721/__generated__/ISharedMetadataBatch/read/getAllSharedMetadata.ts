import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xfc3c2a73",
  [],
  [
    {
      type: "tuple[]",
      name: "metadata",
      components: [
        {
          type: "bytes32",
          name: "id",
        },
        {
          type: "tuple",
          name: "metadata",
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
    },
  ],
] as const;

/**
 * Calls the "getAllSharedMetadata" function on the contract.
 * @param options - The options for the getAllSharedMetadata function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { getAllSharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const result = await getAllSharedMetadata();
 *
 * ```
 */
export async function getAllSharedMetadata(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
