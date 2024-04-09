import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "simulateValidation" function.
 */

export type SimulateValidationParams = {
  userOp: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "userOp";
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
};

export const FN_SELECTOR = "0xee219423" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "userOp",
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "simulateValidation" function.
 * @param options - The options for the simulateValidation function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeSimulateValidationParams } "thirdweb/extensions/erc4337";
 * const result = encodeSimulateValidationParams({
 *  userOp: ...,
 * });
 * ```
 */
export function encodeSimulateValidationParams(
  options: SimulateValidationParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.userOp]);
}

/**
 * Calls the "simulateValidation" function on the contract.
 * @param options - The options for the "simulateValidation" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { simulateValidation } from "thirdweb/extensions/erc4337";
 *
 * const transaction = simulateValidation({
 *  contract,
 *  userOp: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function simulateValidation(
  options: BaseTransactionOptions<
    | SimulateValidationParams
    | {
        asyncParams: () => Promise<SimulateValidationParams>;
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
            return [resolvedParams.userOp] as const;
          }
        : [options.userOp],
  });
}
