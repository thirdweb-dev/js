import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isOperatorFiltered" function.
 */
export type IsOperatorFilteredParams = {
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
};

/**
 * Calls the isOperatorFiltered function on the contract.
 * @param options - The options for the isOperatorFiltered function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { isOperatorFiltered } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = isOperatorFiltered({
 *  registrant: ...,
 *  operator: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function isOperatorFiltered(
  options: BaseTransactionOptions<IsOperatorFilteredParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xe4aecb54",
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
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.registrant, options.operator],
  });
}
