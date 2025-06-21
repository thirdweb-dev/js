import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "_listingId",
    type: "uint256",
  },
  {
    name: "_buyer",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isBuyerApprovedForListing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isBuyerApprovedForListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isIsBuyerApprovedForListingSupported } from "thirdweb/extensions/marketplace";
 * const supported = isIsBuyerApprovedForListingSupported(["0x..."]);
 * ```
 */
export function isIsBuyerApprovedForListingSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isBuyerApprovedForListing" function.
 * @param options - The options for the isBuyerApprovedForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsBuyerApprovedForListingParams } from "thirdweb/extensions/marketplace";
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
 * Encodes the "isBuyerApprovedForListing" function into a Hex string with its parameters.
 * @param options - The options for the isBuyerApprovedForListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsBuyerApprovedForListing } from "thirdweb/extensions/marketplace";
 * const result = encodeIsBuyerApprovedForListing({
 *  listingId: ...,
 *  buyer: ...,
 * });
 * ```
 */
export function encodeIsBuyerApprovedForListing(
  options: IsBuyerApprovedForListingParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsBuyerApprovedForListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isBuyerApprovedForListing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeIsBuyerApprovedForListingResult } from "thirdweb/extensions/marketplace";
 * const result = decodeIsBuyerApprovedForListingResultResult("...");
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
 *  contract,
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
