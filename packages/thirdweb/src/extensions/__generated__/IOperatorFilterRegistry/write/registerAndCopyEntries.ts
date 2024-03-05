import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "registerAndCopyEntries" function.
 */
export type RegisterAndCopyEntriesParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  registrantToCopy: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrantToCopy";
    type: "address";
  }>;
};

/**
 * Calls the registerAndCopyEntries function on the contract.
 * @param options - The options for the registerAndCopyEntries function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { registerAndCopyEntries } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = registerAndCopyEntries({
 *  registrant: ...,
 *  registrantToCopy: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function registerAndCopyEntries(
  options: BaseTransactionOptions<RegisterAndCopyEntriesParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa0af2903",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "address",
          name: "registrantToCopy",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.registrant, options.registrantToCopy],
  });
}
