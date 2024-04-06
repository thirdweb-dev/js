import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getStakeInfo" function.
 */
export type GetStakeInfoParams = {
  staker: AbiParameterToPrimitiveType<{ type: "address"; name: "staker" }>;
};

export const FN_SELECTOR = "0xc3453153" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "staker",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "_tokensStaked",
  },
  {
    type: "uint256",
    name: "_rewards",
  },
] as const;

/**
 * Encodes the parameters for the "getStakeInfo" function.
 * @param options - The options for the getStakeInfo function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeGetStakeInfoParams } "thirdweb/extensions/erc20";
 * const result = encodeGetStakeInfoParams({
 *  staker: ...,
 * });
 * ```
 */
export function encodeGetStakeInfoParams(options: GetStakeInfoParams) {
  return encodeAbiParameters(FN_INPUTS, [options.staker]);
}

/**
 * Decodes the result of the getStakeInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeGetStakeInfoResult } from "thirdweb/extensions/erc20";
 * const result = decodeGetStakeInfoResult("...");
 * ```
 */
export function decodeGetStakeInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getStakeInfo" function on the contract.
 * @param options - The options for the getStakeInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { getStakeInfo } from "thirdweb/extensions/erc20";
 *
 * const result = await getStakeInfo({
 *  staker: ...,
 * });
 *
 * ```
 */
export async function getStakeInfo(
  options: BaseTransactionOptions<GetStakeInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.staker],
  });
}
