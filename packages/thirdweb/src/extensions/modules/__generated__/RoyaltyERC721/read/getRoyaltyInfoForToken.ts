import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRoyaltyInfoForToken" function.
 */
export type GetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_tokenId" }>;
};

export const FN_SELECTOR = "0x4cc157df" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
  {
    type: "uint16",
  },
] as const;

/**
 * Checks if the `getRoyaltyInfoForToken` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRoyaltyInfoForToken` method is supported.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 * const supported = RoyaltyERC721.isGetRoyaltyInfoForTokenSupported(["0x..."]);
 * ```
 */
export function isGetRoyaltyInfoForTokenSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getRoyaltyInfoForToken" function.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The encoded ABI parameters.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 * const result = RoyaltyERC721.encodeGetRoyaltyInfoForTokenParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetRoyaltyInfoForTokenParams(
  options: GetRoyaltyInfoForTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getRoyaltyInfoForToken" function into a Hex string with its parameters.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The encoded hexadecimal string.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 * const result = RoyaltyERC721.encodeGetRoyaltyInfoForToken({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetRoyaltyInfoForToken(
  options: GetRoyaltyInfoForTokenParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRoyaltyInfoForTokenParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getRoyaltyInfoForToken function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 * const result = RoyaltyERC721.decodeGetRoyaltyInfoForTokenResultResult("...");
 * ```
 */
export function decodeGetRoyaltyInfoForTokenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The parsed result of the function call.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { RoyaltyERC721 } from "thirdweb/modules";
 *
 * const result = await RoyaltyERC721.getRoyaltyInfoForToken({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getRoyaltyInfoForToken(
  options: BaseTransactionOptions<GetRoyaltyInfoForTokenParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
