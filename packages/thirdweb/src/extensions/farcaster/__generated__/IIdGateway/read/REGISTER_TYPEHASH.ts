import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "REGISTER_TYPEHASH" function on the contract.
 * @param options - The options for the REGISTER_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { REGISTER_TYPEHASH } from "thirdweb/extensions/farcaster";
 *
 * const result = await REGISTER_TYPEHASH();
 *
 * ```
 */
export async function REGISTER_TYPEHASH(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x6a5306a3",
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
