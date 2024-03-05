import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "delegateBySig" function.
 */
export type DelegateBySigParams = {
  delegatee: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegatee";
  }>;
  nonce: AbiParameterToPrimitiveType<{ type: "uint256"; name: "nonce" }>;
  expiry: AbiParameterToPrimitiveType<{ type: "uint256"; name: "expiry" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
};

/**
 * Calls the "delegateBySig" function on the contract.
 * @param options - The options for the "delegateBySig" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { delegateBySig } from "thirdweb/extensions/erc20";
 *
 * const transaction = delegateBySig({
 *  delegatee: ...,
 *  nonce: ...,
 *  expiry: ...,
 *  v: ...,
 *  r: ...,
 *  s: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function delegateBySig(
  options: BaseTransactionOptions<DelegateBySigParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc3cda520",
      [
        {
          type: "address",
          name: "delegatee",
        },
        {
          type: "uint256",
          name: "nonce",
        },
        {
          type: "uint256",
          name: "expiry",
        },
        {
          type: "uint8",
          name: "v",
        },
        {
          type: "bytes32",
          name: "r",
        },
        {
          type: "bytes32",
          name: "s",
        },
      ],
      [],
    ],
    params: [
      options.delegatee,
      options.nonce,
      options.expiry,
      options.v,
      options.r,
      options.s,
    ],
  });
}
