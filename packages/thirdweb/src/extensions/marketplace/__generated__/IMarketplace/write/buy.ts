import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "buy" function.
 */

type BuyParamsInternal = {
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

export type BuyParams = Prettify<
  | BuyParamsInternal
  | {
      asyncParams: () => Promise<BuyParamsInternal>;
    }
>;
const FN_SELECTOR = "0x7687ab02" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "buy" function.
 * @param options - The options for the buy function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { encodeBuyParams } "thirdweb/extensions/marketplace";
 * const result = encodeBuyParams({
 *  listingId: ...,
 *  buyFor: ...,
 *  quantity: ...,
 *  currency: ...,
 *  totalPrice: ...,
 * });
 * ```
 */
export function encodeBuyParams(options: BuyParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [
    options.listingId,
    options.buyFor,
    options.quantity,
    options.currency,
    options.totalPrice,
  ]);
}

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
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.listingId,
              resolvedParams.buyFor,
              resolvedParams.quantity,
              resolvedParams.currency,
              resolvedParams.totalPrice,
            ] as const;
          }
        : [
            options.listingId,
            options.buyFor,
            options.quantity,
            options.currency,
            options.totalPrice,
          ],
  });
}
