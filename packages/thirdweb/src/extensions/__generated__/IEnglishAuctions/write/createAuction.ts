import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createAuction" function.
 */
export type CreateAuctionParams = {
  params: AbiParameterToPrimitiveType<{
    components: [
      { internalType: "address"; name: "assetContract"; type: "address" },
      { internalType: "uint256"; name: "tokenId"; type: "uint256" },
      { internalType: "uint256"; name: "quantity"; type: "uint256" },
      { internalType: "address"; name: "currency"; type: "address" },
      { internalType: "uint256"; name: "minimumBidAmount"; type: "uint256" },
      { internalType: "uint256"; name: "buyoutBidAmount"; type: "uint256" },
      { internalType: "uint64"; name: "timeBufferInSeconds"; type: "uint64" },
      { internalType: "uint64"; name: "bidBufferBps"; type: "uint64" },
      { internalType: "uint64"; name: "startTimestamp"; type: "uint64" },
      { internalType: "uint64"; name: "endTimestamp"; type: "uint64" },
    ];
    internalType: "struct IEnglishAuctions.AuctionParameters";
    name: "_params";
    type: "tuple";
  }>;
};

/**
 * Calls the createAuction function on the contract.
 * @param options - The options for the createAuction function.
 * @returns A prepared transaction object.
 * @extension IENGLISHAUCTIONS
 * @example
 * ```
 * import { createAuction } from "thirdweb/extensions/IEnglishAuctions";
 *
 * const transaction = createAuction({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createAuction(
  options: BaseTransactionOptions<CreateAuctionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x16654d40",
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
              name: "minimumBidAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "buyoutBidAmount",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "timeBufferInSeconds",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "bidBufferBps",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "startTimestamp",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "endTimestamp",
              type: "uint64",
            },
          ],
          internalType: "struct IEnglishAuctions.AuctionParameters",
          name: "_params",
          type: "tuple",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "auctionId",
          type: "uint256",
        },
      ],
    ],
    params: [options.params],
  });
}
