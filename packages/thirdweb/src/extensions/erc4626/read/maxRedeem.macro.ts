import type { Address } from "abitype";
import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

export type MaxRedeemParams = {
  /**
   * The address to check max redeemable shares for.
   */
  owner: Address;
};

/**
 * Returns the maximum number of shares that can be redeemed from the Vault by the specified owner, through a mint call.
 * @param options - The transaction options including the owner address to check.
 * @returns Maximum number of shares that can be redeemed by the provided address.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxRedeem } from "thirdweb/extensions/erc4626";
 *
 * const maxShares = await maxRedeem({ contract, owner: "0x..." });
 * ```
 */
export async function maxRedeem(
  options: BaseTransactionOptions<MaxRedeemParams>,
): Promise<bigint> {
  const maxShares = await readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function maxRedeem(address) returns (uint256)"),
    ),
    params: [options.owner],
  });

  return maxShares;
}
