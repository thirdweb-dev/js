import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x2c39d670" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Decodes the result of the deprecationTimestamp function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeDeprecationTimestampResult } from "thirdweb/extensions/farcaster";
 * const result = decodeDeprecationTimestampResult("...");
 * ```
 */
export function decodeDeprecationTimestampResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "deprecationTimestamp" function on the contract.
 * @param options - The options for the deprecationTimestamp function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { deprecationTimestamp } from "thirdweb/extensions/farcaster";
 *
 * const result = await deprecationTimestamp();
 *
 * ```
 */
export async function deprecationTimestamp(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
