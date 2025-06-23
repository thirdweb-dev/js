import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getWinningBid" function.
 */
export type GetWinningBidParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

export const FN_SELECTOR = "0x6891939d" as const;
const FN_INPUTS = [
  {
    name: "_auctionId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "bidder",
    type: "address",
  },
  {
    name: "currency",
    type: "address",
  },
  {
    name: "bidAmount",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getWinningBid` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getWinningBid` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetWinningBidSupported } from "thirdweb/extensions/marketplace";
 * const supported = isGetWinningBidSupported(["0x..."]);
 * ```
 */
export function isGetWinningBidSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getWinningBid" function.
 * @param options - The options for the getWinningBid function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetWinningBidParams } from "thirdweb/extensions/marketplace";
 * const result = encodeGetWinningBidParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeGetWinningBidParams(options: GetWinningBidParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Encodes the "getWinningBid" function into a Hex string with its parameters.
 * @param options - The options for the getWinningBid function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetWinningBid } from "thirdweb/extensions/marketplace";
 * const result = encodeGetWinningBid({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeGetWinningBid(options: GetWinningBidParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetWinningBidParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getWinningBid function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetWinningBidResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetWinningBidResultResult("...");
 * ```
 */
export function decodeGetWinningBidResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getWinningBid" function on the contract.
 * @param options - The options for the getWinningBid function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getWinningBid } from "thirdweb/extensions/marketplace";
 *
 * const result = await getWinningBid({
 *  contract,
 *  auctionId: ...,
 * });
 *
 * ```
 */
export async function getWinningBid(
  options: BaseTransactionOptions<GetWinningBidParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.auctionId],
  });
}
