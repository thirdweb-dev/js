import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getListing" function.
 */
export type GetListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
};

export const FN_SELECTOR = "0x107a274a" as const;
const FN_INPUTS = [
  {
    name: "_listingId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    components: [
      {
        name: "listingId",
        type: "uint256",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "quantity",
        type: "uint256",
      },
      {
        name: "pricePerToken",
        type: "uint256",
      },
      {
        name: "startTimestamp",
        type: "uint128",
      },
      {
        name: "endTimestamp",
        type: "uint128",
      },
      {
        name: "listingCreator",
        type: "address",
      },
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "tokenType",
        type: "uint8",
      },
      {
        name: "status",
        type: "uint8",
      },
      {
        name: "reserved",
        type: "bool",
      },
    ],
    name: "listing",
    type: "tuple",
  },
] as const;

/**
 * Checks if the `getListing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isGetListingSupported } from "thirdweb/extensions/marketplace";
 * const supported = isGetListingSupported(["0x..."]);
 * ```
 */
export function isGetListingSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getListing" function.
 * @param options - The options for the getListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetListingParams } from "thirdweb/extensions/marketplace";
 * const result = encodeGetListingParams({
 *  listingId: ...,
 * });
 * ```
 */
export function encodeGetListingParams(options: GetListingParams) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId]);
}

/**
 * Encodes the "getListing" function into a Hex string with its parameters.
 * @param options - The options for the getListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeGetListing } from "thirdweb/extensions/marketplace";
 * const result = encodeGetListing({
 *  listingId: ...,
 * });
 * ```
 */
export function encodeGetListing(options: GetListingParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getListing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeGetListingResult } from "thirdweb/extensions/marketplace";
 * const result = decodeGetListingResultResult("...");
 * ```
 */
export function decodeGetListingResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getListing" function on the contract.
 * @param options - The options for the getListing function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getListing } from "thirdweb/extensions/marketplace";
 *
 * const result = await getListing({
 *  contract,
 *  listingId: ...,
 * });
 *
 * ```
 */
export async function getListing(
  options: BaseTransactionOptions<GetListingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.listingId],
  });
}
