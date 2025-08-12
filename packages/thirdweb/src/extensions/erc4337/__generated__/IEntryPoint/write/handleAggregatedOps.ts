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
 * Represents the parameters for the "handleAggregatedOps" function.
 */
export type HandleAggregatedOpsParams = WithOverrides<{
  opsPerAggregator: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "opsPerAggregator";
    components: [
      {
        type: "tuple[]";
        name: "userOps";
        components: [
          { type: "address"; name: "sender" },
          { type: "uint256"; name: "nonce" },
          { type: "bytes"; name: "initCode" },
          { type: "bytes"; name: "callData" },
          { type: "uint256"; name: "callGasLimit" },
          { type: "uint256"; name: "verificationGasLimit" },
          { type: "uint256"; name: "preVerificationGas" },
          { type: "uint256"; name: "maxFeePerGas" },
          { type: "uint256"; name: "maxPriorityFeePerGas" },
          { type: "bytes"; name: "paymasterAndData" },
          { type: "bytes"; name: "signature" },
        ];
      },
      { type: "address"; name: "aggregator" },
      { type: "bytes"; name: "signature" },
    ];
  }>;
  beneficiary: AbiParameterToPrimitiveType<{
    type: "address";
    name: "beneficiary";
  }>;
}>;

export const FN_SELECTOR = "0x4b1d7cf5" as const;
const FN_INPUTS = [
  {
    components: [
      {
        components: [
          {
            name: "sender",
            type: "address",
          },
          {
            name: "nonce",
            type: "uint256",
          },
          {
            name: "initCode",
            type: "bytes",
          },
          {
            name: "callData",
            type: "bytes",
          },
          {
            name: "callGasLimit",
            type: "uint256",
          },
          {
            name: "verificationGasLimit",
            type: "uint256",
          },
          {
            name: "preVerificationGas",
            type: "uint256",
          },
          {
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            name: "paymasterAndData",
            type: "bytes",
          },
          {
            name: "signature",
            type: "bytes",
          },
        ],
        name: "userOps",
        type: "tuple[]",
      },
      {
        name: "aggregator",
        type: "address",
      },
      {
        name: "signature",
        type: "bytes",
      },
    ],
    name: "opsPerAggregator",
    type: "tuple[]",
  },
  {
    name: "beneficiary",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `handleAggregatedOps` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `handleAggregatedOps` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isHandleAggregatedOpsSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isHandleAggregatedOpsSupported(["0x..."]);
 * ```
 */
export function isHandleAggregatedOpsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "handleAggregatedOps" function.
 * @param options - The options for the handleAggregatedOps function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeHandleAggregatedOpsParams } from "thirdweb/extensions/erc4337";
 * const result = encodeHandleAggregatedOpsParams({
 *  opsPerAggregator: ...,
 *  beneficiary: ...,
 * });
 * ```
 */
export function encodeHandleAggregatedOpsParams(
  options: HandleAggregatedOpsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.opsPerAggregator,
    options.beneficiary,
  ]);
}

/**
 * Encodes the "handleAggregatedOps" function into a Hex string with its parameters.
 * @param options - The options for the handleAggregatedOps function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeHandleAggregatedOps } from "thirdweb/extensions/erc4337";
 * const result = encodeHandleAggregatedOps({
 *  opsPerAggregator: ...,
 *  beneficiary: ...,
 * });
 * ```
 */
export function encodeHandleAggregatedOps(options: HandleAggregatedOpsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeHandleAggregatedOpsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "handleAggregatedOps" function on the contract.
 * @param options - The options for the "handleAggregatedOps" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { handleAggregatedOps } from "thirdweb/extensions/erc4337";
 *
 * const transaction = handleAggregatedOps({
 *  contract,
 *  opsPerAggregator: ...,
 *  beneficiary: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function handleAggregatedOps(
  options: BaseTransactionOptions<
    | HandleAggregatedOpsParams
    | {
        asyncParams: () => Promise<HandleAggregatedOpsParams>;
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
        resolvedOptions.opsPerAggregator,
        resolvedOptions.beneficiary,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
