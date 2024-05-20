import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
 * Checks if the `getNonce` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getNonce` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isGetNonceSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isGetNonceSupported(contract);
 * ```
 */
export async function isGetNonceSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * Encodes the "getNonce" function into a Hex string with its parameters.
 * @param options - The options for the getNonce function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeGetNonce } "thirdweb/extensions/erc4337";
 * const result = encodeGetNonce({
 *  sender: ...,
 *  key: ...,
 * });
 * ```
 */
export function encodeGetNonce(options: GetNonceParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetNonceParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
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
 *  contract,
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
