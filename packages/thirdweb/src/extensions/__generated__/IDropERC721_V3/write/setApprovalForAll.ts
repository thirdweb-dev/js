import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = {
  operator: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
  approved: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "_approved";
    type: "bool";
  }>;
};

/**
 * Calls the setApprovalForAll function on the contract.
 * @param options - The options for the setApprovalForAll function.
 * @returns A prepared transaction object.
 * @extension IDROPERC721_V3
 * @example
 * ```
 * import { setApprovalForAll } from "thirdweb/extensions/IDropERC721_V3";
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
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_approved",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.operator, options.approved],
  });
}
