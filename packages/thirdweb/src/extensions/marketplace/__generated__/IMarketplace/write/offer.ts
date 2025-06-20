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
 * Represents the parameters for the "offer" function.
 */
export type OfferParams = WithOverrides<{
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
}>;

export const FN_SELECTOR = "0x5fef45e7" as const;
const FN_INPUTS = [
  {
    name: "_listingId",
    type: "uint256",
  },
  {
    name: "_quantityWanted",
    type: "uint256",
  },
  {
    name: "_currency",
    type: "address",
  },
  {
    name: "_pricePerToken",
    type: "uint256",
  },
  {
    name: "_expirationTimestamp",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `offer` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `offer` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isOfferSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isOfferSupported(["0x..."]);
 * ```
 */
export function isOfferSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "offer" function.
 * @param options - The options for the offer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeOfferParams } from "thirdweb/extensions/marketplace";
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
 * Encodes the "offer" function into a Hex string with its parameters.
 * @param options - The options for the offer function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeOffer } from "thirdweb/extensions/marketplace";
 * const result = encodeOffer({
 *  listingId: ...,
 *  quantityWanted: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  expirationTimestamp: ...,
 * });
 * ```
 */
export function encodeOffer(options: OfferParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOfferParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "offer" function on the contract.
 * @param options - The options for the "offer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { offer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = offer({
 *  contract,
 *  listingId: ...,
 *  quantityWanted: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  expirationTimestamp: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
        resolvedOptions.quantityWanted,
        resolvedOptions.currency,
        resolvedOptions.pricePerToken,
        resolvedOptions.expirationTimestamp,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
