import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "name" function.
 */
export type NameParams = {
  node: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "node" }>;
};

export const FN_SELECTOR = "0x691f3431" as const;
const FN_INPUTS = [
  {
    name: "node",
    type: "bytes32",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `name` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `name` method is supported.
 * @extension ENS
 * @example
 * ```ts
 * import { isNameSupported } from "thirdweb/extensions/ens";
 * const supported = isNameSupported(["0x..."]);
 * ```
 */
export function isNameSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "name" function.
 * @param options - The options for the name function.
 * @returns The encoded ABI parameters.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeNameParams } from "thirdweb/extensions/ens";
 * const result = encodeNameParams({
 *  node: ...,
 * });
 * ```
 */
export function encodeNameParams(options: NameParams) {
  return encodeAbiParameters(FN_INPUTS, [options.node]);
}

/**
 * Encodes the "name" function into a Hex string with its parameters.
 * @param options - The options for the name function.
 * @returns The encoded hexadecimal string.
 * @extension ENS
 * @example
 * ```ts
 * import { encodeName } from "thirdweb/extensions/ens";
 * const result = encodeName({
 *  node: ...,
 * });
 * ```
 */
export function encodeName(options: NameParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeNameParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the name function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ENS
 * @example
 * ```ts
 * import { decodeNameResult } from "thirdweb/extensions/ens";
 * const result = decodeNameResultResult("...");
 * ```
 */
export function decodeNameResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @extension ENS
 * @example
 * ```ts
 * import { name } from "thirdweb/extensions/ens";
 *
 * const result = await name({
 *  contract,
 *  node: ...,
 * });
 *
 * ```
 */
export async function name(options: BaseTransactionOptions<NameParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.node],
  });
}
