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
 * Represents the parameters for the "createByImplementationConfig" function.
 */
export type CreateByImplementationConfigParams = WithOverrides<{
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
      { type: "address"; name: "developer" },
      { type: "bytes32"; name: "salt" },
      { type: "bytes"; name: "data" },
      { type: "bytes"; name: "hookData" },
    ];
  }>;
}>;

export const FN_SELECTOR = "0x1a1b2b88" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "config",
    components: [
      {
        type: "bytes32",
        name: "contractId",
      },
      {
        type: "address",
        name: "implementation",
      },
      {
        type: "uint8",
        name: "implementationType",
      },
      {
        type: "uint8",
        name: "createHook",
      },
      {
        type: "bytes",
        name: "createHookData",
      },
    ],
  },
  {
    type: "address",
    name: "creator",
  },
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "address",
        name: "developer",
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
 * Checks if the `createByImplementationConfig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createByImplementationConfig` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isCreateByImplementationConfigSupported } from "thirdweb/extensions/tokens";
 *
 * const supported = isCreateByImplementationConfigSupported(["0x..."]);
 * ```
 */
export function isCreateByImplementationConfigSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createByImplementationConfig" function.
 * @param options - The options for the createByImplementationConfig function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeCreateByImplementationConfigParams } from "thirdweb/extensions/tokens";
 * const result = encodeCreateByImplementationConfigParams({
 *  config: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateByImplementationConfigParams(
  options: CreateByImplementationConfigParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.config,
    options.creator,
    options.params,
  ]);
}

/**
 * Encodes the "createByImplementationConfig" function into a Hex string with its parameters.
 * @param options - The options for the createByImplementationConfig function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeCreateByImplementationConfig } from "thirdweb/extensions/tokens";
 * const result = encodeCreateByImplementationConfig({
 *  config: ...,
 *  creator: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeCreateByImplementationConfig(
  options: CreateByImplementationConfigParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateByImplementationConfigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createByImplementationConfig" function on the contract.
 * @param options - The options for the "createByImplementationConfig" function.
 * @returns A prepared transaction object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createByImplementationConfig } from "thirdweb/extensions/tokens";
 *
 * const transaction = createByImplementationConfig({
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
export function createByImplementationConfig(
  options: BaseTransactionOptions<
    | CreateByImplementationConfigParams
    | {
        asyncParams: () => Promise<CreateByImplementationConfigParams>;
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
      return [
        resolvedOptions.config,
        resolvedOptions.creator,
        resolvedOptions.params,
      ] as const;
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
