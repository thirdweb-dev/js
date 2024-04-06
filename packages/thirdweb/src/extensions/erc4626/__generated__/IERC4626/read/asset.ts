import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

export const FN_SELECTOR = "0x38d52e0f" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "assetTokenAddress",
    type: "address",
    internalType: "contract ERC20",
  },
] as const;

/**
 * Decodes the result of the asset function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeAssetResult } from "thirdweb/extensions/erc4626";
 * const result = decodeAssetResult("...");
 * ```
 */
export function decodeAssetResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "asset" function on the contract.
 * @param options - The options for the asset function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { asset } from "thirdweb/extensions/erc4626";
 *
 * const result = await asset();
 *
 * ```
 */
export async function asset(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
