import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x95e7549f" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Decodes the result of the gatewayFrozen function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeGatewayFrozenResult } from "thirdweb/extensions/farcaster";
 * const result = decodeGatewayFrozenResult("...");
 * ```
 */
export function decodeGatewayFrozenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "gatewayFrozen" function on the contract.
 * @param options - The options for the gatewayFrozen function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { gatewayFrozen } from "thirdweb/extensions/farcaster";
 *
 * const result = await gatewayFrozen();
 *
 * ```
 */
export async function gatewayFrozen(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
