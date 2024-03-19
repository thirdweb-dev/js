import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "changeRecoveryAddressFor" function.
 */
export type ChangeRecoveryAddressForParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  recovery: AbiParameterToPrimitiveType<{ type: "address"; name: "recovery" }>;
  deadline: AbiParameterToPrimitiveType<{ type: "uint256"; name: "deadline" }>;
  sig: AbiParameterToPrimitiveType<{ type: "bytes"; name: "sig" }>;
};

/**
 * Calls the "changeRecoveryAddressFor" function on the contract.
 * @param options - The options for the "changeRecoveryAddressFor" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { changeRecoveryAddressFor } from "thirdweb/extensions/farcaster";
 *
 * const transaction = changeRecoveryAddressFor({
 *  owner: ...,
 *  recovery: ...,
 *  deadline: ...,
 *  sig: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function changeRecoveryAddressFor(
  options: BaseTransactionOptions<ChangeRecoveryAddressForParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x9cbef8dc",
      [
        {
          type: "address",
          name: "owner",
        },
        {
          type: "address",
          name: "recovery",
        },
        {
          type: "uint256",
          name: "deadline",
        },
        {
          type: "bytes",
          name: "sig",
        },
      ],
      [],
    ],
    params: [options.owner, options.recovery, options.deadline, options.sig],
  });
}
