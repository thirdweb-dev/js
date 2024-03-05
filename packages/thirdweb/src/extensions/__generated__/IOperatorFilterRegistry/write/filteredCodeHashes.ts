import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "filteredCodeHashes" function.
 */
export type FilteredCodeHashesParams = {
  addr: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "addr";
    type: "address";
  }>;
};

/**
 * Calls the filteredCodeHashes function on the contract.
 * @param options - The options for the filteredCodeHashes function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { filteredCodeHashes } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = filteredCodeHashes({
 *  addr: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function filteredCodeHashes(
  options: BaseTransactionOptions<FilteredCodeHashesParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x22fa2762",
      [
        {
          internalType: "address",
          name: "addr",
          type: "address",
        },
      ],
      [
        {
          internalType: "bytes32[]",
          name: "",
          type: "bytes32[]",
        },
      ],
    ],
    params: [options.addr],
  });
}
