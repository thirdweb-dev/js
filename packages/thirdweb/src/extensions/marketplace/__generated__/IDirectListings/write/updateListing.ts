import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "updateListing" function.
 */

export type UpdateListingParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "quantity" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "pricePerToken" },
      { type: "uint128"; name: "startTimestamp" },
      { type: "uint128"; name: "endTimestamp" },
      { type: "bool"; name: "reserved" },
    ];
  }>;
};

export const FN_SELECTOR = "0x07b67758" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "tuple",
    name: "_params",
    components: [
      {
        type: "address",
        name: "assetContract",
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
        type: "address",
        name: "currency",
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
        type: "bool",
        name: "reserved",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "updateListing" function.
 * @param options - The options for the updateListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeUpdateListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeUpdateListingParams({
 *  listingId: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeUpdateListingParams(options: UpdateListingParams) {
  return encodeAbiParameters(FN_INPUTS, [options.listingId, options.params]);
}

/**
 * Calls the "updateListing" function on the contract.
 * @param options - The options for the "updateListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { updateListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = updateListing({
 *  contract,
 *  listingId: ...,
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function updateListing(
  options: BaseTransactionOptions<
    | UpdateListingParams
    | {
        asyncParams: () => Promise<UpdateListingParams>;
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
            return [resolvedParams.listingId, resolvedParams.params] as const;
          }
        : [options.listingId, options.params],
  });
}
