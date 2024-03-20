import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
const FN_SELECTOR = "0xc815729d" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_offerId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "acceptOffer" function.
 * @param options - The options for the acceptOffer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeAcceptOfferParams } "thirdweb/extensions/marketplace";
 * const result = encodeAcceptOfferParams({
 *  offerId: ...,
 * });
 * ```
 */
export function encodeAcceptOfferParams(options: AcceptOfferParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.offerId]);
}

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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.offerId] as const;
          }
        : [options.offerId],
  });
}
