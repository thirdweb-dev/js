import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setDefaultRoyaltyInfo" function.
 */
export type SetDefaultRoyaltyInfoParams = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_royaltyRecipient";
    type: "address";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_royaltyBps";
    type: "uint256";
  }>;
};

/**
 * Calls the "setDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the "setDefaultRoyaltyInfo" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setDefaultRoyaltyInfo } from "thirdweb/extensions/common";
 *
 * const transaction = setDefaultRoyaltyInfo({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setDefaultRoyaltyInfo(
  options: BaseTransactionOptions<SetDefaultRoyaltyInfoParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x600dd5ea",
      [
        {
          internalType: "address",
          name: "_royaltyRecipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_royaltyBps",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.royaltyRecipient, options.royaltyBps],
  });
}
