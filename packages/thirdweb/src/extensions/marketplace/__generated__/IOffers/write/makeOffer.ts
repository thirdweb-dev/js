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
 * Represents the parameters for the "makeOffer" function.
 */
export type MakeOfferParams = WithOverrides<{
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "quantity" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "totalPrice" },
      { type: "uint256"; name: "expirationTimestamp" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x016767fa" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "assetContract",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "quantity",
        type: "uint256",
      },
      {
        name: "currency",
        type: "address",
      },
      {
        name: "totalPrice",
        type: "uint256",
      },
      {
        name: "expirationTimestamp",
        type: "uint256",
      },
    ],
    name: "_params",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "offerId",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `makeOffer` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `makeOffer` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isMakeOfferSupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isMakeOfferSupported(["0x..."]);
 * ```
 */
export function isMakeOfferSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "makeOffer" function.
 * @param options - The options for the makeOffer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeMakeOfferParams } from "thirdweb/extensions/marketplace";
 * const result = encodeMakeOfferParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeMakeOfferParams(options: MakeOfferParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Encodes the "makeOffer" function into a Hex string with its parameters.
 * @param options - The options for the makeOffer function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeMakeOffer } from "thirdweb/extensions/marketplace";
 * const result = encodeMakeOffer({
 *  params: ...,
 * });
 * ```
 */
export function encodeMakeOffer(options: MakeOfferParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeMakeOfferParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "makeOffer" function on the contract.
 * @param options - The options for the "makeOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { makeOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = makeOffer({
 *  contract,
 *  params: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function makeOffer(
  options: BaseTransactionOptions<
    | MakeOfferParams
    | {
        asyncParams: () => Promise<MakeOfferParams>;
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
      return [resolvedOptions.params] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
