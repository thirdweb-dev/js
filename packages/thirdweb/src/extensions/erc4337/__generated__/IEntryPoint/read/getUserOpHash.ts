import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getUserOpHash" function.
 */
export type GetUserOpHashParams = {
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

/**
 * Calls the "getUserOpHash" function on the contract.
 * @param options - The options for the getUserOpHash function.
 * @returns The parsed result of the function call.
 * @extension ERC4337
 * @example
 * ```
 * import { getUserOpHash } from "thirdweb/extensions/erc4337";
 *
 * const result = await getUserOpHash({
 *  userOp: ...,
 * });
 *
 * ```
 */
export async function getUserOpHash(
  options: BaseTransactionOptions<GetUserOpHashParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xa6193531",
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
      [
        {
          type: "bytes32",
        },
      ],
    ],
    params: [options.userOp],
  });
}
