import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
    type: "tuple[]",
    name: "opsPerAggregator",
    components: [
      {
        type: "tuple[]",
        name: "userOps",
        components: [
          {
            type: "address",
            name: "sender",
          },
          {
            type: "uint256",
            name: "nonce",
          },
          {
            type: "bytes",
            name: "initCode",
          },
          {
            type: "bytes",
            name: "callData",
          },
          {
            type: "uint256",
            name: "callGasLimit",
          },
          {
            type: "uint256",
            name: "verificationGasLimit",
          },
          {
            type: "uint256",
            name: "preVerificationGas",
          },
          {
            type: "uint256",
            name: "maxFeePerGas",
          },
          {
            type: "uint256",
            name: "maxPriorityFeePerGas",
          },
          {
            type: "bytes",
            name: "paymasterAndData",
          },
          {
            type: "bytes",
            name: "signature",
          },
        ],
      },
      {
        type: "address",
        name: "aggregator",
      },
      {
        type: "bytes",
        name: "signature",
      },
    ],
  },
  {
    type: "address",
    name: "beneficiary",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `handleAggregatedOps` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `handleAggregatedOps` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isHandleAggregatedOpsSupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = await isHandleAggregatedOpsSupported(contract);
 * ```
 */
export async function isHandleAggregatedOpsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
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
 * import { encodeHandleAggregatedOpsParams } "thirdweb/extensions/erc4337";
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
 * import { encodeHandleAggregatedOps } "thirdweb/extensions/erc4337";
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
 * ...
 *
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
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.opsPerAggregator,
        resolvedOptions.beneficiary,
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
  });
}
