import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "permit" function.
 */
export type PermitParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  spender: AbiParameterToPrimitiveType<{ type: "address"; name: "spender" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  v: AbiParameterToPrimitiveType<{ type: "uint8"; name: "v" }>;
  r: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "r" }>;
  s: AbiParameterToPrimitiveType<{ type: "bytes32"; name: "s" }>;
};

/**
 * Calls the "permit" function on the contract.
 * @param options - The options for the "permit" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { permit } from "thirdweb/extensions/erc20";
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
          type: "address",
          name: "owner",
        },
        {
          type: "address",
          name: "spender",
        },
        {
          type: "uint256",
          name: "value",
        },
        {
          type: "uint256",
          name: "deadline",
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
