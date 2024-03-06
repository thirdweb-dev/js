import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "getAllExtensions" function on the contract.
 * @param options - The options for the getAllExtensions function.
 * @returns The parsed result of the function call.
 * @extension ERC7504
 * @example
 * ```
 * import { getAllExtensions } from "thirdweb/extensions/erc7504";
 *
 * const result = await getAllExtensions();
 *
 * ```
 */
export async function getAllExtensions(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4a00cc48",
      [],
      [
        {
          type: "tuple[]",
          name: "allExtensions",
          components: [
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
                  name: "metadataURI",
                },
                {
                  type: "address",
                  name: "implementation",
                },
              ],
            },
            {
              type: "tuple[]",
              name: "functions",
              components: [
                {
                  type: "bytes4",
                  name: "functionSelector",
                },
                {
                  type: "string",
                  name: "functionSignature",
                },
              ],
            },
          ],
        },
      ],
    ],
    params: [],
  });
}
