import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "validateUserOp" function.
 */
export type ValidateUserOpParams = {
  userOp: AbiParameterToPrimitiveType<{
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
      { internalType: "uint256"; name: "preVerificationGas"; type: "uint256" },
      { internalType: "uint256"; name: "maxFeePerGas"; type: "uint256" },
      {
        internalType: "uint256";
        name: "maxPriorityFeePerGas";
        type: "uint256";
      },
      { internalType: "bytes"; name: "paymasterAndData"; type: "bytes" },
      { internalType: "bytes"; name: "signature"; type: "bytes" },
    ];
    internalType: "struct UserOperation";
    name: "userOp";
    type: "tuple";
  }>;
  userOpHash: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "userOpHash";
    type: "bytes32";
  }>;
  missingAccountFunds: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "missingAccountFunds";
    type: "uint256";
  }>;
};

/**
 * Calls the validateUserOp function on the contract.
 * @param options - The options for the validateUserOp function.
 * @returns A prepared transaction object.
 * @extension IACCOUNTCORE
 * @example
 * ```
 * import { validateUserOp } from "thirdweb/extensions/IAccountCore";
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
          internalType: "struct UserOperation",
          name: "userOp",
          type: "tuple",
        },
        {
          internalType: "bytes32",
          name: "userOpHash",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "missingAccountFunds",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "validationData",
          type: "uint256",
        },
      ],
    ],
    params: [options.userOp, options.userOpHash, options.missingAccountFunds],
  });
}
