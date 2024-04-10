import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "cancelOffer" function.
 */
export type CancelOfferParams = WithValue<{
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
}>;

export const FN_SELECTOR = "0xef706adf" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_offerId",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "cancelOffer" function.
 * @param options - The options for the cancelOffer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeCancelOfferParams } "thirdweb/extensions/marketplace";
 * const result = encodeCancelOfferParams({
 *  offerId: ...,
 * });
 * ```
 */
export function encodeCancelOfferParams(options: CancelOfferParams) {
  return encodeAbiParameters(FN_INPUTS, [options.offerId]);
}

/**
 * Calls the "cancelOffer" function on the contract.
 * @param options - The options for the "cancelOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { cancelOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = cancelOffer({
 *  contract,
 *  offerId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelOffer(
  options: BaseTransactionOptions<
    | CancelOfferParams
    | {
        asyncParams: () => Promise<CancelOfferParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [resolvedParams.offerId] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
