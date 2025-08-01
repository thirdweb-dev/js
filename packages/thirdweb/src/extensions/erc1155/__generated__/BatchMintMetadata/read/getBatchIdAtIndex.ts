import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getBatchIdAtIndex" function.
 */
export type GetBatchIdAtIndexParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_index" }>;
};

export const FN_SELECTOR = "0x2419f51b" as const;
const FN_INPUTS = [
  {
    name: "_index",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getBatchIdAtIndex` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getBatchIdAtIndex` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isGetBatchIdAtIndexSupported } from "thirdweb/extensions/erc1155";
 * const supported = isGetBatchIdAtIndexSupported(["0x..."]);
 * ```
 */
export function isGetBatchIdAtIndexSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getBatchIdAtIndex" function.
 * @param options - The options for the getBatchIdAtIndex function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeGetBatchIdAtIndexParams } from "thirdweb/extensions/erc1155";
 * const result = encodeGetBatchIdAtIndexParams({
 *  index: ...,
 * });
 * ```
 */
export function encodeGetBatchIdAtIndexParams(
  options: GetBatchIdAtIndexParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "getBatchIdAtIndex" function into a Hex string with its parameters.
 * @param options - The options for the getBatchIdAtIndex function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeGetBatchIdAtIndex } from "thirdweb/extensions/erc1155";
 * const result = encodeGetBatchIdAtIndex({
 *  index: ...,
 * });
 * ```
 */
export function encodeGetBatchIdAtIndex(options: GetBatchIdAtIndexParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetBatchIdAtIndexParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getBatchIdAtIndex function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeGetBatchIdAtIndexResult } from "thirdweb/extensions/erc1155";
 * const result = decodeGetBatchIdAtIndexResultResult("...");
 * ```
 */
export function decodeGetBatchIdAtIndexResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getBatchIdAtIndex" function on the contract.
 * @param options - The options for the getBatchIdAtIndex function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getBatchIdAtIndex } from "thirdweb/extensions/erc1155";
 *
 * const result = await getBatchIdAtIndex({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function getBatchIdAtIndex(
  options: BaseTransactionOptions<GetBatchIdAtIndexParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
