import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "acceptOffer" function.
 */

type AcceptOfferParamsInternal = {
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
};

export type AcceptOfferParams = Prettify<
  | AcceptOfferParamsInternal
  | {
      asyncParams: () => Promise<AcceptOfferParamsInternal>;
    }
>;
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
          type: "uint256",
          name: "_offerId",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.offerId] as const;
          }
        : [options.offerId],
  });
}
