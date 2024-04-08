import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
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
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "isAuctionExpired" function.
 * @param options - The options for the isAuctionExpired function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsAuctionExpiredParams } "thirdweb/extensions/marketplace";
 * const result = encodeIsAuctionExpiredParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeIsAuctionExpiredParams(options: IsAuctionExpiredParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Decodes the result of the isAuctionExpired function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeIsAuctionExpiredResult } from "thirdweb/extensions/marketplace";
 * const result = decodeIsAuctionExpiredResult("...");
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
