import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "copyEntriesOf" function.
 */
export type CopyEntriesOfParams = {
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
 * Calls the copyEntriesOf function on the contract.
 * @param options - The options for the copyEntriesOf function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { copyEntriesOf } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = copyEntriesOf({
 *  registrant: ...,
 *  registrantToCopy: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function copyEntriesOf(
  options: BaseTransactionOptions<CopyEntriesOfParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x1e06b4b4",
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
