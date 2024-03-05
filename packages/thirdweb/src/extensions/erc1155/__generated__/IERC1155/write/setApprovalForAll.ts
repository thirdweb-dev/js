import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "_operator" }>;
  approved: AbiParameterToPrimitiveType<{ type: "bool"; name: "_approved" }>;
};

/**
 * Calls the "setApprovalForAll" function on the contract.
 * @param options - The options for the "setApprovalForAll" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { setApprovalForAll } from "thirdweb/extensions/erc1155";
 *
 * const transaction = setApprovalForAll({
 *  operator: ...,
 *  approved: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setApprovalForAll(
  options: BaseTransactionOptions<SetApprovalForAllParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa22cb465",
      [
        {
          type: "address",
          name: "_operator",
        },
        {
          type: "bool",
          name: "_approved",
        },
      ],
      [],
    ],
    params: [options.operator, options.approved],
  });
}
