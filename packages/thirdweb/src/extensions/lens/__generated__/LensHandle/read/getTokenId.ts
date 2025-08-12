import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getTokenId" function.
 */
export type GetTokenIdParams = {
  localName: AbiParameterToPrimitiveType<{ type: "string"; name: "localName" }>;
};

export const FN_SELECTOR = "0x1e7663bc" as const;
const FN_INPUTS = [
  {
    name: "localName",
    type: "string",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getTokenId` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getTokenId` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isGetTokenIdSupported } from "thirdweb/extensions/lens";
 * const supported = isGetTokenIdSupported(["0x..."]);
 * ```
 */
export function isGetTokenIdSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getTokenId" function.
 * @param options - The options for the getTokenId function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetTokenIdParams } from "thirdweb/extensions/lens";
 * const result = encodeGetTokenIdParams({
 *  localName: ...,
 * });
 * ```
 */
export function encodeGetTokenIdParams(options: GetTokenIdParams) {
  return encodeAbiParameters(FN_INPUTS, [options.localName]);
}

/**
 * Encodes the "getTokenId" function into a Hex string with its parameters.
 * @param options - The options for the getTokenId function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeGetTokenId } from "thirdweb/extensions/lens";
 * const result = encodeGetTokenId({
 *  localName: ...,
 * });
 * ```
 */
export function encodeGetTokenId(options: GetTokenIdParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetTokenIdParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getTokenId function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeGetTokenIdResult } from "thirdweb/extensions/lens";
 * const result = decodeGetTokenIdResultResult("...");
 * ```
 */
export function decodeGetTokenIdResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getTokenId" function on the contract.
 * @param options - The options for the getTokenId function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { getTokenId } from "thirdweb/extensions/lens";
 *
 * const result = await getTokenId({
 *  contract,
 *  localName: ...,
 * });
 *
 * ```
 */
export async function getTokenId(
  options: BaseTransactionOptions<GetTokenIdParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.localName],
  });
}
