import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

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
    method: $run$(() =>
      prepareMethod("function totalSupply() returns (uint256)"),
    ),
  });
}
