import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "bidder",
  },
  {
    type: "address",
    name: "currency",
  },
  {
    type: "uint256",
    name: "bidAmount",
  },
] as const;

/**
 * Encodes the parameters for the "getWinningBid" function.
 * @param options - The options for the getWinningBid function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetWinningBidParams } "thirdweb/extensions/marketplace";
 * const result = encodeGetWinningBidParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeGetWinningBidParams(options: GetWinningBidParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Decodes the result of the getWinningBid function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetWinningBidResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetWinningBidResult("...");
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
