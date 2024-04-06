import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "convertToShares" function.
 */
export type ConvertToSharesParams = {
  assets: AbiParameterToPrimitiveType<{
    name: "assets";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0xc6e6f592" as const;
const FN_INPUTS = [
  {
    name: "assets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "convertToShares" function.
 * @param options - The options for the convertToShares function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeConvertToSharesParams } "thirdweb/extensions/erc4626";
 * const result = encodeConvertToSharesParams({
 *  assets: ...,
 * });
 * ```
 */
export function encodeConvertToSharesParams(options: ConvertToSharesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.assets]);
}

/**
 * Decodes the result of the convertToShares function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeConvertToSharesResult } from "thirdweb/extensions/erc4626";
 * const result = decodeConvertToSharesResult("...");
 * ```
 */
export function decodeConvertToSharesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "convertToShares" function on the contract.
 * @param options - The options for the convertToShares function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { convertToShares } from "thirdweb/extensions/erc4626";
 *
 * const result = await convertToShares({
 *  assets: ...,
 * });
 *
 * ```
 */
export async function convertToShares(
  options: BaseTransactionOptions<ConvertToSharesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.assets],
  });
}
