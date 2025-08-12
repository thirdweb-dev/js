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
 * Represents the parameters for the "acceptOffer" function.
 */
export type AcceptOfferParams = WithOverrides<{
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
}>;

export const FN_SELECTOR = "0xc815729d" as const;
const FN_INPUTS = [
  {
    name: "_offerId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `acceptOffer` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `acceptOffer` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isAcceptOfferSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isAcceptOfferSupported(["0x..."]);
 * ```
 */
export function isAcceptOfferSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeAcceptOfferParams } from "thirdweb/extensions/marketplace";
 * const result = encodeAcceptOfferParams({
 *  offerId: ...,
 * });
 * ```
 */
export function encodeAcceptOfferParams(options: AcceptOfferParams) {
  return encodeAbiParameters(FN_INPUTS, [options.offerId]);
}

/**
 * Encodes the "acceptOffer" function into a Hex string with its parameters.
 * @param options - The options for the acceptOffer function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeAcceptOffer } from "thirdweb/extensions/marketplace";
 * const result = encodeAcceptOffer({
 *  offerId: ...,
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
 * import { sendTransaction } from "thirdweb";
 * import { acceptOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = acceptOffer({
 *  contract,
 *  offerId: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
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
      return [resolvedOptions.offerId] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
