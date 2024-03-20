import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

const METHOD = [
  "0xd5bac7f3",
  [],
  [
    {
      type: "bytes32",
    },
  ],
] as const;

/**
 * Calls the "CHANGE_RECOVERY_ADDRESS_TYPEHASH" function on the contract.
 * @param options - The options for the CHANGE_RECOVERY_ADDRESS_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { CHANGE_RECOVERY_ADDRESS_TYPEHASH } from "thirdweb/extensions/farcaster";
 *
 * const result = await CHANGE_RECOVERY_ADDRESS_TYPEHASH();
 *
 * ```
 */
export async function CHANGE_RECOVERY_ADDRESS_TYPEHASH(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [],
  });
}
