import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "totalKeys" function.
 */
export type TotalKeysParams = {
  fid: AbiParameterToPrimitiveType<{ type: "uint256"; name: "fid" }>;
  state: AbiParameterToPrimitiveType<{ type: "uint8"; name: "state" }>;
};

export const FN_SELECTOR = "0x6840b75e" as const;
const FN_INPUTS = [
  {
    name: "fid",
    type: "uint256",
  },
  {
    name: "state",
    type: "uint8",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `totalKeys` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `totalKeys` method is supported.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { isTotalKeysSupported } from "thirdweb/extensions/farcaster";
 * const supported = isTotalKeysSupported(["0x..."]);
 * ```
 */
export function isTotalKeysSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "totalKeys" function.
 * @param options - The options for the totalKeys function.
 * @returns The encoded ABI parameters.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTotalKeysParams } from "thirdweb/extensions/farcaster";
 * const result = encodeTotalKeysParams({
 *  fid: ...,
 *  state: ...,
 * });
 * ```
 */
export function encodeTotalKeysParams(options: TotalKeysParams) {
  return encodeAbiParameters(FN_INPUTS, [options.fid, options.state]);
}

/**
 * Encodes the "totalKeys" function into a Hex string with its parameters.
 * @param options - The options for the totalKeys function.
 * @returns The encoded hexadecimal string.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { encodeTotalKeys } from "thirdweb/extensions/farcaster";
 * const result = encodeTotalKeys({
 *  fid: ...,
 *  state: ...,
 * });
 * ```
 */
export function encodeTotalKeys(options: TotalKeysParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTotalKeysParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the totalKeys function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { decodeTotalKeysResult } from "thirdweb/extensions/farcaster";
 * const result = decodeTotalKeysResultResult("...");
 * ```
 */
export function decodeTotalKeysResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalKeys" function on the contract.
 * @param options - The options for the totalKeys function.
 * @returns The parsed result of the function call.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { totalKeys } from "thirdweb/extensions/farcaster";
 *
 * const result = await totalKeys({
 *  contract,
 *  fid: ...,
 *  state: ...,
 * });
 *
 * ```
 */
export async function totalKeys(
  options: BaseTransactionOptions<TotalKeysParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fid, options.state],
  });
}
