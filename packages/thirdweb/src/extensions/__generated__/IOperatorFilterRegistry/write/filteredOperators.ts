import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "filteredOperators" function.
 */
export type FilteredOperatorsParams = {
  addr: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "addr";
    type: "address";
  }>;
};

/**
 * Calls the filteredOperators function on the contract.
 * @param options - The options for the filteredOperators function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { filteredOperators } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = filteredOperators({
 *  addr: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function filteredOperators(
  options: BaseTransactionOptions<FilteredOperatorsParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc4308805",
      [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
    ],
    params: [options.addr],
  });
}
