import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "handleAggregatedOps" function.
 */
export type HandleAggregatedOpsParams = {
  opsPerAggregator: AbiParameterToPrimitiveType<{
    components: [
      {
        components: [
          { internalType: "address"; name: "sender"; type: "address" },
          { internalType: "uint256"; name: "nonce"; type: "uint256" },
          { internalType: "bytes"; name: "initCode"; type: "bytes" },
          { internalType: "bytes"; name: "callData"; type: "bytes" },
          { internalType: "uint256"; name: "callGasLimit"; type: "uint256" },
          {
            internalType: "uint256";
            name: "verificationGasLimit";
            type: "uint256";
          },
          {
            internalType: "uint256";
            name: "preVerificationGas";
            type: "uint256";
          },
          { internalType: "uint256"; name: "maxFeePerGas"; type: "uint256" },
          {
            internalType: "uint256";
            name: "maxPriorityFeePerGas";
            type: "uint256";
          },
          { internalType: "bytes"; name: "paymasterAndData"; type: "bytes" },
          { internalType: "bytes"; name: "signature"; type: "bytes" },
        ];
        internalType: "struct UserOperation[]";
        name: "userOps";
        type: "tuple[]";
      },
      {
        internalType: "contract IAggregator";
        name: "aggregator";
        type: "address";
      },
      { internalType: "bytes"; name: "signature"; type: "bytes" },
    ];
    internalType: "struct IEntryPoint.UserOpsPerAggregator[]";
    name: "opsPerAggregator";
    type: "tuple[]";
  }>;
  beneficiary: AbiParameterToPrimitiveType<{
    internalType: "address payable";
    name: "beneficiary";
    type: "address";
  }>;
};

/**
 * Calls the handleAggregatedOps function on the contract.
 * @param options - The options for the handleAggregatedOps function.
 * @returns A prepared transaction object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { handleAggregatedOps } from "thirdweb/extensions/IEntryPoint";
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
    method: [
      "0x4b1d7cf5",
      [
        {
          components: [
            {
              components: [
                {
                  internalType: "address",
                  name: "sender",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "nonce",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "initCode",
                  type: "bytes",
                },
                {
                  internalType: "bytes",
                  name: "callData",
                  type: "bytes",
                },
                {
                  internalType: "uint256",
                  name: "callGasLimit",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "verificationGasLimit",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "preVerificationGas",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "maxFeePerGas",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "maxPriorityFeePerGas",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "paymasterAndData",
                  type: "bytes",
                },
                {
                  internalType: "bytes",
                  name: "signature",
                  type: "bytes",
                },
              ],
              internalType: "struct UserOperation[]",
              name: "userOps",
              type: "tuple[]",
            },
            {
              internalType: "contract IAggregator",
              name: "aggregator",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "signature",
              type: "bytes",
            },
          ],
          internalType: "struct IEntryPoint.UserOpsPerAggregator[]",
          name: "opsPerAggregator",
          type: "tuple[]",
        },
        {
          internalType: "address payable",
          name: "beneficiary",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.opsPerAggregator, options.beneficiary],
  });
}
