import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "sharedMetadata" function on the contract.
 * @param options - The options for the sharedMetadata function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { sharedMetadata } from "thirdweb/extensions/erc721";
 *
 * const result = await sharedMetadata();
 *
 * ```
 */
export async function sharedMetadata(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xb280f703",
      [],
      [
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
    ],
    params: [],
  });
}
