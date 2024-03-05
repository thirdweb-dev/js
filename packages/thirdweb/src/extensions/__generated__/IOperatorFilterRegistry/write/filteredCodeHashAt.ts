import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "filteredCodeHashAt" function.
 */
export type FilteredCodeHashAtParams = {
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
 * Calls the filteredCodeHashAt function on the contract.
 * @param options - The options for the filteredCodeHashAt function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { filteredCodeHashAt } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = filteredCodeHashAt({
 *  registrant: ...,
 *  index: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function filteredCodeHashAt(
  options: BaseTransactionOptions<FilteredCodeHashAtParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa6529eb5",
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
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
    ],
    params: [options.registrant, options.index],
  });
}
