import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * @macro delete-next-lines
 */
import { prepareMethod } from "../../../utils/abi/prepare-method.js";
import { $run$ } from "@hazae41/saumon";

/**
 * Represents the parameters for the `PreviewMintParams` function.
 */
export type PreviewMintParams = {
  shares: bigint;
};

/**
 * Simulate the number of assets necessary to mint a number of shares at the current block.
 * @param options - The transaction options including the number of shares to mint.
 * @returns Number of assets necessary to mint the provided number of shares.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewMint } from "thirdweb/extensions/erc4626";
 *
 * const assets = await previewMint({ contract, shares: 100n });
 * ```
 */
export async function previewMint(
  options: BaseTransactionOptions<PreviewMintParams>,
): Promise<bigint> {
  const assets = await readContract({
    ...options,
    method: $run$(() =>
      prepareMethod("function previewMint(uint256) returns (uint256)"),
    ),
    params: [options.shares],
  });

  return assets;
}
