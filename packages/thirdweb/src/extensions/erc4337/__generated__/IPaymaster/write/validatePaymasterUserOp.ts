import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "validatePaymasterUserOp" function.
 */
export type ValidatePaymasterUserOpParams = {
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
  maxCost: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "maxCost";
    type: "uint256";
  }>;
};

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
    method: [
      "0xf465c77e",
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
          name: "maxCost",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "bytes",
          name: "context",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "validationData",
          type: "uint256",
        },
      ],
    ],
    params: [options.userOp, options.userOpHash, options.maxCost],
  });
}
