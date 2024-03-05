import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the owner function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @extension IOWNABLE
 * @example
 * ```
 * import { owner } from "thirdweb/extensions/IOwnable";
 *
 * const result = await owner();
 *
 * ```
 */
export async function owner(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x8da5cb5b",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
