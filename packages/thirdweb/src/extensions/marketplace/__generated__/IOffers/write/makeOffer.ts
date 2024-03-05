import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "makeOffer" function.
 */
export type MakeOfferParams = {
  params: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "assetContract"; type: "address" },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "quantity"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
      { internalType: "uint256"; name: "totalPrice"; type: "uint256" },
      { internalType: "uint256"; name: "expirationTimestamp"; type: "uint256" },
    ];
    internalType: "struct IOffers.OfferParams";
    name: "_params";
    type: "tuple";
  }>;
};

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
          components: [
            {
              internalType: "address",
              name: "assetContract",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "currency",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "totalPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expirationTimestamp",
              type: "uint256",
            },
          ],
          internalType: "struct IOffers.OfferParams",
          name: "_params",
          type: "tuple",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
      ],
    ],
    params: [options.params],
  });
}
