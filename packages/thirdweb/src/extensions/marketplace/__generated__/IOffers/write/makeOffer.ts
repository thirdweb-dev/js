import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
    method: [
      "0x016767fa",
      [
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
      ],
      [
        {
          type: "uint256",
          name: "offerId",
        },
      ],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.params] as const;
      }

      return [options.params] as const;
    },
  });
}
