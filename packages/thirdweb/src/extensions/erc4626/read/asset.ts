import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "abitype";

/**
 * Retrieves the underlying ERC20 used in a tokenized vault.
 * @param options - The transaction options.
 * @returns The vault's underlying token address.
 * @extension ERC4626
 * @example
 * ```ts
 * import { asset } from "thirdweb/extensions/erc4626";
 *
 * const underlyingAsset = await asset({ contract });
 * ```
 */
export async function asset(options: BaseTransactionOptions): Promise<Address> {
  const address = await readContract({
    ...options,
    method: [
      "0x38d52e0f",
      [],
      [
        {
          type: "address",
        },
      ],
    ],
    params: [],
  });

  return address;
}
