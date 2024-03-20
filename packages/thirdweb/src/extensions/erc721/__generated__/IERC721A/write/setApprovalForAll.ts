import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setApprovalForAll" function.
 */

type SetApprovalForAllParamsInternal = {
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "operator" }>;
  approved: AbiParameterToPrimitiveType<{ type: "bool"; name: "_approved" }>;
};

export type SetApprovalForAllParams = Prettify<
  | SetApprovalForAllParamsInternal
  | {
      asyncParams: () => Promise<SetApprovalForAllParamsInternal>;
    }
>;
const METHOD = [
  "0xa22cb465",
  [
    {
      type: "address",
      name: "operator",
    },
    {
      type: "bool",
      name: "_approved",
    },
  ],
  [],
] as const;

/**
 * Calls the "setApprovalForAll" function on the contract.
 * @param options - The options for the "setApprovalForAll" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { setApprovalForAll } from "thirdweb/extensions/erc721";
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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.operator, resolvedParams.approved] as const;
          }
        : [options.operator, options.approved],
  });
}
