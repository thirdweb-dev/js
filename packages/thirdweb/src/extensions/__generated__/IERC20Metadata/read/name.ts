import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the name function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @extension IERC20METADATA
 * @example
 * ```
 * import { name } from "thirdweb/extensions/IERC20Metadata";
 *
 * const result = await name();
 *
 * ```
 */
export async function name(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x06fdde03",
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
