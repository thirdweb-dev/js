import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "cancelOffer" function.
 */
export type CancelOfferParams = {
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
};

/**
 * Calls the "cancelOffer" function on the contract.
 * @param options - The options for the "cancelOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { cancelOffer } from "thirdweb/extensions/marketplace";
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
          type: "uint256",
          name: "_offerId",
        },
      ],
      [],
    ],
    params: [options.offerId],
  });
}
