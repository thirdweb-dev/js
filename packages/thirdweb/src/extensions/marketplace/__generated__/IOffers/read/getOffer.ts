import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "getOffer" function.
 */
export type GetOfferParams = {
  offerId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_offerId" }>;
};

const METHOD = [
  "0x4579268a",
  [
    {
      type: "uint256",
      name: "_offerId",
    },
  ],
  [
    {
      type: "tuple",
      name: "offer",
      components: [
        {
          type: "uint256",
          name: "offerId",
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
          type: "uint256",
          name: "totalPrice",
        },
        {
          type: "uint256",
          name: "expirationTimestamp",
        },
        {
          type: "address",
          name: "offeror",
        },
        {
          type: "address",
          name: "assetContract",
        },
        {
          type: "address",
          name: "currency",
        },
        {
          type: "uint8",
          name: "tokenType",
        },
        {
          type: "uint8",
          name: "status",
        },
      ],
    },
  ],
] as const;

/**
 * Calls the "getOffer" function on the contract.
 * @param options - The options for the getOffer function.
 * @returns The parsed result of the function call.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getOffer } from "thirdweb/extensions/marketplace";
 *
 * const result = await getOffer({
 *  offerId: ...,
 * });
 *
 * ```
 */
export async function getOffer(
  options: BaseTransactionOptions<GetOfferParams>,
) {
  return readContract({
    contract: options.contract,
    method: METHOD,
    params: [options.offerId],
  });
}
