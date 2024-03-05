import { readContract } from "../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "isNewWinningBid" function.
 */
export type IsNewWinningBidParams = {
  auctionId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_auctionId";
    type: "uint256";
  }>;
  bidAmount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_bidAmount";
    type: "uint256";
  }>;
};

/**
 * Calls the isNewWinningBid function on the contract.
 * @param options - The options for the isNewWinningBid function.
 * @returns The parsed result of the function call.
 * @extension IENGLISHAUCTIONS
 * @example
 * ```
 * import { isNewWinningBid } from "thirdweb/extensions/IEnglishAuctions";
 *
 * const result = await isNewWinningBid({
 *  auctionId: ...,
 *  bidAmount: ...,
 * });
 *
 * ```
 */
export async function isNewWinningBid(
  options: BaseTransactionOptions<IsNewWinningBidParams>,
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x2eb566bd",
      [
        {
          internalType: "uint256",
          name: "_auctionId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_bidAmount",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.auctionId, options.bidAmount],
  });
}
