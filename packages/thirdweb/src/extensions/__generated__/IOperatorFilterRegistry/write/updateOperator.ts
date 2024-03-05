import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "updateOperator" function.
 */
export type UpdateOperatorParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  operator: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
  filtered: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "filtered";
    type: "bool";
  }>;
};

/**
 * Calls the updateOperator function on the contract.
 * @param options - The options for the updateOperator function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { updateOperator } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = updateOperator({
 *  registrant: ...,
 *  operator: ...,
 *  filtered: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function updateOperator(
  options: BaseTransactionOptions<UpdateOperatorParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa2f367ab",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "filtered",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.registrant, options.operator, options.filtered],
  });
}
