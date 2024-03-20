import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "validateUserOp" function.
 */

type ValidateUserOpParamsInternal = {
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
  missingAccountFunds: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "missingAccountFunds";
  }>;
};

export type ValidateUserOpParams = Prettify<
  | ValidateUserOpParamsInternal
  | {
      asyncParams: () => Promise<ValidateUserOpParamsInternal>;
    }
>;
/**
 * Calls the "validateUserOp" function on the contract.
 * @param options - The options for the "validateUserOp" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { validateUserOp } from "thirdweb/extensions/erc4337";
 *
 * const transaction = validateUserOp({
 *  userOp: ...,
 *  userOpHash: ...,
 *  missingAccountFunds: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function validateUserOp(
  options: BaseTransactionOptions<ValidateUserOpParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x3a871cdd",
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
          name: "missingAccountFunds",
        },
      ],
      [
        {
          type: "uint256",
          name: "validationData",
        },
      ],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.userOp,
              resolvedParams.userOpHash,
              resolvedParams.missingAccountFunds,
            ] as const;
          }
        : [options.userOp, options.userOpHash, options.missingAccountFunds],
  });
}
