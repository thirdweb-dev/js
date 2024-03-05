import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setPrimarySaleRecipient" function.
 */
export type SetPrimarySaleRecipientParams = {
  saleRecipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_saleRecipient";
    type: "address";
  }>;
};

/**
 * Calls the "setPrimarySaleRecipient" function on the contract.
 * @param options - The options for the "setPrimarySaleRecipient" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setPrimarySaleRecipient } from "thirdweb/extensions/common";
 *
 * const transaction = setPrimarySaleRecipient({
 *  saleRecipient: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPrimarySaleRecipient(
  options: BaseTransactionOptions<SetPrimarySaleRecipientParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x6f4f2837",
      [
        {
          internalType: "address",
          name: "_saleRecipient",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.saleRecipient],
  });
}
