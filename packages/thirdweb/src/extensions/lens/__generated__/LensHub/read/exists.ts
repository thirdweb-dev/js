import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "exists" function.
 */
export type ExistsParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x4f558e79" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `exists` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `exists` method is supported.
 * @extension LENS
 * @example
 * ```ts
 * import { isExistsSupported } from "thirdweb/extensions/lens";
 * const supported = isExistsSupported(["0x..."]);
 * ```
 */
export function isExistsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "exists" function.
 * @param options - The options for the exists function.
 * @returns The encoded ABI parameters.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeExistsParams } from "thirdweb/extensions/lens";
 * const result = encodeExistsParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeExistsParams(options: ExistsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "exists" function into a Hex string with its parameters.
 * @param options - The options for the exists function.
 * @returns The encoded hexadecimal string.
 * @extension LENS
 * @example
 * ```ts
 * import { encodeExists } from "thirdweb/extensions/lens";
 * const result = encodeExists({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeExists(options: ExistsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeExistsParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the exists function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension LENS
 * @example
 * ```ts
 * import { decodeExistsResult } from "thirdweb/extensions/lens";
 * const result = decodeExistsResultResult("...");
 * ```
 */
export function decodeExistsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "exists" function on the contract.
 * @param options - The options for the exists function.
 * @returns The parsed result of the function call.
 * @extension LENS
 * @example
 * ```ts
 * import { exists } from "thirdweb/extensions/lens";
 *
 * const result = await exists({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function exists(options: BaseTransactionOptions<ExistsParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
