import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getMetadataBatch" function.
 */
export type GetMetadataBatchParams = {
  batchIndex: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_batchIndex";
  }>;
};

export const FN_SELECTOR = "0xe034558b" as const;
const FN_INPUTS = [
  {
    name: "_batchIndex",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "startTokenIdInclusive",
        type: "uint256",
      },
      {
        name: "endTokenIdInclusive",
        type: "uint256",
      },
      {
        name: "baseURI",
        type: "string",
      },
    ],
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getMetadataBatch` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getMetadataBatch` method is supported.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const supported = BatchMetadataERC1155.isGetMetadataBatchSupported(["0x..."]);
 * ```
 */
export function isGetMetadataBatchSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getMetadataBatch" function.
 * @param options - The options for the getMetadataBatch function.
 * @returns The encoded ABI parameters.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeGetMetadataBatchParams({
 *  batchIndex: ...,
 * });
 * ```
 */
export function encodeGetMetadataBatchParams(options: GetMetadataBatchParams) {
  return encodeAbiParameters(FN_INPUTS, [options.batchIndex]);
}

/**
 * Encodes the "getMetadataBatch" function into a Hex string with its parameters.
 * @param options - The options for the getMetadataBatch function.
 * @returns The encoded hexadecimal string.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.encodeGetMetadataBatch({
 *  batchIndex: ...,
 * });
 * ```
 */
export function encodeGetMetadataBatch(options: GetMetadataBatchParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetMetadataBatchParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getMetadataBatch function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 * const result = BatchMetadataERC1155.decodeGetMetadataBatchResultResult("...");
 * ```
 */
export function decodeGetMetadataBatchResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getMetadataBatch" function on the contract.
 * @param options - The options for the getMetadataBatch function.
 * @returns The parsed result of the function call.
 * @modules BatchMetadataERC1155
 * @example
 * ```ts
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const result = await BatchMetadataERC1155.getMetadataBatch({
 *  contract,
 *  batchIndex: ...,
 * });
 *
 * ```
 */
export async function getMetadataBatch(
  options: BaseTransactionOptions<GetMetadataBatchParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.batchIndex],
  });
}
