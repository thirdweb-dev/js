import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "updateListing" function.
 */
export type UpdateListingParams = WithOverrides<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  quantityToList: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_quantityToList";
  }>;
  reservePricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_reservePricePerToken";
  }>;
  buyoutPricePerToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_buyoutPricePerToken";
  }>;
  currencyToAccept: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_currencyToAccept";
  }>;
  startTime: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_startTime";
  }>;
  secondsUntilEndTime: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_secondsUntilEndTime";
  }>;
}>;

export const FN_SELECTOR = "0xc4b5b15f" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "uint256",
    name: "_quantityToList",
  },
  {
    type: "uint256",
    name: "_reservePricePerToken",
  },
  {
    type: "uint256",
    name: "_buyoutPricePerToken",
  },
  {
    type: "address",
    name: "_currencyToAccept",
  },
  {
    type: "uint256",
    name: "_startTime",
  },
  {
    type: "uint256",
    name: "_secondsUntilEndTime",
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
 *  quantityToList: ...,
 *  reservePricePerToken: ...,
 *  buyoutPricePerToken: ...,
 *  currencyToAccept: ...,
 *  startTime: ...,
 *  secondsUntilEndTime: ...,
 * });
 * ```
 */
export function encodeUpdateListingParams(options: UpdateListingParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.quantityToList,
    options.reservePricePerToken,
    options.buyoutPricePerToken,
    options.currencyToAccept,
    options.startTime,
    options.secondsUntilEndTime,
  ]);
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
 *  quantityToList: ...,
 *  reservePricePerToken: ...,
 *  buyoutPricePerToken: ...,
 *  currencyToAccept: ...,
 *  startTime: ...,
 *  secondsUntilEndTime: ...,
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
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.listingId,
        resolvedOptions.quantityToList,
        resolvedOptions.reservePricePerToken,
        resolvedOptions.buyoutPricePerToken,
        resolvedOptions.currencyToAccept,
        resolvedOptions.startTime,
        resolvedOptions.secondsUntilEndTime,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
