import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "buy" function.
 */
export type BuyParams = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  buyFor: AbiParameterToPrimitiveType<{ type: "address"; name: "_buyFor" }>;
  quantity: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_quantity" }>;
  currency: AbiParameterToPrimitiveType<{ type: "address"; name: "_currency" }>;
  totalPrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_totalPrice";
  }>;
};

/**
 * Calls the "buy" function on the contract.
 * @param options - The options for the "buy" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { buy } from "thirdweb/extensions/marketplace";
 *
 * const transaction = buy({
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function buy(options: BaseTransactionOptions<BuyParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x7687ab02",
      [
        {
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "address",
          name: "_buyFor",
        },
        {
          type: "uint256",
          name: "_quantity",
        },
        {
          type: "address",
          name: "_currency",
        },
        {
          type: "uint256",
          name: "_totalPrice",
        },
      ],
      [],
    ],
    params: [
      options.listingId,
      options.buyFor,
      options.quantity,
      options.currency,
      options.totalPrice,
    ],
  });
}
