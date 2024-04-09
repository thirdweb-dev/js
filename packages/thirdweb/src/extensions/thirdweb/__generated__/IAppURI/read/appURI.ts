import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x094ec830" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Decodes the result of the appURI function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeAppURIResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeAppURIResult("...");
 * ```
 */
export function decodeAppURIResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "appURI" function on the contract.
 * @param options - The options for the appURI function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { appURI } from "thirdweb/extensions/thirdweb";
 *
 * const result = await appURI();
 *
 * ```
 */
export async function appURI(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
