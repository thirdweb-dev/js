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
 * Represents the parameters for the "approveBuyerForListing" function.
 */
export type ApproveBuyerForListingParams = WithOverrides<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyer: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyer" }>;
  toApprove: AbiParameterToPrimitiveType<{ type: "bool"; name: "_toApprove" }>;
}>;

export const FN_SELECTOR = "0x48dd77df" as const;
const FN_INPUTS = [
  {
    name: "_listingId",
    type: "uint256",
  },
  {
    name: "_buyer",
    type: "address",
  },
  {
    name: "_toApprove",
    type: "bool",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `approveBuyerForListing` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `approveBuyerForListing` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isApproveBuyerForListingSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isApproveBuyerForListingSupported(["0x..."]);
 * ```
 */
export function isApproveBuyerForListingSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "approveBuyerForListing" function.
 * @param options - The options for the approveBuyerForListing function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeApproveBuyerForListingParams } from "thirdweb/extensions/marketplace";
 * const result = encodeApproveBuyerForListingParams({
 *  listingId: ...,
 *  buyer: ...,
 *  toApprove: ...,
 * });
 * ```
 */
export function encodeApproveBuyerForListingParams(
  options: ApproveBuyerForListingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.buyer,
    options.toApprove,
  ]);
}

/**
 * Encodes the "approveBuyerForListing" function into a Hex string with its parameters.
 * @param options - The options for the approveBuyerForListing function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeApproveBuyerForListing } from "thirdweb/extensions/marketplace";
 * const result = encodeApproveBuyerForListing({
 *  listingId: ...,
 *  buyer: ...,
 *  toApprove: ...,
 * });
 * ```
 */
export function encodeApproveBuyerForListing(
  options: ApproveBuyerForListingParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeApproveBuyerForListingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "approveBuyerForListing" function on the contract.
 * @param options - The options for the "approveBuyerForListing" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { approveBuyerForListing } from "thirdweb/extensions/marketplace";
 *
 * const transaction = approveBuyerForListing({
 *  contract,
 *  listingId: ...,
 *  buyer: ...,
 *  toApprove: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function approveBuyerForListing(
  options: BaseTransactionOptions<
    | ApproveBuyerForListingParams
    | {
        asyncParams: () => Promise<ApproveBuyerForListingParams>;
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
        resolvedOptions.buyer,
        resolvedOptions.toApprove,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
