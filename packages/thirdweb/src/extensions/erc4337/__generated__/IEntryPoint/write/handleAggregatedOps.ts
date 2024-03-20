import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "handleAggregatedOps" function.
 */

type HandleAggregatedOpsParamsInternal = {
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

export type HandleAggregatedOpsParams = Prettify<
  | HandleAggregatedOpsParamsInternal
  | {
      asyncParams: () => Promise<HandleAggregatedOpsParamsInternal>;
    }
>;
const METHOD = [
  "0x4b1d7cf5",
  [
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
  ],
  [],
] as const;

/**
 * Calls the "handleAggregatedOps" function on the contract.
 * @param options - The options for the "handleAggregatedOps" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { handleAggregatedOps } from "thirdweb/extensions/erc4337";
 *
 * const transaction = handleAggregatedOps({
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
  options: BaseTransactionOptions<HandleAggregatedOpsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
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
