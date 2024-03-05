import type { Address } from "abitype";
import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

export type MaxWithdrawParams = {
  /**
   * The address to check max withdrawable assets for.
   */
  owner: Address;
};

/**
 * Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the Vault, through a withdraw call.
 * @param options - The transaction options including the address to check.
 * @returns Maximum number of the underlying token that can be withdrawn.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxWithdraw } from "thirdweb/extensions/erc4626";
 *
 * const maxAssets = await maxWithdraw({ contract, owner: "0x..." });
 * ```
 */
export async function maxWithdraw(
  options: BaseTransactionOptions<MaxWithdrawParams>,
): Promise<bigint> {
  const maxAssets = await readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function maxWithdraw(address) returns (uint256)"),
    ),
    params: [options.owner],
  });

  return maxAssets;
}
