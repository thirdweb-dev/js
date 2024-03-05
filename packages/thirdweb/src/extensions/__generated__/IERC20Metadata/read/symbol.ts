import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the symbol function on the contract.
 * @param options - The options for the symbol function.
 * @returns The parsed result of the function call.
 * @extension IERC20METADATA
 * @example
 * ```
 * import { symbol } from "thirdweb/extensions/IERC20Metadata";
 *
 * const result = await symbol();
 *
 * ```
 */
export async function symbol(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x95d89b41",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}
