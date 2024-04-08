import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0xd5bac7f3" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bytes32",
  },
] as const;

/**
 * Decodes the result of the CHANGE_RECOVERY_ADDRESS_TYPEHASH function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeCHANGE_RECOVERY_ADDRESS_TYPEHASHResult } from "thirdweb/extensions/farcaster";
 * const result = decodeCHANGE_RECOVERY_ADDRESS_TYPEHASHResult("...");
 * ```
 */
export function decodeCHANGE_RECOVERY_ADDRESS_TYPEHASHResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "CHANGE_RECOVERY_ADDRESS_TYPEHASH" function on the contract.
 * @param options - The options for the CHANGE_RECOVERY_ADDRESS_TYPEHASH function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
