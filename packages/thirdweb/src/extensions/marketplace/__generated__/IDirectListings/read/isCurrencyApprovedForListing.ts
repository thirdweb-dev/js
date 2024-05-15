import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "isCurrencyApprovedForListing" function.
 */
export type IsCurrencyApprovedForListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
};

export const FN_SELECTOR = "0xa8519047" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_currency",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isCurrencyApprovedForListing` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `isCurrencyApprovedForListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isIsCurrencyApprovedForListingSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isIsCurrencyApprovedForListingSupported(contract);
 * ```
 */
export async function isIsCurrencyApprovedForListingSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isCurrencyApprovedForListing" function.
 * @param options - The options for the isCurrencyApprovedForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsCurrencyApprovedForListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeIsCurrencyApprovedForListingParams({
 *  listingId: ...,
 *  currency: ...,
 * });
 * ```
 */
export function encodeIsCurrencyApprovedForListingParams(
  options: IsCurrencyApprovedForListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId, options.currency]);
}

/**
 * Encodes the "isCurrencyApprovedForListing" function into a Hex string with its parameters.
 * @param options - The options for the isCurrencyApprovedForListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeIsCurrencyApprovedForListing } "thirdweb/extensions/marketplace";
 * const result = encodeIsCurrencyApprovedForListing({
 *  listingId: ...,
 *  currency: ...,
 * });
 * ```
 */
export function encodeIsCurrencyApprovedForListing(
  options: IsCurrencyApprovedForListingParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsCurrencyApprovedForListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isCurrencyApprovedForListing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { decodeIsCurrencyApprovedForListingResult } from "thirdweb/extensions/marketplace";
 * const result = decodeIsCurrencyApprovedForListingResult("...");
 * ```
 */
export function decodeIsCurrencyApprovedForListingResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isCurrencyApprovedForListing" function on the contract.
 * @param options - The options for the isCurrencyApprovedForListing function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isCurrencyApprovedForListing } from "thirdweb/extensions/marketplace";
 *
 * const result = await isCurrencyApprovedForListing({
 *  contract,
 *  listingId: ...,
 *  currency: ...,
 * });
 *
 * ```
 */
export async function isCurrencyApprovedForListing(
  options: BaseTransactionOptions<IsCurrencyApprovedForListingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.listingId, options.currency],
  });
}
