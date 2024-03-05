import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "cancelOffer" function.
 */
export type CancelOfferParams = {
  offerId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_offerId";
    type: "uint256";
  }>;
};

/**
 * Calls the cancelOffer function on the contract.
 * @param options - The options for the cancelOffer function.
 * @returns A prepared transaction object.
 * @extension IOFFERS
 * @example
 * ```
 * import { cancelOffer } from "thirdweb/extensions/IOffers";
 *
 * const transaction = cancelOffer({
 *  offerId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelOffer(
  options: BaseTransactionOptions<CancelOfferParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xef706adf",
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
