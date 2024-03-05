import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for the `previewRedeem` function.
 */
export type PreviewRedeemParams = {
  shares: bigint;
};

/**
 * Simulate the number of assets returned by redeeming a specified number of shares at the current block.
 * @param options - The transaction options including the number of shares to redeem.
 * @returns Number of assets returned by redeeming the provided number of shares.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewRedeem } from "thirdweb/extensions/erc4626";
 *
 * const assets = await previewRedeem({ contract, shares: 100n });
 * ```
 */
export async function previewRedeem(
  options: BaseTransactionOptions<PreviewRedeemParams>,
): Promise<bigint> {
  const assets = await readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function previewRedeem(uint256) returns (uint256)"),
    ),
    params: [options.shares],
  });

  return assets;
}
