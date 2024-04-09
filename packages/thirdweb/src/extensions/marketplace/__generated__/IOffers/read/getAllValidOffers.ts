import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getAllValidOffers" function.
 */
export type GetAllValidOffersParams = {
  startId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_startId" }>;
  endId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_endId" }>;
};

export const FN_SELECTOR = "0x91940b3e" as const;
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
    name: "offers",
    components: [
      {
        type: "uint256",
        name: "offerId",
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
        name: "totalPrice",
      },
      {
        type: "uint256",
        name: "expirationTimestamp",
      },
      {
        type: "address",
        name: "offeror",
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
 * Encodes the parameters for the "getAllValidOffers" function.
 * @param options - The options for the getAllValidOffers function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetAllValidOffersParams } "thirdweb/extensions/marketplace";
 * const result = encodeGetAllValidOffersParams({
 *  startId: ...,
 *  endId: ...,
 * });
 * ```
 */
export function encodeGetAllValidOffersParams(
  options: GetAllValidOffersParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.startId, options.endId]);
}

/**
 * Decodes the result of the getAllValidOffers function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetAllValidOffersResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetAllValidOffersResult("...");
 * ```
 */
export function decodeGetAllValidOffersResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getAllValidOffers" function on the contract.
 * @param options - The options for the getAllValidOffers function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getAllValidOffers } from "thirdweb/extensions/marketplace";
 *
 * const result = await getAllValidOffers({
 *  startId: ...,
 *  endId: ...,
 * });
 *
 * ```
 */
export async function getAllValidOffers(
  options: BaseTransactionOptions<GetAllValidOffersParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.startId, options.endId],
  });
}
