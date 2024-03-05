import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";

/**
 * Calls the _msgSender function on the contract.
 * @param options - The options for the _msgSender function.
 * @returns The parsed result of the function call.
 * @extension ICONTEXT
 * @example
 * ```
 * import { _msgSender } from "thirdweb/extensions/IContext";
 *
 * const result = await _msgSender();
 *
 * ```
 */
export async function _msgSender(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x119df25f",
      [],
      [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}
