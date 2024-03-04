import { readContract } from "../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
/**
 * Retrieves the owner of a contract.
 * @param options - The transaction options.
 * @returns A promise that resolves to the owner of the contract.
 * @extension Ownable
 * @example
 * ```ts
 * import { owner } from "thirdweb/extensions/common";
 * const owner = await owner({ contract });
 * ```
 */
export function owner(options: BaseTransactionOptions): Promise<string> {
  return readContract({
    ...options,
    method: [
      "0x8da5cb5b",
      [],
      [
        {
          type: "address",
        },
      ],
    ],
  });
}
