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
 * Represents the parameters for the "listAsset" function.
 */
export type ListAssetParams = WithOverrides<{
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "address"; name: "tokenIn" },
      { type: "uint256"; name: "price" },
      { type: "uint256"; name: "duration" },
      { type: "bytes"; name: "data" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x80ac2260" as const;
const FN_INPUTS = [
  {
    name: "asset",
    type: "address",
  },
  {
    components: [
      {
        name: "tokenIn",
        type: "address",
      },
      {
        name: "price",
        type: "uint256",
      },
      {
        name: "duration",
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
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `listAsset` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `listAsset` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isListAssetSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isListAssetSupported(["0x..."]);
 * ```
 */
export function isListAssetSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "listAsset" function.
 * @param options - The options for the listAsset function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeListAssetParams } from "thirdweb/extensions/assets";
 * const result = encodeListAssetParams({
 *  asset: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeListAssetParams(options: ListAssetParams) {
  return encodeAbiParameters(FN_INPUTS, [options.asset, options.params]);
}

/**
 * Encodes the "listAsset" function into a Hex string with its parameters.
 * @param options - The options for the listAsset function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeListAsset } from "thirdweb/extensions/assets";
 * const result = encodeListAsset({
 *  asset: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeListAsset(options: ListAssetParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeListAssetParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "listAsset" function on the contract.
 * @param options - The options for the "listAsset" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { listAsset } from "thirdweb/extensions/assets";
 *
 * const transaction = listAsset({
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
export function listAsset(
  options: BaseTransactionOptions<
    | ListAssetParams
    | {
        asyncParams: () => Promise<ListAssetParams>;
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
