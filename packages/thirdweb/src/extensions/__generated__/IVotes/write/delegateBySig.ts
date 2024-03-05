import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "delegateBySig" function.
 */
export type DelegateBySigParams = {
  delegatee: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "delegatee";
    type: "address";
  }>;
  nonce: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "nonce";
    type: "uint256";
  }>;
  expiry: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "expiry";
    type: "uint256";
  }>;
  v: AbiParameterToPrimitiveType<{
    internalType: "uint8";
    name: "v";
    type: "uint8";
  }>;
  r: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "r";
    type: "bytes32";
  }>;
  s: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "s";
    type: "bytes32";
  }>;
};

/**
 * Calls the delegateBySig function on the contract.
 * @param options - The options for the delegateBySig function.
 * @returns A prepared transaction object.
 * @extension IVOTES
 * @example
 * ```
 * import { delegateBySig } from "thirdweb/extensions/IVotes";
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
          internalType: "address",
          name: "delegatee",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "nonce",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "expiry",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8",
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
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
