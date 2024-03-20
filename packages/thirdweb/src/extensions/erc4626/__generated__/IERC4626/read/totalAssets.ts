import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x01e1d114",
  [],
  [
    {
      name: "totalManagedAssets",
      type: "uint256",
      internalType: "uint256",
    },
  ],
] as const;

/**
 * Calls the "totalAssets" function on the contract.
 * @param options - The options for the totalAssets function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { totalAssets } from "thirdweb/extensions/erc4626";
 *
 * const result = await totalAssets();
 *
 * ```
 */
export async function totalAssets(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
