import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "acceptOffer" function.
 */
export type AcceptOfferParams = {
  offerId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_offerId";
    type: "uint256";
  }>;
};

/**
 * Calls the "acceptOffer" function on the contract.
 * @param options - The options for the "acceptOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { acceptOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = acceptOffer({
 *  offerId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function acceptOffer(
  options: BaseTransactionOptions<AcceptOfferParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc815729d",
      [
        {
          internalType: "uint256",
          name: "_offerId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.offerId],
  });
}
