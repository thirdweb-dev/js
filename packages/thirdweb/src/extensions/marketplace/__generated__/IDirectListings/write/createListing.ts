import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "createListing" function.
 */

export type CreateListingParams = {
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

export const FN_SELECTOR = "0x746415b5" as const;
const FN_INPUTS = [
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
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "listingId",
  },
] as const;

/**
 * Encodes the parameters for the "createListing" function.
 * @param options - The options for the createListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCreateListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeCreateListingParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateListingParams(options: CreateListingParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Calls the "createListing" function on the contract.
 * @param options - The options for the "createListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { createListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createListing({
 *  contract,
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createListing(
  options: BaseTransactionOptions<
    | CreateListingParams
    | {
        asyncParams: () => Promise<CreateListingParams>;
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
            return [resolvedParams.params] as const;
          }
        : [options.params],
  });
}
