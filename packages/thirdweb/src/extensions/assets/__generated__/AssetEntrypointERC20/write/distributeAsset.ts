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
 * Represents the parameters for the "distributeAsset" function.
 */
export type DistributeAssetParams = WithOverrides<{
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
  contents: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "contents";
    components: [
      { type: "uint256"; name: "amount" },
      { type: "address"; name: "recipient" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x5954167a" as const;
const FN_INPUTS = [
  {
    name: "asset",
    type: "address",
  },
  {
    components: [
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "recipient",
        type: "address",
      },
    ],
    name: "contents",
    type: "tuple[]",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `distributeAsset` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `distributeAsset` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isDistributeAssetSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isDistributeAssetSupported(["0x..."]);
 * ```
 */
export function isDistributeAssetSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "distributeAsset" function.
 * @param options - The options for the distributeAsset function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeDistributeAssetParams } from "thirdweb/extensions/assets";
 * const result = encodeDistributeAssetParams({
 *  asset: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeDistributeAssetParams(options: DistributeAssetParams) {
  return encodeAbiParameters(FN_INPUTS, [options.asset, options.contents]);
}

/**
 * Encodes the "distributeAsset" function into a Hex string with its parameters.
 * @param options - The options for the distributeAsset function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeDistributeAsset } from "thirdweb/extensions/assets";
 * const result = encodeDistributeAsset({
 *  asset: ...,
 *  contents: ...,
 * });
 * ```
 */
export function encodeDistributeAsset(options: DistributeAssetParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeDistributeAssetParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "distributeAsset" function on the contract.
 * @param options - The options for the "distributeAsset" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { distributeAsset } from "thirdweb/extensions/assets";
 *
 * const transaction = distributeAsset({
 *  contract,
 *  asset: ...,
 *  contents: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function distributeAsset(
  options: BaseTransactionOptions<
    | DistributeAssetParams
    | {
        asyncParams: () => Promise<DistributeAssetParams>;
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
      return [resolvedOptions.asset, resolvedOptions.contents] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
