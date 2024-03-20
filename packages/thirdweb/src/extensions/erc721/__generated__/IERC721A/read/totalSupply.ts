import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x18160ddd",
  [],
  [
    {
      type: "uint256",
    },
  ],
] as const;

/**
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```
 * import { totalSupply } from "thirdweb/extensions/erc721";
 *
 * const result = await totalSupply();
 *
 * ```
 */
export async function totalSupply(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
