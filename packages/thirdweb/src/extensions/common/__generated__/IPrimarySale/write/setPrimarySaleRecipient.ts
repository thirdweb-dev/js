import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setPrimarySaleRecipient" function.
 */

type SetPrimarySaleRecipientParamsInternal = {
  saleRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_saleRecipient";
  }>;
};

export type SetPrimarySaleRecipientParams = Prettify<
  | SetPrimarySaleRecipientParamsInternal
  | {
      asyncParams: () => Promise<SetPrimarySaleRecipientParamsInternal>;
    }
>;
const METHOD = [
  "0x6f4f2837",
  [
    {
      type: "address",
      name: "_saleRecipient",
    },
  ],
  [],
] as const;

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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.saleRecipient] as const;
          }
        : [options.saleRecipient],
  });
}
