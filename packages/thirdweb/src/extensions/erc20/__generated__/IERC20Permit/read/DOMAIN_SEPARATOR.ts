import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "DOMAIN_SEPARATOR" function on the contract.
 * @param options - The options for the DOMAIN_SEPARATOR function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```
 * import { DOMAIN_SEPARATOR } from "thirdweb/extensions/erc20";
 *
 * const result = await DOMAIN_SEPARATOR();
 *
 * ```
 */
export async function DOMAIN_SEPARATOR(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x3644e515",
      [],
      [
        {
          type: "bytes32",
        },
      ],
    ],
    params: [],
  });
}
