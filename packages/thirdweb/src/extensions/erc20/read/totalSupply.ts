import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Retrieves the total supply of ERC20 tokens.
 * @param options - The transaction options.
 * @returns A promise that resolves to the total supply as a bigint.
 * @extension ERC20
 * @example
 * ```ts
 * import { totalSupply } from "thirdweb/extensions/erc20";
 * const totalTokenSupply = await totalSupply({ contract });
 * ```
 */
export function totalSupply(options: BaseTransactionOptions): Promise<bigint> {
  return readContract({
    ...options,
    method: [
  "0x18160ddd",
  [],
  [
    {
      "type": "uint256"
    }
  ]
],
  });
}
