import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "permit" function.
 */
export type PermitParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  spender: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "spender";
    type: "address";
  }>;
  value: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "value";
    type: "uint256";
  }>;
  deadline: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "deadline";
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
 * Calls the permit function on the contract.
 * @param options - The options for the permit function.
 * @returns A prepared transaction object.
 * @extension IERC20PERMIT
 * @example
 * ```
 * import { permit } from "thirdweb/extensions/IERC20Permit";
 *
 * const transaction = permit({
 *  owner: ...,
 *  spender: ...,
 *  value: ...,
 *  deadline: ...,
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
export function permit(options: BaseTransactionOptions<PermitParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd505accf",
      [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "deadline",
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
      options.owner,
      options.spender,
      options.value,
      options.deadline,
      options.v,
      options.r,
      options.s,
    ],
  });
}
