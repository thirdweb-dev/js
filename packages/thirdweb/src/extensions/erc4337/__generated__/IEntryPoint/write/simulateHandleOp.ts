import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "simulateHandleOp" function.
 */

export type SimulateHandleOpParams = {
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

export const FN_SELECTOR = "0xd6383f94" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "simulateHandleOp" function.
 * @param options - The options for the simulateHandleOp function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSimulateHandleOpParams } "thirdweb/extensions/erc4337";
 * const result = encodeSimulateHandleOpParams({
 *  op: ...,
 *  target: ...,
 *  targetCallData: ...,
 * });
 * ```
 */
export function encodeSimulateHandleOpParams(options: SimulateHandleOpParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.op,
    options.target,
    options.targetCallData,
  ]);
}

/**
 * Calls the "simulateHandleOp" function on the contract.
 * @param options - The options for the "simulateHandleOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { simulateHandleOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = simulateHandleOp({
 *  contract,
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
  options: BaseTransactionOptions<
    | SimulateHandleOpParams
    | {
        asyncParams: () => Promise<SimulateHandleOpParams>;
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
              resolvedParams.op,
              resolvedParams.target,
              resolvedParams.targetCallData,
            ] as const;
          }
        : [options.op, options.target, options.targetCallData],
  });
}
