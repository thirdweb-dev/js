import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "handleOps" function.
 */
export type HandleOpsParams = {
  ops: AbiParameterToPrimitiveType<{
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
    internalType: "struct UserOperation[]";
    name: "ops";
    type: "tuple[]";
  }>;
  beneficiary: AbiParameterToPrimitiveType<{
    internalType: "address payable";
    name: "beneficiary";
    type: "address";
  }>;
};

/**
 * Calls the "handleOps" function on the contract.
 * @param options - The options for the "handleOps" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { handleOps } from "thirdweb/extensions/erc4337";
 *
 * const transaction = handleOps({
 *  ops: ...,
 *  beneficiary: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function handleOps(options: BaseTransactionOptions<HandleOpsParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x1fad948c",
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
          internalType: "struct UserOperation[]",
          name: "ops",
          type: "tuple[]",
        },
        {
          internalType: "address payable",
          name: "beneficiary",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.ops, options.beneficiary],
  });
}
