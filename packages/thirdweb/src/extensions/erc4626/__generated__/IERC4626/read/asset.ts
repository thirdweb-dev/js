import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x38d52e0f",
  [],
  [
    {
      name: "assetTokenAddress",
      type: "address",
      internalType: "contract ERC20",
    },
  ],
] as const;

/**
 * Calls the "asset" function on the contract.
 * @param options - The options for the asset function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```
 * import { asset } from "thirdweb/extensions/erc4626";
 *
 * const result = await asset();
 *
 * ```
 */
export async function asset(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
