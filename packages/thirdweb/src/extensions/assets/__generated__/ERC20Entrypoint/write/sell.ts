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
 * Represents the parameters for the "sell" function.
 */
export type SellParams = WithOverrides<{
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "address"; name: "recipient" },
      { type: "address"; name: "tokenOut" },
      { type: "uint256"; name: "amountIn" },
      { type: "uint256"; name: "minAmountOut" },
      { type: "uint256"; name: "deadline" },
      { type: "bytes"; name: "hookData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0xfbc84f15" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "asset",
  },
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "address",
        name: "recipient",
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
        type: "uint256",
        name: "deadline",
      },
      {
        type: "bytes",
        name: "hookData",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountIn",
  },
  {
    type: "uint256",
    name: "amountOut",
  },
] as const;

/**
 * Checks if the `sell` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `sell` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isSellSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isSellSupported(["0x..."]);
 * ```
 */
export function isSellSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "sell" function.
 * @param options - The options for the sell function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSellParams } from "thirdweb/extensions/assets";
 * const result = encodeSellParams({
 *  asset: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeSellParams(options: SellParams) {
  return encodeAbiParameters(FN_INPUTS, [options.asset, options.params]);
}

/**
 * Encodes the "sell" function into a Hex string with its parameters.
 * @param options - The options for the sell function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSell } from "thirdweb/extensions/assets";
 * const result = encodeSell({
 *  asset: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeSell(options: SellParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSellParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "sell" function on the contract.
 * @param options - The options for the "sell" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { sell } from "thirdweb/extensions/assets";
 *
 * const transaction = sell({
 *  contract,
 *  asset: ...,
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
export function sell(
  options: BaseTransactionOptions<
    | SellParams
    | {
        asyncParams: () => Promise<SellParams>;
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
      return [resolvedOptions.asset, resolvedOptions.params] as const;
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
