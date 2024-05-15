import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "keysOf" function.
 */
export type KeysOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
};

export const FN_SELECTOR = "0x1f64222f" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "uint8",
    name: "state",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bytes[]",
  },
] as const;

/**
 * Checks if the `keysOf` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `keysOf` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isKeysOfSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isKeysOfSupported(contract);
 * ```
 */
export async function isKeysOfSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "keysOf" function.
 * @param options - The options for the keysOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeysOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeKeysOfParams({
 *  fid: ...,
 *  state: ...,
 * });
 * ```
 */
export function encodeKeysOfParams(options: KeysOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.state]);
}

/**
 * Encodes the "keysOf" function into a Hex string with its parameters.
 * @param options - The options for the keysOf function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeysOf } "thirdweb/extensions/farcaster";
 * const result = encodeKeysOf({
 *  fid: ...,
 *  state: ...,
 * });
 * ```
 */
export function encodeKeysOf(options: KeysOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeKeysOfParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the keysOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeysOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeysOfResult("...");
 * ```
 */
export function decodeKeysOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "keysOf" function on the contract.
 * @param options - The options for the keysOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { keysOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await keysOf({
 *  contract,
 *  fid: ...,
 *  state: ...,
 * });
 *
 * ```
 */
export async function keysOf(options: BaseTransactionOptions<KeysOfParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid, options.state],
  });
}
