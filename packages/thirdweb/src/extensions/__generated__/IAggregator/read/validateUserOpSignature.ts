import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "validateUserOpSignature" function.
 */
export type ValidateUserOpSignatureParams = {
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
};

/**
 * Calls the validateUserOpSignature function on the contract.
 * @param options - The options for the validateUserOpSignature function.
 * @returns The parsed result of the function call.
 * @extension IAGGREGATOR
 * @example
 * ```
 * import { validateUserOpSignature } from "thirdweb/extensions/IAggregator";
 *
 * const result = await validateUserOpSignature({
 *  userOp: ...,
 * });
 *
 * ```
 */
export async function validateUserOpSignature(
  options: BaseTransactionOptions<ValidateUserOpSignatureParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x64c530cd",
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
      ],
      [
        {
          internalType: "bytes",
          name: "sigForUserOp",
          type: "bytes",
        },
      ],
    ],
    params: [options.userOp],
  });
}
