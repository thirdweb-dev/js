import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "_listingId",
    type: "uint256",
  },
  {
    name: "_quantityToList",
    type: "uint256",
  },
  {
    name: "_reservePricePerToken",
    type: "uint256",
  },
  {
    name: "_buyoutPricePerToken",
    type: "uint256",
  },
  {
    name: "_currencyToAccept",
    type: "address",
  },
  {
    name: "_startTime",
    type: "uint256",
  },
  {
    name: "_secondsUntilEndTime",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `updateListing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `updateListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isUpdateListingSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isUpdateListingSupported(["0x..."]);
 * ```
 */
export function isUpdateListingSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "updateListing" function.
 * @param options - The options for the updateListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeUpdateListingParams } from "thirdweb/extensions/marketplace";
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
 * Encodes the "updateListing" function into a Hex string with its parameters.
 * @param options - The options for the updateListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeUpdateListing } from "thirdweb/extensions/marketplace";
 * const result = encodeUpdateListing({
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
export function encodeUpdateListing(options: UpdateListingParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeUpdateListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "updateListing" function on the contract.
 * @param options - The options for the "updateListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
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
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
    contract: options.contract,
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
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
