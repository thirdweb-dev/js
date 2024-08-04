import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0xa77ec9bb" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Decodes the result of the ON_ROYALTY_INFO_FLAG function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeON_ROYALTY_INFO_FLAGResult } from "thirdweb/extensions/hooks";
 * const result = decodeON_ROYALTY_INFO_FLAGResult("...");
 * ```
 */
export function decodeON_ROYALTY_INFO_FLAGResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "ON_ROYALTY_INFO_FLAG" function on the contract.
 * @param options - The options for the ON_ROYALTY_INFO_FLAG function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { ON_ROYALTY_INFO_FLAG } from "thirdweb/extensions/hooks";
 *
 * const result = await ON_ROYALTY_INFO_FLAG();
 *
 * ```
 */
export async function ON_ROYALTY_INFO_FLAG(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
