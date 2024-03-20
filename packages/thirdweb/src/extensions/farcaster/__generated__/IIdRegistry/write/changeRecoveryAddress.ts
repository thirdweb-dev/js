import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "changeRecoveryAddress" function.
 */

type ChangeRecoveryAddressParamsInternal = {
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
};

export type ChangeRecoveryAddressParams = Prettify<
  | ChangeRecoveryAddressParamsInternal
  | {
      asyncParams: () => Promise<ChangeRecoveryAddressParamsInternal>;
    }
>;
/**
 * Calls the "changeRecoveryAddress" function on the contract.
 * @param options - The options for the "changeRecoveryAddress" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { changeRecoveryAddress } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddress({
 *  recovery: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function changeRecoveryAddress(
  options: BaseTransactionOptions<ChangeRecoveryAddressParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf1f0b224",
      [
        {
          type: "address",
          name: "recovery",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.recovery] as const;
          }
        : [options.recovery],
  });
}
