import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

/**
 * Represents the parameters for the `previewMint` function.
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
    method: [
      "0xb3d7f6b9",
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
    params: [options.shares],
  });

  return assets;
}
