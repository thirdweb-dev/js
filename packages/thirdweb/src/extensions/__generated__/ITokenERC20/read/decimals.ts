import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the decimals function on the contract.
 * @param options - The options for the decimals function.
 * @returns The parsed result of the function call.
 * @extension ITOKENERC20
 * @example
 * ```
 * import { decimals } from "thirdweb/extensions/ITokenERC20";
 *
 * const result = await decimals();
 *
 * ```
 */
export async function decimals(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x313ce567",
      [],
      [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
    ],
    params: [],
  });
}
