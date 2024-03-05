import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "filteredOperatorAt" function.
 */
export type FilteredOperatorAtParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  index: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "index";
    type: "uint256";
  }>;
};

/**
 * Calls the filteredOperatorAt function on the contract.
 * @param options - The options for the filteredOperatorAt function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { filteredOperatorAt } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = filteredOperatorAt({
 *  registrant: ...,
 *  index: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function filteredOperatorAt(
  options: BaseTransactionOptions<FilteredOperatorAtParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x3f1cc5fa",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [options.registrant, options.index],
  });
}
