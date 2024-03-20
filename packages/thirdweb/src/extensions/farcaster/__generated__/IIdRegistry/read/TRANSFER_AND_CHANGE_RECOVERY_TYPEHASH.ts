import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

/**
 * Calls the "TRANSFER_AND_CHANGE_RECOVERY_TYPEHASH" function on the contract.
 * @param options - The options for the TRANSFER_AND_CHANGE_RECOVERY_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```
 * import { TRANSFER_AND_CHANGE_RECOVERY_TYPEHASH } from "thirdweb/extensions/farcaster";
 *
 * const result = await TRANSFER_AND_CHANGE_RECOVERY_TYPEHASH();
 *
 * ```
 */
export async function TRANSFER_AND_CHANGE_RECOVERY_TYPEHASH(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xea2bbb83",
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
