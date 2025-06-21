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
 * Represents the parameters for the "buy" function.
 */
export type BuyParams = WithOverrides<{
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyFor: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyFor" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  totalPrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_totalPrice";
  }>;
}>;

export const FN_SELECTOR = "0x7687ab02" as const;
const FN_INPUTS = [
  {
    name: "_listingId",
    type: "uint256",
  },
  {
    name: "_buyFor",
    type: "address",
  },
  {
    name: "_quantity",
    type: "uint256",
  },
  {
    name: "_currency",
    type: "address",
  },
  {
    name: "_totalPrice",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `buy` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `buy` method is supported.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { isBuySupported } from "thirdweb/extensions/marketplace";
 *
 * const supported = isBuySupported(["0x..."]);
 * ```
 */
export function isBuySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "buy" function.
 * @param options - The options for the buy function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeBuyParams } from "thirdweb/extensions/marketplace";
 * const result = encodeBuyParams({
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 * ```
 */
export function encodeBuyParams(options: BuyParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.buyFor,
    options.quantity,
    options.currency,
    options.totalPrice,
  ]);
}

/**
 * Encodes the "buy" function into a Hex string with its parameters.
 * @param options - The options for the buy function.
 * @returns The encoded hexadecimal string.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeBuy } from "thirdweb/extensions/marketplace";
 * const result = encodeBuy({
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 * ```
 */
export function encodeBuy(options: BuyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeBuyParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "buy" function on the contract.
 * @param options - The options for the "buy" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { buy } from "thirdweb/extensions/marketplace";
 *
 * const transaction = buy({
 *  contract,
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  totalPrice: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function buy(
  options: BaseTransactionOptions<
    | BuyParams
    | {
        asyncParams: () => Promise<BuyParams>;
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
        resolvedOptions.buyFor,
        resolvedOptions.quantity,
        resolvedOptions.currency,
        resolvedOptions.totalPrice,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
