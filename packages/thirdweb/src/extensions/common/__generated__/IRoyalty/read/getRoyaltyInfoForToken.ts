import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRoyaltyInfoForToken" function.
 */
export type GetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x4cc157df" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
  {
    type: "uint16",
  },
] as const;

/**
 * Encodes the parameters for the "getRoyaltyInfoForToken" function.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeGetRoyaltyInfoForTokenParams } "thirdweb/extensions/common";
 * const result = encodeGetRoyaltyInfoForTokenParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetRoyaltyInfoForTokenParams(
  options: GetRoyaltyInfoForTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Decodes the result of the getRoyaltyInfoForToken function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeGetRoyaltyInfoForTokenResult } from "thirdweb/extensions/common";
 * const result = decodeGetRoyaltyInfoForTokenResult("...");
 * ```
 */
export function decodeGetRoyaltyInfoForTokenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { getRoyaltyInfoForToken } from "thirdweb/extensions/common";
 *
 * const result = await getRoyaltyInfoForToken({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getRoyaltyInfoForToken(
  options: BaseTransactionOptions<GetRoyaltyInfoForTokenParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
