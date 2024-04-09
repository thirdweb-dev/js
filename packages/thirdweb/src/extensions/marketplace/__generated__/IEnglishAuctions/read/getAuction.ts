import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAuction" function.
 */
export type GetAuctionParams = {
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
};

export const FN_SELECTOR = "0x78bd7935" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "auction",
    components: [
      {
        type: "uint256",
        name: "auctionId",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "quantity",
      },
      {
        type: "uint256",
        name: "minimumBidAmount",
      },
      {
        type: "uint256",
        name: "buyoutBidAmount",
      },
      {
        type: "uint64",
        name: "timeBufferInSeconds",
      },
      {
        type: "uint64",
        name: "bidBufferBps",
      },
      {
        type: "uint64",
        name: "startTimestamp",
      },
      {
        type: "uint64",
        name: "endTimestamp",
      },
      {
        type: "address",
        name: "auctionCreator",
      },
      {
        type: "address",
        name: "assetContract",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint8",
        name: "tokenType",
      },
      {
        type: "uint8",
        name: "status",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "getAuction" function.
 * @param options - The options for the getAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAuctionParams } "thirdweb/extensions/marketplace";
 * const result = encodeGetAuctionParams({
 *  auctionId: ...,
 * });
 * ```
 */
export function encodeGetAuctionParams(options: GetAuctionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId]);
}

/**
 * Decodes the result of the getAuction function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAuctionResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAuctionResult("...");
 * ```
 */
export function decodeGetAuctionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAuction" function on the contract.
 * @param options - The options for the getAuction function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAuction } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAuction({
 *  auctionId: ...,
 * });
 *
 * ```
 */
export async function getAuction(
  options: BaseTransactionOptions<GetAuctionParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.auctionId],
  });
}
