import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "nonces" function.
 */
export type NoncesParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
};

export const FN_SELECTOR = "0x7ecebe00" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "owner",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `nonces` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `nonces` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isNoncesSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isNoncesSupported(contract);
 * ```
 */
export async function isNoncesSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "nonces" function.
 * @param options - The options for the nonces function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeNoncesParams } "thirdweb/extensions/erc20";
 * const result = encodeNoncesParams({
 *  owner: ...,
 * });
 * ```
 */
export function encodeNoncesParams(options: NoncesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner]);
}

/**
 * Encodes the "nonces" function into a Hex string with its parameters.
 * @param options - The options for the nonces function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeNonces } "thirdweb/extensions/erc20";
 * const result = encodeNonces({
 *  owner: ...,
 * });
 * ```
 */
export function encodeNonces(options: NoncesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeNoncesParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the nonces function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeNoncesResult } from "thirdweb/extensions/erc20";
 * const result = decodeNoncesResult("...");
 * ```
 */
export function decodeNoncesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "nonces" function on the contract.
 * @param options - The options for the nonces function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { nonces } from "thirdweb/extensions/erc20";
 *
 * const result = await nonces({
 *  contract,
 *  owner: ...,
 * });
 *
 * ```
 */
export async function nonces(options: BaseTransactionOptions<NoncesParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner],
  });
}
