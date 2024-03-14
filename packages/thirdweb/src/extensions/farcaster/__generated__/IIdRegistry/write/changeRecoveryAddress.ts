import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "changeRecoveryAddress" function.
 */
export type ChangeRecoveryAddressParams = {
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
};

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
    params: [options.recovery],
  });
}
