import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getWrappedContents" function.
 */
export type GetWrappedContentsParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

export const FN_SELECTOR = "0xd5576d26" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "contents",
    type: "tuple[]",
  },
] as const;

/**
 * Checks if the `getWrappedContents` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getWrappedContents` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetWrappedContentsSupported } from "thirdweb/extensions/erc721";
 * const supported = isGetWrappedContentsSupported(["0x..."]);
 * ```
 */
export function isGetWrappedContentsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getWrappedContents" function.
 * @param options - The options for the getWrappedContents function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetWrappedContentsParams } from "thirdweb/extensions/erc721";
 * const result = encodeGetWrappedContentsParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetWrappedContentsParams(
  options: GetWrappedContentsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getWrappedContents" function into a Hex string with its parameters.
 * @param options - The options for the getWrappedContents function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetWrappedContents } from "thirdweb/extensions/erc721";
 * const result = encodeGetWrappedContents({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetWrappedContents(options: GetWrappedContentsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetWrappedContentsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getWrappedContents function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetWrappedContentsResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetWrappedContentsResultResult("...");
 * ```
 */
export function decodeGetWrappedContentsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getWrappedContents" function on the contract.
 * @param options - The options for the getWrappedContents function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getWrappedContents } from "thirdweb/extensions/erc721";
 *
 * const result = await getWrappedContents({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getWrappedContents(
  options: BaseTransactionOptions<GetWrappedContentsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
