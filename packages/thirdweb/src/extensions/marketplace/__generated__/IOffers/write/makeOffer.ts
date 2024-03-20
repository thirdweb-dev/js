import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "makeOffer" function.
 */

type MakeOfferParamsInternal = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "quantity" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "totalPrice" },
      { type: "uint256"; name: "expirationTimestamp" },
    ];
  }>;
};

export type MakeOfferParams = Prettify<
  | MakeOfferParamsInternal
  | {
      asyncParams: () => Promise<MakeOfferParamsInternal>;
    }
>;
const FN_SELECTOR = "0x016767fa" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "_params",
    components: [
      {
        type: "address",
        name: "assetContract",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "quantity",
      },
      {
        type: "address",
        name: "currency",
      },
      {
        type: "uint256",
        name: "totalPrice",
      },
      {
        type: "uint256",
        name: "expirationTimestamp",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "offerId",
  },
] as const;

/**
 * Encodes the parameters for the "makeOffer" function.
 * @param options - The options for the makeOffer function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeMakeOfferParams } "thirdweb/extensions/marketplace";
 * const result = encodeMakeOfferParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeMakeOfferParams(options: MakeOfferParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Calls the "makeOffer" function on the contract.
 * @param options - The options for the "makeOffer" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { makeOffer } from "thirdweb/extensions/marketplace";
 *
 * const transaction = makeOffer({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function makeOffer(options: BaseTransactionOptions<MakeOfferParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.params] as const;
          }
        : [options.params],
  });
}
