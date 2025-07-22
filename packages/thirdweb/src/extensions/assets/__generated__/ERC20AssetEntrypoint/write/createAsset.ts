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
 * Represents the parameters for the "createAsset" function.
 */
export type CreateAssetParams = WithOverrides<{
  creator: AbiParameterToPrimitiveType<{ type: "address"; name: "creator" }>;
  createParams: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "createParams";
    components: [
      { type: "uint256"; name: "amount" },
      { type: "address"; name: "referrer" },
      { type: "bytes32"; name: "salt" },
      { type: "bytes"; name: "data" },
      { type: "bytes"; name: "hookData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x58ac06bd" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "creator",
  },
  {
    type: "tuple",
    name: "createParams",
    components: [
      {
        type: "uint256",
        name: "amount",
      },
      {
        type: "address",
        name: "referrer",
      },
      {
        type: "bytes32",
        name: "salt",
      },
      {
        type: "bytes",
        name: "data",
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
    type: "address",
    name: "asset",
  },
] as const;

/**
 * Checks if the `createAsset` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createAsset` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isCreateAssetSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isCreateAssetSupported(["0x..."]);
 * ```
 */
export function isCreateAssetSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createAsset" function.
 * @param options - The options for the createAsset function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateAssetParams } from "thirdweb/extensions/assets";
 * const result = encodeCreateAssetParams({
 *  creator: ...,
 *  createParams: ...,
 * });
 * ```
 */
export function encodeCreateAssetParams(options: CreateAssetParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.creator,
    options.createParams,
  ]);
}

/**
 * Encodes the "createAsset" function into a Hex string with its parameters.
 * @param options - The options for the createAsset function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateAsset } from "thirdweb/extensions/assets";
 * const result = encodeCreateAsset({
 *  creator: ...,
 *  createParams: ...,
 * });
 * ```
 */
export function encodeCreateAsset(options: CreateAssetParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateAssetParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createAsset" function on the contract.
 * @param options - The options for the "createAsset" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createAsset } from "thirdweb/extensions/assets";
 *
 * const transaction = createAsset({
 *  contract,
 *  creator: ...,
 *  createParams: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createAsset(
  options: BaseTransactionOptions<
    | CreateAssetParams
    | {
        asyncParams: () => Promise<CreateAssetParams>;
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
      return [resolvedOptions.creator, resolvedOptions.createParams] as const;
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
