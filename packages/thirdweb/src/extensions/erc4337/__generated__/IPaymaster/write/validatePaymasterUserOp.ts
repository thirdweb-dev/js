import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "validatePaymasterUserOp" function.
 */

type ValidatePaymasterUserOpParamsInternal = {
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
  userOpHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "userOpHash";
  }>;
  maxCost: AbiParameterToPrimitiveType<{ type: "uint256"; name: "maxCost" }>;
};

export type ValidatePaymasterUserOpParams = Prettify<
  | ValidatePaymasterUserOpParamsInternal
  | {
      asyncParams: () => Promise<ValidatePaymasterUserOpParamsInternal>;
    }
>;
const METHOD = [
  "0xf465c77e",
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
    {
      type: "bytes32",
      name: "userOpHash",
    },
    {
      type: "uint256",
      name: "maxCost",
    },
  ],
  [
    {
      type: "bytes",
      name: "context",
    },
    {
      type: "uint256",
      name: "validationData",
    },
  ],
] as const;

/**
 * Calls the "validatePaymasterUserOp" function on the contract.
 * @param options - The options for the "validatePaymasterUserOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { validatePaymasterUserOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = validatePaymasterUserOp({
 *  userOp: ...,
 *  userOpHash: ...,
 *  maxCost: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function validatePaymasterUserOp(
  options: BaseTransactionOptions<ValidatePaymasterUserOpParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.userOp,
              resolvedParams.userOpHash,
              resolvedParams.maxCost,
            ] as const;
          }
        : [options.userOp, options.userOpHash, options.maxCost],
  });
}
