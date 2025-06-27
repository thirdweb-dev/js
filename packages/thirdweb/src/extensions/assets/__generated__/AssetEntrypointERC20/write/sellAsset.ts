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
 * Represents the parameters for the "sellAsset" function.
 */
export type SellAssetParams = WithOverrides<{
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
      { type: "bytes"; name: "data" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x5de3eedb" as const;
const FN_INPUTS = [
  {
    name: "asset",
    type: "address",
  },
  {
    components: [
      {
        name: "recipient",
        type: "address",
      },
      {
        name: "tokenOut",
        type: "address",
      },
      {
        name: "amountIn",
        type: "uint256",
      },
      {
        name: "minAmountOut",
        type: "uint256",
      },
      {
        name: "deadline",
        type: "uint256",
      },
      {
        name: "data",
        type: "bytes",
      },
    ],
    name: "params",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "amountIn",
    type: "uint256",
  },
  {
    name: "amountOut",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `sellAsset` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `sellAsset` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isSellAssetSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isSellAssetSupported(["0x..."]);
 * ```
 */
export function isSellAssetSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "sellAsset" function.
 * @param options - The options for the sellAsset function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSellAssetParams } from "thirdweb/extensions/assets";
 * const result = encodeSellAssetParams({
 *  asset: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeSellAssetParams(options: SellAssetParams) {
  return encodeAbiParameters(FN_INPUTS, [options.asset, options.params]);
}

/**
 * Encodes the "sellAsset" function into a Hex string with its parameters.
 * @param options - The options for the sellAsset function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeSellAsset } from "thirdweb/extensions/assets";
 * const result = encodeSellAsset({
 *  asset: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeSellAsset(options: SellAssetParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeSellAssetParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "sellAsset" function on the contract.
 * @param options - The options for the "sellAsset" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { sellAsset } from "thirdweb/extensions/assets";
 *
 * const transaction = sellAsset({
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
export function sellAsset(
  options: BaseTransactionOptions<
    | SellAssetParams
    | {
        asyncParams: () => Promise<SellAssetParams>;
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
      return [resolvedOptions.asset, resolvedOptions.params] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
