import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isNewWinningBid" function.
 */
export type IsNewWinningBidParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_bidAmount";
  }>;
};

export const FN_SELECTOR = "0x2eb566bd" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
  {
    type: "uint256",
    name: "_bidAmount",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "isNewWinningBid" function.
 * @param options - The options for the isNewWinningBid function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsNewWinningBidParams } "thirdweb/extensions/marketplace";
 * const result = encodeIsNewWinningBidParams({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 * ```
 */
export function encodeIsNewWinningBidParams(options: IsNewWinningBidParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId, options.bidAmount]);
}

/**
 * Decodes the result of the isNewWinningBid function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeIsNewWinningBidResult } from "thirdweb/extensions/marketplace";
 * const result = decodeIsNewWinningBidResult("...");
 * ```
 */
export function decodeIsNewWinningBidResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isNewWinningBid" function on the contract.
 * @param options - The options for the isNewWinningBid function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isNewWinningBid } from "thirdweb/extensions/marketplace";
 *
 * const result = await isNewWinningBid({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 *
 * ```
 */
export async function isNewWinningBid(
  options: BaseTransactionOptions<IsNewWinningBidParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.auctionId, options.bidAmount],
  });
}
