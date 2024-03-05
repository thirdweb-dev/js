import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setDefaultRoyaltyInfo" function.
 */
export type SetDefaultRoyaltyInfoParams = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_royaltyRecipient";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_royaltyBps";
  }>;
};

/**
 * Calls the "setDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the "setDefaultRoyaltyInfo" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { setDefaultRoyaltyInfo } from "thirdweb/extensions/erc721";
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
          type: "address",
          name: "_royaltyRecipient",
        },
        {
          type: "uint256",
          name: "_royaltyBps",
        },
      ],
      [],
    ],
    params: [options.royaltyRecipient, options.royaltyBps],
  });
}
