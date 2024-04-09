import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setPrimarySaleRecipient" function.
 */

export type SetPrimarySaleRecipientParams = {
  saleRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_saleRecipient";
  }>;
};

export const FN_SELECTOR = "0x6f4f2837" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_saleRecipient",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setPrimarySaleRecipient" function.
 * @param options - The options for the setPrimarySaleRecipient function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetPrimarySaleRecipientParams } "thirdweb/extensions/common";
 * const result = encodeSetPrimarySaleRecipientParams({
 *  saleRecipient: ...,
 * });
 * ```
 */
export function encodeSetPrimarySaleRecipientParams(
  options: SetPrimarySaleRecipientParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.saleRecipient]);
}

/**
 * Calls the "setPrimarySaleRecipient" function on the contract.
 * @param options - The options for the "setPrimarySaleRecipient" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setPrimarySaleRecipient } from "thirdweb/extensions/common";
 *
 * const transaction = setPrimarySaleRecipient({
 *  contract,
 *  saleRecipient: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPrimarySaleRecipient(
  options: BaseTransactionOptions<
    | SetPrimarySaleRecipientParams
    | {
        asyncParams: () => Promise<SetPrimarySaleRecipientParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.saleRecipient] as const;
          }
        : [options.saleRecipient],
  });
}
