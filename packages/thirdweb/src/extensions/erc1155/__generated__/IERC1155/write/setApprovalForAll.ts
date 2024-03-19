import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setApprovalForAll" function.
 */

type SetApprovalForAllParamsInternal = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "_operator" }>;
  approved: AbiParameterToPrimitiveType<{ type: "bool"; name: "_approved" }>;
};

export type SetApprovalForAllParams = Prettify<
  | SetApprovalForAllParamsInternal
  | {
      asyncParams: () => Promise<SetApprovalForAllParamsInternal>;
    }
>;
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
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.operator, resolvedParams.approved] as const;
      }

      return [options.operator, options.approved] as const;
    },
  });
}
