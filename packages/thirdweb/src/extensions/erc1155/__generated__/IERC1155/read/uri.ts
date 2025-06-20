import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "uri" function.
 */
export type UriParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x0e89341c" as const;
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
 * Checks if the `uri` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `uri` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isUriSupported } from "thirdweb/extensions/erc1155";
 * const supported = isUriSupported(["0x..."]);
 * ```
 */
export function isUriSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "uri" function.
 * @param options - The options for the uri function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeUriParams } from "thirdweb/extensions/erc1155";
 * const result = encodeUriParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeUriParams(options: UriParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "uri" function into a Hex string with its parameters.
 * @param options - The options for the uri function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeUri } from "thirdweb/extensions/erc1155";
 * const result = encodeUri({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeUri(options: UriParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUriParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the uri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeUriResult } from "thirdweb/extensions/erc1155";
 * const result = decodeUriResultResult("...");
 * ```
 */
export function decodeUriResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "uri" function on the contract.
 * @param options - The options for the uri function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { uri } from "thirdweb/extensions/erc1155";
 *
 * const result = await uri({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function uri(options: BaseTransactionOptions<UriParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
