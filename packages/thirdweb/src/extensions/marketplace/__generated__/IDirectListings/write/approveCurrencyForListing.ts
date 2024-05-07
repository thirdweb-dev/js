import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "approveCurrencyForListing" function.
 */
export type ApproveCurrencyForListingParams = WithOverrides<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  pricePerTokenInCurrency: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_pricePerTokenInCurrency";
  }>;
}>;

export const FN_SELECTOR = "0xea8f9a3c" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_currency",
  },
  {
    type: "uint256",
    name: "_pricePerTokenInCurrency",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `approveCurrencyForListing` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `approveCurrencyForListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isApproveCurrencyForListingSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isApproveCurrencyForListingSupported(contract);
 * ```
 */
export async function isApproveCurrencyForListingSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "approveCurrencyForListing" function.
 * @param options - The options for the approveCurrencyForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeApproveCurrencyForListingParams } "thirdweb/extensions/marketplace";
 * const result = encodeApproveCurrencyForListingParams({
 *  listingId: ...,
 *  currency: ...,
 *  pricePerTokenInCurrency: ...,
 * });
 * ```
 */
export function encodeApproveCurrencyForListingParams(
  options: ApproveCurrencyForListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.currency,
    options.pricePerTokenInCurrency,
  ]);
}

/**
 * Encodes the "approveCurrencyForListing" function into a Hex string with its parameters.
 * @param options - The options for the approveCurrencyForListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeApproveCurrencyForListing } "thirdweb/extensions/marketplace";
 * const result = encodeApproveCurrencyForListing({
 *  listingId: ...,
 *  currency: ...,
 *  pricePerTokenInCurrency: ...,
 * });
 * ```
 */
export function encodeApproveCurrencyForListing(
  options: ApproveCurrencyForListingParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeApproveCurrencyForListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "approveCurrencyForListing" function on the contract.
 * @param options - The options for the "approveCurrencyForListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { approveCurrencyForListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = approveCurrencyForListing({
 *  contract,
 *  listingId: ...,
 *  currency: ...,
 *  pricePerTokenInCurrency: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approveCurrencyForListing(
  options: BaseTransactionOptions<
    | ApproveCurrencyForListingParams
    | {
        asyncParams: () => Promise<ApproveCurrencyForListingParams>;
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
        resolvedOptions.currency,
        resolvedOptions.pricePerTokenInCurrency,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
  });
}
