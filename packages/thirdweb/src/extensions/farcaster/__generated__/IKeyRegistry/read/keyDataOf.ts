import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "keyDataOf" function.
 */
export type KeyDataOfParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  key: AbiParameterToPrimitiveType<{ type: "bytes"; name: "key" }>;
};

export const FN_SELECTOR = "0xac34cc5a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "fid",
  },
  {
    type: "bytes",
    name: "key",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Checks if the `keyDataOf` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `keyDataOf` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isKeyDataOfSupported } from "thirdweb/extensions/farcaster";
 *
 * const supported = await isKeyDataOfSupported(contract);
 * ```
 */
export async function isKeyDataOfSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "keyDataOf" function.
 * @param options - The options for the keyDataOf function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeyDataOfParams } "thirdweb/extensions/farcaster";
 * const result = encodeKeyDataOfParams({
 *  fid: ...,
 *  key: ...,
 * });
 * ```
 */
export function encodeKeyDataOfParams(options: KeyDataOfParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.key]);
}

/**
 * Encodes the "keyDataOf" function into a Hex string with its parameters.
 * @param options - The options for the keyDataOf function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeKeyDataOf } "thirdweb/extensions/farcaster";
 * const result = encodeKeyDataOf({
 *  fid: ...,
 *  key: ...,
 * });
 * ```
 */
export function encodeKeyDataOf(options: KeyDataOfParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeKeyDataOfParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the keyDataOf function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeKeyDataOfResult } from "thirdweb/extensions/farcaster";
 * const result = decodeKeyDataOfResult("...");
 * ```
 */
export function decodeKeyDataOfResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "keyDataOf" function on the contract.
 * @param options - The options for the keyDataOf function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { keyDataOf } from "thirdweb/extensions/farcaster";
 *
 * const result = await keyDataOf({
 *  contract,
 *  fid: ...,
 *  key: ...,
 * });
 *
 * ```
 */
export async function keyDataOf(
  options: BaseTransactionOptions<KeyDataOfParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid, options.key],
  });
}
