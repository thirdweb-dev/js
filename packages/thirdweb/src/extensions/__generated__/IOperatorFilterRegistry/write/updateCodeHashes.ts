import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "updateCodeHashes" function.
 */
export type UpdateCodeHashesParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  codeHashes: AbiParameterToPrimitiveType<{
    internalType: "bytes32[]";
    name: "codeHashes";
    type: "bytes32[]";
  }>;
  filtered: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "filtered";
    type: "bool";
  }>;
};

/**
 * Calls the updateCodeHashes function on the contract.
 * @param options - The options for the updateCodeHashes function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { updateCodeHashes } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = updateCodeHashes({
 *  registrant: ...,
 *  codeHashes: ...,
 *  filtered: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function updateCodeHashes(
  options: BaseTransactionOptions<UpdateCodeHashesParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x063298b6",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "bytes32[]",
          name: "codeHashes",
          type: "bytes32[]",
        },
        {
          internalType: "bool",
          name: "filtered",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.registrant, options.codeHashes, options.filtered],
  });
}
