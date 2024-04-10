import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "acceptOffer" function.
 */
export type AcceptOfferParams = WithOverrides<{
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
}>;

export const FN_SELECTOR = "0xc815729d" as const;
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
 * ```ts
 * import { encodeAcceptOfferParams } "thirdweb/extensions/marketplace";
 * const result = encodeAcceptOfferParams({
 *  offerId: ...,
 * });
 * ```
 */
export function encodeAcceptOfferParams(options: AcceptOfferParams) {
  return encodeAbiParameters(FN_INPUTS, [options.offerId]);
}

/**
 * Calls the "acceptOffer" function on the contract.
 * @param options - The options for the "acceptOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { acceptOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = acceptOffer({
 *  contract,
 *  offerId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function acceptOffer(
  options: BaseTransactionOptions<
    | AcceptOfferParams
    | {
        asyncParams: () => Promise<AcceptOfferParams>;
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
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.offerId] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
  });
}
