import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getNonce" function.
 */
export type GetNonceParams = {
  sender: AbiParameterToPrimitiveType<{ type: "address"; name: "sender" }>;
  key: AbiParameterToPrimitiveType<{ type: "uint192"; name: "key" }>;
};

export const FN_SELECTOR = "0x35567e1a" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "sender",
  },
  {
    type: "uint192",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "nonce",
  },
] as const;

/**
 * Encodes the parameters for the "getNonce" function.
 * @param options - The options for the getNonce function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetNonceParams } "thirdweb/extensions/erc4337";
 * const result = encodeGetNonceParams({
 *  sender: ...,
 *  key: ...,
 * });
 * ```
 */
export function encodeGetNonceParams(options: GetNonceParams) {
  return encodeAbiParameters(FN_INPUTS, [options.sender, options.key]);
}

/**
 * Decodes the result of the getNonce function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4337
 * @example
 * ```ts
 * import { decodeGetNonceResult } from "thirdweb/extensions/erc4337";
 * const result = decodeGetNonceResult("...");
 * ```
 */
export function decodeGetNonceResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getNonce" function on the contract.
 * @param options - The options for the getNonce function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getNonce } from "thirdweb/extensions/erc4337";
 *
 * const result = await getNonce({
 *  sender: ...,
 *  key: ...,
 * });
 *
 * ```
 */
export async function getNonce(
  options: BaseTransactionOptions<GetNonceParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.sender, options.key],
  });
}
