import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getLocalName" function.
 */
export type GetLocalNameParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x4985e504" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
  },
] as const;

/**
 * Checks if the `getLocalName` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getLocalName` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetLocalNameSupported } from "thirdweb/extensions/lens";
 * const supported = isGetLocalNameSupported(["0x..."]);
 * ```
 */
export function isGetLocalNameSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getLocalName" function.
 * @param options - The options for the getLocalName function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetLocalNameParams } from "thirdweb/extensions/lens";
 * const result = encodeGetLocalNameParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetLocalNameParams(options: GetLocalNameParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getLocalName" function into a Hex string with its parameters.
 * @param options - The options for the getLocalName function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetLocalName } from "thirdweb/extensions/lens";
 * const result = encodeGetLocalName({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetLocalName(options: GetLocalNameParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetLocalNameParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getLocalName function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetLocalNameResult } from "thirdweb/extensions/lens";
 * const result = decodeGetLocalNameResultResult("...");
 * ```
 */
export function decodeGetLocalNameResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getLocalName" function on the contract.
 * @param options - The options for the getLocalName function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getLocalName } from "thirdweb/extensions/lens";
 *
 * const result = await getLocalName({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getLocalName(
  options: BaseTransactionOptions<GetLocalNameParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
