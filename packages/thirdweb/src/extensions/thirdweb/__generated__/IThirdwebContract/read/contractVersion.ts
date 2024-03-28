import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0xa0a8e460" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "uint8",
  },
] as const;

/**
 * Decodes the result of the contractVersion function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeContractVersionResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeContractVersionResult("...");
 * ```
 */
export function decodeContractVersionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "contractVersion" function on the contract.
 * @param options - The options for the contractVersion function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { contractVersion } from "thirdweb/extensions/thirdweb";
 *
 * const result = await contractVersion();
 *
 * ```
 */
export async function contractVersion(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
