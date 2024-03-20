import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x313ce567",
  [],
  [
    {
      type: "uint8",
    },
  ],
] as const;

/**
 * Calls the "decimals" function on the contract.
 * @param options - The options for the decimals function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { decimals } from "thirdweb/extensions/erc20";
 *
 * const result = await decimals();
 *
 * ```
 */
export async function decimals(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
