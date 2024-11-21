import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getValidatorsPaginated" function.
 */
export type GetValidatorsPaginatedParams = {
  cursor: AbiParameterToPrimitiveType<{ type: "address"; name: "cursor" }>;
  size: AbiParameterToPrimitiveType<{ type: "uint256"; name: "size" }>;
};

export const FN_SELECTOR = "0x5faac46b" as const;
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
 * Checks if the `getValidatorsPaginated` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getValidatorsPaginated` method is supported.
 * @extension ERC7579
 * @example
 * ```ts
 * import { isGetValidatorsPaginatedSupported } from "thirdweb/extensions/erc7579";
 * const supported = isGetValidatorsPaginatedSupported(["0x..."]);
 * ```
 */
export function isGetValidatorsPaginatedSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getValidatorsPaginated" function.
 * @param options - The options for the getValidatorsPaginated function.
 * @returns The encoded ABI parameters.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetValidatorsPaginatedParams } from "thirdweb/extensions/erc7579";
 * const result = encodeGetValidatorsPaginatedParams({
 *  cursor: ...,
 *  size: ...,
 * });
 * ```
 */
export function encodeGetValidatorsPaginatedParams(
  options: GetValidatorsPaginatedParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.cursor, options.size]);
}

/**
 * Encodes the "getValidatorsPaginated" function into a Hex string with its parameters.
 * @param options - The options for the getValidatorsPaginated function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7579
 * @example
 * ```ts
 * import { encodeGetValidatorsPaginated } from "thirdweb/extensions/erc7579";
 * const result = encodeGetValidatorsPaginated({
 *  cursor: ...,
 *  size: ...,
 * });
 * ```
 */
export function encodeGetValidatorsPaginated(
  options: GetValidatorsPaginatedParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetValidatorsPaginatedParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getValidatorsPaginated function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC7579
 * @example
 * ```ts
 * import { decodeGetValidatorsPaginatedResult } from "thirdweb/extensions/erc7579";
 * const result = decodeGetValidatorsPaginatedResultResult("...");
 * ```
 */
export function decodeGetValidatorsPaginatedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getValidatorsPaginated" function on the contract.
 * @param options - The options for the getValidatorsPaginated function.
 * @returns The parsed result of the function call.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getValidatorsPaginated } from "thirdweb/extensions/erc7579";
 *
 * const result = await getValidatorsPaginated({
 *  contract,
 *  cursor: ...,
 *  size: ...,
 * });
 *
 * ```
 */
export async function getValidatorsPaginated(
  options: BaseTransactionOptions<GetValidatorsPaginatedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.cursor, options.size],
  });
}
