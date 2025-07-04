import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "codehashVersion" function.
 */
export type CodehashVersionParams = {
  codehash: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "codehash" }>;
};

export const FN_SELECTOR = "0xd70c0ca7" as const;
const FN_INPUTS = [
  {
    name: "codehash",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "version",
    type: "uint16",
  },
] as const;

/**
 * Checks if the `codehashVersion` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `codehashVersion` method is supported.
 * @extension STYLUS
 * @example
 * ```ts
 * import { isCodehashVersionSupported } from "thirdweb/extensions/stylus";
 * const supported = isCodehashVersionSupported(["0x..."]);
 * ```
 */
export function isCodehashVersionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "codehashVersion" function.
 * @param options - The options for the codehashVersion function.
 * @returns The encoded ABI parameters.
 * @extension STYLUS
 * @example
 * ```ts
 * import { encodeCodehashVersionParams } from "thirdweb/extensions/stylus";
 * const result = encodeCodehashVersionParams({
 *  codehash: ...,
 * });
 * ```
 */
export function encodeCodehashVersionParams(options: CodehashVersionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.codehash]);
}

/**
 * Encodes the "codehashVersion" function into a Hex string with its parameters.
 * @param options - The options for the codehashVersion function.
 * @returns The encoded hexadecimal string.
 * @extension STYLUS
 * @example
 * ```ts
 * import { encodeCodehashVersion } from "thirdweb/extensions/stylus";
 * const result = encodeCodehashVersion({
 *  codehash: ...,
 * });
 * ```
 */
export function encodeCodehashVersion(options: CodehashVersionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCodehashVersionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the codehashVersion function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension STYLUS
 * @example
 * ```ts
 * import { decodeCodehashVersionResult } from "thirdweb/extensions/stylus";
 * const result = decodeCodehashVersionResultResult("...");
 * ```
 */
export function decodeCodehashVersionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "codehashVersion" function on the contract.
 * @param options - The options for the codehashVersion function.
 * @returns The parsed result of the function call.
 * @extension STYLUS
 * @example
 * ```ts
 * import { codehashVersion } from "thirdweb/extensions/stylus";
 *
 * const result = await codehashVersion({
 *  contract,
 *  codehash: ...,
 * });
 *
 * ```
 */
export async function codehashVersion(
  options: BaseTransactionOptions<CodehashVersionParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.codehash],
  });
}
