import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the _msgData function on the contract.
 * @param options - The options for the _msgData function.
 * @returns The parsed result of the function call.
 * @extension ICONTEXT
 * @example
 * ```
 * import { _msgData } from "thirdweb/extensions/IContext";
 *
 * const result = await _msgData();
 *
 * ```
 */
export async function _msgData(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x8b49d47e",
      [],
      [
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
    ],
    params: [],
  });
}
