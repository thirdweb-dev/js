import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getBatchIdAtIndex" function.
 */
export type GetBatchIdAtIndexParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_index" }>;
};

export const FN_SELECTOR = "0x2419f51b" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_index",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getBatchIdAtIndex` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getBatchIdAtIndex` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetBatchIdAtIndexSupported } from "thirdweb/extensions/erc721";
 *
 * const supported = await isGetBatchIdAtIndexSupported(contract);
 * ```
 */
export async function isGetBatchIdAtIndexSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getBatchIdAtIndex" function.
 * @param options - The options for the getBatchIdAtIndex function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetBatchIdAtIndexParams } "thirdweb/extensions/erc721";
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
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetBatchIdAtIndex } "thirdweb/extensions/erc721";
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
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetBatchIdAtIndexResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetBatchIdAtIndexResult("...");
 * ```
 */
export function decodeGetBatchIdAtIndexResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getBatchIdAtIndex" function on the contract.
 * @param options - The options for the getBatchIdAtIndex function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getBatchIdAtIndex } from "thirdweb/extensions/erc721";
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
