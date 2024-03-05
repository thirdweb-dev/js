import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setPlatformFeeInfo" function.
 */
export type SetPlatformFeeInfoParams = {
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_platformFeeRecipient";
    type: "address";
  }>;
  platformFeeBps: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_platformFeeBps";
    type: "uint256";
  }>;
};

/**
 * Calls the "setPlatformFeeInfo" function on the contract.
 * @param options - The options for the "setPlatformFeeInfo" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { setPlatformFeeInfo } from "thirdweb/extensions/marketplace";
 *
 * const transaction = setPlatformFeeInfo({
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPlatformFeeInfo(
  options: BaseTransactionOptions<SetPlatformFeeInfoParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x1e7ac488",
      [
        {
          internalType: "address",
          name: "_platformFeeRecipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_platformFeeBps",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.platformFeeRecipient, options.platformFeeBps],
  });
}
