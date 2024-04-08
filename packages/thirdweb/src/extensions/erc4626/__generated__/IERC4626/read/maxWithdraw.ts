import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "maxWithdraw" function.
 */
export type MaxWithdrawParams = {
  owner: AbiParameterToPrimitiveType<{
    name: "owner";
    type: "address";
    internalType: "address";
  }>;
};

export const FN_SELECTOR = "0xce96cb77" as const;
const FN_INPUTS = [
  {
    name: "owner",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "maxAssets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "maxWithdraw" function.
 * @param options - The options for the maxWithdraw function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeMaxWithdrawParams } "thirdweb/extensions/erc4626";
 * const result = encodeMaxWithdrawParams({
 *  owner: ...,
 * });
 * ```
 */
export function encodeMaxWithdrawParams(options: MaxWithdrawParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner]);
}

/**
 * Decodes the result of the maxWithdraw function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeMaxWithdrawResult } from "thirdweb/extensions/erc4626";
 * const result = decodeMaxWithdrawResult("...");
 * ```
 */
export function decodeMaxWithdrawResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "maxWithdraw" function on the contract.
 * @param options - The options for the maxWithdraw function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { maxWithdraw } from "thirdweb/extensions/erc4626";
 *
 * const result = await maxWithdraw({
 *  owner: ...,
 * });
 *
 * ```
 */
export async function maxWithdraw(
  options: BaseTransactionOptions<MaxWithdrawParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner],
  });
}
