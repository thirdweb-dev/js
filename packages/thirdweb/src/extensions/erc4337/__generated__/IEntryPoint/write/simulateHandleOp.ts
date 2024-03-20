import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "simulateHandleOp" function.
 */

type SimulateHandleOpParamsInternal = {
  op: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "op";
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
  }>;
  target: AbiParameterToPrimitiveType<{ type: "address"; name: "target" }>;
  targetCallData: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "targetCallData";
  }>;
};

export type SimulateHandleOpParams = Prettify<
  | SimulateHandleOpParamsInternal
  | {
      asyncParams: () => Promise<SimulateHandleOpParamsInternal>;
    }
>;
/**
 * Calls the "simulateHandleOp" function on the contract.
 * @param options - The options for the "simulateHandleOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { simulateHandleOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = simulateHandleOp({
 *  op: ...,
 *  target: ...,
 *  targetCallData: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function simulateHandleOp(
  options: BaseTransactionOptions<SimulateHandleOpParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd6383f94",
      [
        {
          type: "tuple",
          name: "op",
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
          name: "target",
        },
        {
          type: "bytes",
          name: "targetCallData",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.op,
              resolvedParams.target,
              resolvedParams.targetCallData,
            ] as const;
          }
        : [options.op, options.target, options.targetCallData],
  });
}
