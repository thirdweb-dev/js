import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "totalMinted" function on the contract.
 * @param options - The options for the totalMinted function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { totalMinted } from "thirdweb/extensions/erc721";
 *
 * const result = await totalMinted();
 *
 * ```
 */
export async function totalMinted(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa2309ff8",
      [],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}
