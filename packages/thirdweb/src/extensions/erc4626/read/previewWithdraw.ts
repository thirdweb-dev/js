import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

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
    method: [
      "0x0a28a477",
      [
        {
          type: "uint256",
        },
      ],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [options.assets],
  });

  return shares;
}
