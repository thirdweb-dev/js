import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isCodeHashFiltered" function.
 */
export type IsCodeHashFilteredParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  codeHash: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "codeHash";
    type: "bytes32";
  }>;
};

/**
 * Calls the isCodeHashFiltered function on the contract.
 * @param options - The options for the isCodeHashFiltered function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { isCodeHashFiltered } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = isCodeHashFiltered({
 *  registrant: ...,
 *  codeHash: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function isCodeHashFiltered(
  options: BaseTransactionOptions<IsCodeHashFilteredParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x6af0c315",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "codeHash",
          type: "bytes32",
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
    params: [options.registrant, options.codeHash],
  });
}
