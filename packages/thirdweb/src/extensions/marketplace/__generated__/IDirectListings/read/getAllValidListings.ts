import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAllValidListings" function.
 */
export type GetAllValidListingsParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

export const FN_SELECTOR = "0x31654b4d" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_startId",
  },
  {
    type: "uint256",
    name: "_endId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    name: "listings",
    components: [
      {
        type: "uint256",
        name: "listingId",
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
        name: "pricePerToken",
      },
      {
        type: "uint128",
        name: "startTimestamp",
      },
      {
        type: "uint128",
        name: "endTimestamp",
      },
      {
        type: "address",
        name: "listingCreator",
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
      {
        type: "bool",
        name: "reserved",
      },
    ],
  },
] as const;

/**
 * Encodes the parameters for the "getAllValidListings" function.
 * @param options - The options for the getAllValidListings function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllValidListingsParams } "thirdweb/extensions/marketplace";
 * const result = encodeGetAllValidListingsParams({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllValidListingsParams(
  options: GetAllValidListingsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.startId, options.endId]);
}

/**
 * Decodes the result of the getAllValidListings function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAllValidListingsResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAllValidListingsResult("...");
 * ```
 */
export function decodeGetAllValidListingsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllValidListings" function on the contract.
 * @param options - The options for the getAllValidListings function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAllValidListings } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllValidListings({
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllValidListings(
  options: BaseTransactionOptions<GetAllValidListingsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.startId, options.endId],
  });
}
