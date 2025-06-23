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
 * Represents the parameters for the "createAssetByImplementationConfig" function.
 */
export type CreateAssetByImplementationConfigParams = WithOverrides<{
  config: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "config";
    components: [
      { type: "bytes32"; name: "contractId" },
      { type: "address"; name: "implementation" },
      { type: "uint8"; name: "implementationType" },
      { type: "uint8"; name: "createHook" },
      { type: "bytes"; name: "createHookData" },
    ];
  }>;
  creator: AbiParameterToPrimitiveType<{ type: "address"; name: "creator" }>;
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "uint256"; name: "amount" },
      { type: "address"; name: "referrer" },
      { type: "bytes32"; name: "salt" },
      { type: "bytes"; name: "data" },
      { type: "bytes"; name: "hookData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x230ffc78" as const;
const FN_INPUTS = [
  {
    components: [
      {
        name: "contractId",
        type: "bytes32",
      },
      {
        name: "implementation",
        type: "address",
      },
      {
        name: "implementationType",
        type: "uint8",
      },
      {
        name: "createHook",
        type: "uint8",
      },
      {
        name: "createHookData",
        type: "bytes",
      },
    ],
    name: "config",
    type: "tuple",
  },
  {
    name: "creator",
    type: "address",
  },
  {
    components: [
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "referrer",
        type: "address",
      },
      {
        name: "salt",
        type: "bytes32",
      },
      {
        name: "data",
        type: "bytes",
      },
      {
        name: "hookData",
        type: "bytes",
      },
    ],
    name: "params",
    type: "tuple",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "asset",
    type: "address",
  },
] as const;

/**
 * Checks if the `createAssetByImplementationConfig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createAssetByImplementationConfig` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isCreateAssetByImplementationConfigSupported } from "thirdweb/extensions/assets";
 *
 * const supported = isCreateAssetByImplementationConfigSupported(["0x..."]);
 * ```
 */
export function isCreateAssetByImplementationConfigSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createAssetByImplementationConfig" function.
 * @param options - The options for the createAssetByImplementationConfig function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateAssetByImplementationConfigParams } from "thirdweb/extensions/assets";
 * const result = encodeCreateAssetByImplementationConfigParams({
 *  config: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateAssetByImplementationConfigParams(
  options: CreateAssetByImplementationConfigParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.config,
    options.creator,
    options.params,
  ]);
}

/**
 * Encodes the "createAssetByImplementationConfig" function into a Hex string with its parameters.
 * @param options - The options for the createAssetByImplementationConfig function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeCreateAssetByImplementationConfig } from "thirdweb/extensions/assets";
 * const result = encodeCreateAssetByImplementationConfig({
 *  config: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateAssetByImplementationConfig(
  options: CreateAssetByImplementationConfigParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateAssetByImplementationConfigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createAssetByImplementationConfig" function on the contract.
 * @param options - The options for the "createAssetByImplementationConfig" function.
 * @returns A prepared transaction object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createAssetByImplementationConfig } from "thirdweb/extensions/assets";
 *
 * const transaction = createAssetByImplementationConfig({
 *  contract,
 *  config: ...,
 *  creator: ...,
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
export function createAssetByImplementationConfig(
  options: BaseTransactionOptions<
    | CreateAssetByImplementationConfigParams
    | {
        asyncParams: () => Promise<CreateAssetByImplementationConfigParams>;
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
        resolvedOptions.config,
        resolvedOptions.creator,
        resolvedOptions.params,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
