import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getBatchIndex" function.
 */
export type GetBatchIndexParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

export const FN_SELECTOR = "0x44ec3c07" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getBatchIndex` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getBatchIndex` method is supported.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const supported = BatchMetadataERC1155.isGetBatchIndexSupported(["0x..."]);
 * ```
 */
export function isGetBatchIndexSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getBatchIndex" function.
 * @param options - The options for the getBatchIndex function.
 * @returns The encoded ABI parameters.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeGetBatchIndexParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetBatchIndexParams(options: GetBatchIndexParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getBatchIndex" function into a Hex string with its parameters.
 * @param options - The options for the getBatchIndex function.
 * @returns The encoded hexadecimal string.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeGetBatchIndex({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetBatchIndex(options: GetBatchIndexParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetBatchIndexParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getBatchIndex function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.decodeGetBatchIndexResultResult("...");
 * ```
 */
export function decodeGetBatchIndexResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getBatchIndex" function on the contract.
 * @param options - The options for the getBatchIndex function.
 * @returns The parsed result of the function call.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const result = await BatchMetadataERC1155.getBatchIndex({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getBatchIndex(
  options: BaseTransactionOptions<GetBatchIndexParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
