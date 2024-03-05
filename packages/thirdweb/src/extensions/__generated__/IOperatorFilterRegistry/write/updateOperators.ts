import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "updateOperators" function.
 */
export type UpdateOperatorsParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  operators: AbiParameterToPrimitiveType<{
    internalType: "address[]";
    name: "operators";
    type: "address[]";
  }>;
  filtered: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "filtered";
    type: "bool";
  }>;
};

/**
 * Calls the updateOperators function on the contract.
 * @param options - The options for the updateOperators function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { updateOperators } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = updateOperators({
 *  registrant: ...,
 *  operators: ...,
 *  filtered: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function updateOperators(
  options: BaseTransactionOptions<UpdateOperatorsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa14584c1",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "address[]",
          name: "operators",
          type: "address[]",
        },
        {
          internalType: "bool",
          name: "filtered",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.registrant, options.operators, options.filtered],
  });
}
