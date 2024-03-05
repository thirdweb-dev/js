import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isCodeHashOfFiltered" function.
 */
export type IsCodeHashOfFilteredParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  operatorWithCode: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operatorWithCode";
    type: "address";
  }>;
};

/**
 * Calls the isCodeHashOfFiltered function on the contract.
 * @param options - The options for the isCodeHashOfFiltered function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { isCodeHashOfFiltered } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = isCodeHashOfFiltered({
 *  registrant: ...,
 *  operatorWithCode: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function isCodeHashOfFiltered(
  options: BaseTransactionOptions<IsCodeHashOfFilteredParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x5eae3173",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "address",
          name: "operatorWithCode",
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
    params: [options.registrant, options.operatorWithCode],
  });
}
