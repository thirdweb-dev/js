import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "simulateValidation" function.
 */

type SimulateValidationParamsInternal = {
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

export type SimulateValidationParams = Prettify<
  | SimulateValidationParamsInternal
  | {
      asyncParams: () => Promise<SimulateValidationParamsInternal>;
    }
>;
/**
 * Calls the "simulateValidation" function on the contract.
 * @param options - The options for the "simulateValidation" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { simulateValidation } from "thirdweb/extensions/erc4337";
 *
 * const transaction = simulateValidation({
 *  userOp: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function simulateValidation(
  options: BaseTransactionOptions<SimulateValidationParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xee219423",
      [
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
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.userOp] as const;
      }

      return [options.userOp] as const;
    },
  });
}
