import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "offer" function.
 */

export type OfferParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  quantityWanted: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_quantityWanted";
  }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  pricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_pricePerToken";
  }>;
  expirationTimestamp: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_expirationTimestamp";
  }>;
};

export const FN_SELECTOR = "0x5fef45e7" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "uint256",
    name: "_quantityWanted",
  },
  {
    type: "address",
    name: "_currency",
  },
  {
    type: "uint256",
    name: "_pricePerToken",
  },
  {
    type: "uint256",
    name: "_expirationTimestamp",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "offer" function.
 * @param options - The options for the offer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeOfferParams } "thirdweb/extensions/marketplace";
 * const result = encodeOfferParams({
 *  listingId: ...,
 *  quantityWanted: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  expirationTimestamp: ...,
 * });
 * ```
 */
export function encodeOfferParams(options: OfferParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.quantityWanted,
    options.currency,
    options.pricePerToken,
    options.expirationTimestamp,
  ]);
}

/**
 * Calls the "offer" function on the contract.
 * @param options - The options for the "offer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { offer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = offer({
 *  contract,
 *  listingId: ...,
 *  quantityWanted: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  expirationTimestamp: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function offer(
  options: BaseTransactionOptions<
    | OfferParams
    | {
        asyncParams: () => Promise<OfferParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.listingId,
              resolvedParams.quantityWanted,
              resolvedParams.currency,
              resolvedParams.pricePerToken,
              resolvedParams.expirationTimestamp,
            ] as const;
          }
        : [
            options.listingId,
            options.quantityWanted,
            options.currency,
            options.pricePerToken,
            options.expirationTimestamp,
          ],
  });
}
