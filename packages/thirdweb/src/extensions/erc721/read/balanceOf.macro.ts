import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for the balanceOf function.
 */
export type BalanceOfParams = {
  /**
   * The address for which the balance is being queried.
   */
  address: string;
};

/**
 * Retrieves the balance of tokens owned by a specific address.
 * @param options - The transaction options.
 * @returns A promise that resolves to the balance of the provided address.
 * @extension ERC721
 * @example
 * ```ts
 * import { balanceOf } from "thirdweb/extensions/erc721";
 * const balance = await balanceOf({ contract, address: 1n });
 * ```
 */
export function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>,
): Promise<bigint> {
  return readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function balanceOf(address) returns (uint256)"),
    ),
    params: [options.address],
  });
}
