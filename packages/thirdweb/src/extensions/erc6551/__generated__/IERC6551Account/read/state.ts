import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "state" function on the contract.
 * @param options - The options for the state function.
 * @returns The parsed result of the function call.
 * @extension ERC6551
 * @example
 * ```
 * import { state } from "thirdweb/extensions/erc6551";
 *
 * const result = await state();
 *
 * ```
 */
export async function state(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xc19d93fb",
      [],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}
