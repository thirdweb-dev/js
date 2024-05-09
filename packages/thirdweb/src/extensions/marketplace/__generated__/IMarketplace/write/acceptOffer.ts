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
 * Represents the parameters for the "acceptOffer" function.
 */
export type AcceptOfferParams = WithOverrides<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  offeror: AbiParameterToPrimitiveType<{ type: "address"; name: "_offeror" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  totalPrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_totalPrice";
  }>;
}>;

export const FN_SELECTOR = "0xb13c0e63" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_listingId",
  },
  {
    type: "address",
    name: "_offeror",
  },
  {
    type: "address",
    name: "_currency",
  },
  {
    type: "uint256",
    name: "_totalPrice",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `acceptOffer` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `acceptOffer` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isAcceptOfferSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = await isAcceptOfferSupported(contract);
 * ```
 */
export async function isAcceptOfferSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "acceptOffer" function.
 * @param options - The options for the acceptOffer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeAcceptOfferParams } "thirdweb/extensions/marketplace";
 * const result = encodeAcceptOfferParams({
 *  listingId: ...,
 *  offeror: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 * ```
 */
export function encodeAcceptOfferParams(options: AcceptOfferParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.offeror,
    options.currency,
    options.totalPrice,
  ]);
}

/**
 * Encodes the "acceptOffer" function into a Hex string with its parameters.
 * @param options - The options for the acceptOffer function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeAcceptOffer } "thirdweb/extensions/marketplace";
 * const result = encodeAcceptOffer({
 *  listingId: ...,
 *  offeror: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 * ```
 */
export function encodeAcceptOffer(options: AcceptOfferParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeAcceptOfferParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "acceptOffer" function on the contract.
 * @param options - The options for the "acceptOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { acceptOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = acceptOffer({
 *  contract,
 *  listingId: ...,
 *  offeror: ...,
 *  currency: ...,
 *  totalPrice: ...,
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
export function acceptOffer(
  options: BaseTransactionOptions<
    | AcceptOfferParams
    | {
        asyncParams: () => Promise<AcceptOfferParams>;
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
        resolvedOptions.offeror,
        resolvedOptions.currency,
        resolvedOptions.totalPrice,
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
