import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for the `previewDeposit` function.
 */
export type PreviewDepositParams = {
  assets: bigint;
};

/**
 * Simulate the number of shares to receive for a deposit at the current block.
 * @param options - The transaction options including the number of assets to deposit.
 * @returns Number of shares that would be returned for the provided number of assets.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewDeposit } from "thirdweb/extensions/erc4626";
 *
 * const shares = await previewDeposit({ contract, assets: 100n });
 * ```
 */
export async function previewDeposit(
  options: BaseTransactionOptions<PreviewDepositParams>,
): Promise<bigint> {
  const shares = await readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function previewDeposit(uint256) returns (uint256)"),
    ),
    params: [options.assets],
  });

  return shares;
}
