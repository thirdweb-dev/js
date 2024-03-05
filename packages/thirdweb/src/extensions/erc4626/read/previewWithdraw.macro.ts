import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for the `previewWithdraw` function.
 */
export type PreviewWithdrawParams = {
  assets: bigint;
};

/**
 * Simulate the number of shares to receive when withdrawing a given number of assets at the current block.
 * @param options - The transaction options including the number of assets to deposit.
 * @returns Number of shares that would be returned for the provided number of assets.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewWithdraw } from "thirdweb/extensions/erc4626";
 *
 * const shares = await previewWithdraw({ contract, assets: 100n });
 * ```
 */
export async function previewWithdraw(
  options: BaseTransactionOptions<PreviewWithdrawParams>,
): Promise<bigint> {
  const shares = await readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function previewWithdraw(uint256) returns (uint256)"),
    ),
    params: [options.assets],
  });

  return shares;
}
