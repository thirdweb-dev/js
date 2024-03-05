import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "simulateHandleOp" function.
 */
export type SimulateHandleOpParams = {
  op: AbiParameterToPrimitiveType<{
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
    name: "op";
    type: "tuple";
  }>;
  target: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "target";
    type: "address";
  }>;
  targetCallData: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "targetCallData";
    type: "bytes";
  }>;
};

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
          name: "op",
          type: "tuple",
        },
        {
          internalType: "address",
          name: "target",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "targetCallData",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [options.op, options.target, options.targetCallData],
  });
}
