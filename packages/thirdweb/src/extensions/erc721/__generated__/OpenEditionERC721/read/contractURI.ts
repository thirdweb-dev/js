import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "contractURI" function on the contract.
 * @param options - The options for the contractURI function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { contractURI } from "thirdweb/extensions/erc721";
 *
 * const result = await contractURI();
 *
 * ```
 */
export async function contractURI(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe8a3d485",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}
