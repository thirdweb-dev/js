import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "baseURIIndices" function.
 */
export type BaseURIIndicesParams = {
  index: AbiParameterToPrimitiveType<{ type: "uint256"; name: "index" }>;
};

export const FN_SELECTOR = "0xd860483f" as const;
const FN_INPUTS = [
  {
    name: "index",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `baseURIIndices` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `baseURIIndices` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isBaseURIIndicesSupported } from "thirdweb/extensions/erc721";
 * const supported = isBaseURIIndicesSupported(["0x..."]);
 * ```
 */
export function isBaseURIIndicesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "baseURIIndices" function.
 * @param options - The options for the baseURIIndices function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeBaseURIIndicesParams } from "thirdweb/extensions/erc721";
 * const result = encodeBaseURIIndicesParams({
 *  index: ...,
 * });
 * ```
 */
export function encodeBaseURIIndicesParams(options: BaseURIIndicesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.index]);
}

/**
 * Encodes the "baseURIIndices" function into a Hex string with its parameters.
 * @param options - The options for the baseURIIndices function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeBaseURIIndices } from "thirdweb/extensions/erc721";
 * const result = encodeBaseURIIndices({
 *  index: ...,
 * });
 * ```
 */
export function encodeBaseURIIndices(options: BaseURIIndicesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBaseURIIndicesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the baseURIIndices function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeBaseURIIndicesResult } from "thirdweb/extensions/erc721";
 * const result = decodeBaseURIIndicesResultResult("...");
 * ```
 */
export function decodeBaseURIIndicesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "baseURIIndices" function on the contract.
 * @param options - The options for the baseURIIndices function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { baseURIIndices } from "thirdweb/extensions/erc721";
 *
 * const result = await baseURIIndices({
 *  contract,
 *  index: ...,
 * });
 *
 * ```
 */
export async function baseURIIndices(
  options: BaseTransactionOptions<BaseURIIndicesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.index],
  });
}
