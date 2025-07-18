import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "swap" function.
 */
export type SwapParams = WithOverrides<{
  config: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "config";
    components: [
      { type: "address"; name: "tokenIn" },
      { type: "address"; name: "tokenOut" },
      { type: "uint256"; name: "amountIn" },
      { type: "uint256"; name: "minAmountOut" },
      { type: "address"; name: "recipient" },
      { type: "address"; name: "refundRecipient" },
      { type: "uint256"; name: "deadline" },
      { type: "bytes"; name: "data" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x8892376c" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "config",
    components: [
      {
        type: "address",
        name: "tokenIn",
      },
      {
        type: "address",
        name: "tokenOut",
      },
      {
        type: "uint256",
        name: "amountIn",
      },
      {
        type: "uint256",
        name: "minAmountOut",
      },
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "address",
        name: "refundRecipient",
      },
      {
        type: "uint256",
        name: "deadline",
      },
      {
        type: "bytes",
        name: "data",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "result",
    components: [
      {
        type: "uint256",
        name: "amountIn",
      },
      {
        type: "uint256",
        name: "amountOut",
      },
      {
        type: "address",
        name: "source",
      },
    ],
  },
] as const;

/**
 * Checks if the `swap` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `swap` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isSwapSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isSwapSupported(["0x..."]);
 * ```
 */
export function isSwapSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "swap" function.
 * @param options - The options for the swap function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSwapParams } from "thirdweb/extensions/assets";
 * const result = encodeSwapParams({
 *  config: ...,
 * });
 * ```
 */
export function encodeSwapParams(options: SwapParams) {
  return encodeAbiParameters(FN_INPUTS, [options.config]);
}

/**
 * Encodes the "swap" function into a Hex string with its parameters.
 * @param options - The options for the swap function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSwap } from "thirdweb/extensions/assets";
 * const result = encodeSwap({
 *  config: ...,
 * });
 * ```
 */
export function encodeSwap(options: SwapParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSwapParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "swap" function on the contract.
 * @param options - The options for the "swap" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { swap } from "thirdweb/extensions/assets";
 *
 * const transaction = swap({
 *  contract,
 *  config: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function swap(
  options: BaseTransactionOptions<
    | SwapParams
    | {
        asyncParams: () => Promise<SwapParams>;
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
      return [resolvedOptions.config] as const;
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}
