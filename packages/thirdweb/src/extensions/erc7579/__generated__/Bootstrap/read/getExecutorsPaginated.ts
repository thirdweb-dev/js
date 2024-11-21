import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getExecutorsPaginated" function.
 */
export type GetExecutorsPaginatedParams = {
  cursor: AbiParameterToPrimitiveType<{ type: "address"; name: "cursor" }>;
  size: AbiParameterToPrimitiveType<{ type: "uint256"; name: "size" }>;
};

export const FN_SELECTOR = "0xea5f61d0" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "cursor",
  },
  {
    type: "uint256",
    name: "size",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address[]",
    name: "array",
  },
  {
    type: "address",
    name: "next",
  },
] as const;

/**
 * Checks if the `getExecutorsPaginated` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getExecutorsPaginated` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isGetExecutorsPaginatedSupported } from "thirdweb/extensions/erc7579";
 * const supported = isGetExecutorsPaginatedSupported(["0x..."]);
 * ```
 */
export function isGetExecutorsPaginatedSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getExecutorsPaginated" function.
 * @param options - The options for the getExecutorsPaginated function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetExecutorsPaginatedParams } from "thirdweb/extensions/erc7579";
 * const result = encodeGetExecutorsPaginatedParams({
 *  cursor: ...,
 *  size: ...,
 * });
 * ```
 */
export function encodeGetExecutorsPaginatedParams(
  options: GetExecutorsPaginatedParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.cursor, options.size]);
}

/**
 * Encodes the "getExecutorsPaginated" function into a Hex string with its parameters.
 * @param options - The options for the getExecutorsPaginated function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetExecutorsPaginated } from "thirdweb/extensions/erc7579";
 * const result = encodeGetExecutorsPaginated({
 *  cursor: ...,
 *  size: ...,
 * });
 * ```
 */
export function encodeGetExecutorsPaginated(
  options: GetExecutorsPaginatedParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetExecutorsPaginatedParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getExecutorsPaginated function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeGetExecutorsPaginatedResult } from "thirdweb/extensions/erc7579";
 * const result = decodeGetExecutorsPaginatedResultResult("...");
 * ```
 */
export function decodeGetExecutorsPaginatedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getExecutorsPaginated" function on the contract.
 * @param options - The options for the getExecutorsPaginated function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getExecutorsPaginated } from "thirdweb/extensions/erc7579";
 *
 * const result = await getExecutorsPaginated({
 *  contract,
 *  cursor: ...,
 *  size: ...,
 * });
 *
 * ```
 */
export async function getExecutorsPaginated(
  options: BaseTransactionOptions<GetExecutorsPaginatedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.cursor, options.size],
  });
}
