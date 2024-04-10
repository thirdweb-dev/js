import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "bidInAuction" function.
 */
export type BidInAuctionParams = WithValue<{
  auctionId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_auctionId";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_bidAmount";
  }>;
}>;

export const FN_SELECTOR = "0x0858e5ad" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_auctionId",
  },
  {
    type: "uint256",
    name: "_bidAmount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "bidInAuction" function.
 * @param options - The options for the bidInAuction function.
 * @returns The encoded ABI parameters.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { encodeBidInAuctionParams } "thirdweb/extensions/marketplace";
 * const result = encodeBidInAuctionParams({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 * ```
 */
export function encodeBidInAuctionParams(options: BidInAuctionParams) {
  return encodeAbiParameters(FN_INPUTS, [options.auctionId, options.bidAmount]);
}

/**
 * Calls the "bidInAuction" function on the contract.
 * @param options - The options for the "bidInAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { bidInAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = bidInAuction({
 *  contract,
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function bidInAuction(
  options: BaseTransactionOptions<
    | BidInAuctionParams
    | {
        asyncParams: () => Promise<BidInAuctionParams>;
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
      return [resolvedParams.auctionId, resolvedParams.bidAmount] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
