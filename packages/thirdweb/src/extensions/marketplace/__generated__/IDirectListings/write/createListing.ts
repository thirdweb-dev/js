import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "createListing" function.
 */

type CreateListingParamsInternal = {
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

export type CreateListingParams = Prettify<
  | CreateListingParamsInternal
  | {
      asyncParams: () => Promise<CreateListingParamsInternal>;
    }
>;
const METHOD = [
  "0x746415b5",
  [
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
  ],
  [
    {
      type: "uint256",
      name: "listingId",
    },
  ],
] as const;

/**
 * Calls the "createListing" function on the contract.
 * @param options - The options for the "createListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { createListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createListing({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createListing(
  options: BaseTransactionOptions<CreateListingParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.params] as const;
          }
        : [options.params],
  });
}
