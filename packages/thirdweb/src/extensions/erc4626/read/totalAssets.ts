import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";

/**
 * Retrieves a tokenized vault's balance of its underlying asset.
 * @param options - The transaction options.
 * @returns The vault's balance of its underlying asset.
 * @extension ERC4626
 * @example
 * ```ts
 * import { totalAssets } from "thirdweb/extensions/erc4626";
 *
 * const totalManagedAssets = await totalAssets({ contract });
 * ```
 */
export async function totalAssets(
  options: BaseTransactionOptions,
): Promise<bigint> {
  const totalManagedAssets = await readContract({
    ...options,
    method: [
      "0x01e1d114",
      [],
      [
        {
          type: "uint256",
        },
      ],
    ],
    params: [],
  });

  return totalManagedAssets;
}
