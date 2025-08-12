import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isAuctionExpired" function.
 */
export type IsAuctionExpiredParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

export const FN_SELECTOR = "0x1389b117" as const;
const FN_INPUTS = [
  {
    name: "_auctionId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isAuctionExpired` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isAuctionExpired` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isIsAuctionExpiredSupported } from "thirdweb/extensions/marketplace";
 * const supported = isIsAuctionExpiredSupported(["0x..."]);
 * ```
 */
export function isIsAuctionExpiredSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isAuctionExpired" function.
 * @param options - The options for the isAuctionExpired function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsAuctionExpiredParams } from "thirdweb/extensions/marketplace";
 * const result = encodeIsAuctionExpiredParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeIsAuctionExpiredParams(options: IsAuctionExpiredParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Encodes the "isAuctionExpired" function into a Hex string with its parameters.
 * @param options - The options for the isAuctionExpired function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsAuctionExpired } from "thirdweb/extensions/marketplace";
 * const result = encodeIsAuctionExpired({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeIsAuctionExpired(options: IsAuctionExpiredParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsAuctionExpiredParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isAuctionExpired function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeIsAuctionExpiredResult } from "thirdweb/extensions/marketplace";
 * const result = decodeIsAuctionExpiredResultResult("...");
 * ```
 */
export function decodeIsAuctionExpiredResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isAuctionExpired" function on the contract.
 * @param options - The options for the isAuctionExpired function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isAuctionExpired } from "thirdweb/extensions/marketplace";
 *
 * const result = await isAuctionExpired({
 *  contract,
 *  auctionId: ...,
 * });
 *
 * ```
 */
export async function isAuctionExpired(
  options: BaseTransactionOptions<IsAuctionExpiredParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.auctionId],
  });
}
