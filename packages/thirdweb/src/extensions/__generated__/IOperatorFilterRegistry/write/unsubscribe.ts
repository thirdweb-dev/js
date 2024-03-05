import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "unsubscribe" function.
 */
export type UnsubscribeParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  copyExistingEntries: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "copyExistingEntries";
    type: "bool";
  }>;
};

/**
 * Calls the unsubscribe function on the contract.
 * @param options - The options for the unsubscribe function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { unsubscribe } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = unsubscribe({
 *  registrant: ...,
 *  copyExistingEntries: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function unsubscribe(
  options: BaseTransactionOptions<UnsubscribeParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x34a0dc10",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "bool",
          name: "copyExistingEntries",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.registrant, options.copyExistingEntries],
  });
}
