import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "handleAggregatedOps" function.
 */

export type HandleAggregatedOpsParams = {
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
};

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
 * Calls the "handleAggregatedOps" function on the contract.
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
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.opsPerAggregator,
              resolvedParams.beneficiary,
            ] as const;
          }
        : [options.opsPerAggregator, options.beneficiary],
  });
}
