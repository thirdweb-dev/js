import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0x00bf26f4",
  [],
  [
    {
      type: "bytes32",
    },
  ],
] as const;

/**
 * Calls the "TRANSFER_TYPEHASH" function on the contract.
 * @param options - The options for the TRANSFER_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { TRANSFER_TYPEHASH } from "thirdweb/extensions/farcaster";
 *
 * const result = await TRANSFER_TYPEHASH();
 *
 * ```
 */
export async function TRANSFER_TYPEHASH(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
