import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isBuyerApprovedForListing" function.
 */
export type IsBuyerApprovedForListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyer: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyer" }>;
};

export const FN_SELECTOR = "0x9cfbe2a6" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_buyer",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "isBuyerApprovedForListing" function.
 * @param options - The options for the isBuyerApprovedForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsBuyerApprovedForListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeIsBuyerApprovedForListingParams({
 *  listingId: ...,
 *  buyer: ...,
 * });
 * ```
 */
export function encodeIsBuyerApprovedForListingParams(
  options: IsBuyerApprovedForListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId, options.buyer]);
}

/**
 * Decodes the result of the isBuyerApprovedForListing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeIsBuyerApprovedForListingResult } from "thirdweb/extensions/marketplace";
 * const result = decodeIsBuyerApprovedForListingResult("...");
 * ```
 */
export function decodeIsBuyerApprovedForListingResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isBuyerApprovedForListing" function on the contract.
 * @param options - The options for the isBuyerApprovedForListing function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isBuyerApprovedForListing } from "thirdweb/extensions/marketplace";
 *
 * const result = await isBuyerApprovedForListing({
 *  listingId: ...,
 *  buyer: ...,
 * });
 *
 * ```
 */
export async function isBuyerApprovedForListing(
  options: BaseTransactionOptions<IsBuyerApprovedForListingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.listingId, options.buyer],
  });
}
