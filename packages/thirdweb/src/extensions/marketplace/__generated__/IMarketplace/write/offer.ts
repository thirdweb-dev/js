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
 * Checks if the `offer` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `offer` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isOfferSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isOfferSupported(contract);
 * ```
 */
export async function isOfferSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
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
 * Encodes the "offer" function into a Hex string with its parameters.
 * @param options - The options for the offer function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeOffer } "thirdweb/extensions/marketplace";
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
        resolvedOptions.quantityWanted,
        resolvedOptions.currency,
        resolvedOptions.pricePerToken,
        resolvedOptions.expirationTimestamp,
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
