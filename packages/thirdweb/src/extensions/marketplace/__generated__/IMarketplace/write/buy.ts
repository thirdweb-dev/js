import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "buy" function.
 */
export type BuyParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
  buyFor: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_buyFor";
    type: "address";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_quantity";
    type: "uint256";
  }>;
  currency: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_currency";
    type: "address";
  }>;
  totalPrice: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_totalPrice";
    type: "uint256";
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
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_buyFor",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_currency",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_totalPrice",
          type: "uint256",
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
