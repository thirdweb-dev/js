import { getContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toTokens } from "../../../utils/units.js";
import { getCurrencyMetadata } from "../../erc20/read/getCurrencyMetadata.js";
import type { getAuction } from "../__generated__/IEnglishAuctions/read/getAuction.js";
import { computeStatus, getNFTAsset } from "../utils.js";
import type { EnglishAuction } from "./types.js";

/**
 * @internal
 */
export async function mapEnglishAuction(
  options: BaseTransactionOptions<{
    latestBlock: { timestamp: bigint };
    rawAuction: Awaited<ReturnType<typeof getAuction>>;
  }>,
): Promise<EnglishAuction> {
  const { latestBlock, rawAuction } = options;
  // process the listing
  const status = computeStatus({
    listingStatus: rawAuction.status,
    blockTimeStamp: latestBlock.timestamp,
    startTimestamp: rawAuction.startTimestamp,
    endTimestamp: rawAuction.endTimestamp,
  });

  const [auctionCurrencyMetadata, nftAsset] = await Promise.all([
    getCurrencyMetadata({
      contract: getContract({
        ...options.contract,
        address: rawAuction.currency,
      }),
    }),
    getNFTAsset({
      ...options,
      contract: getContract({
        ...options.contract,
        address: rawAuction.assetContract,
      }),
      tokenId: rawAuction.tokenId,
    }),
  ]);

  return {
    id: rawAuction.auctionId,
    creatorAddress: rawAuction.auctionCreator,
    assetContractAddress: rawAuction.assetContract,
    tokenId: rawAuction.tokenId,
    quantity: rawAuction.quantity,
    currencyContractAddress: rawAuction.currency,
    asset: nftAsset,
    startTimeInSeconds: rawAuction.startTimestamp,
    endTimeInSeconds: rawAuction.endTimestamp,
    status,
    minimumBidAmount: rawAuction.minimumBidAmount,
    minimumBidCurrencyValue: {
      ...auctionCurrencyMetadata,
      value: rawAuction.minimumBidAmount,
      displayValue: toTokens(
        rawAuction.minimumBidAmount,
        auctionCurrencyMetadata.decimals,
      ),
    },
    buyoutBidAmount: rawAuction.buyoutBidAmount,
    buyoutCurrencyValue: {
      ...auctionCurrencyMetadata,
      value: rawAuction.buyoutBidAmount,
      displayValue: toTokens(
        rawAuction.buyoutBidAmount,
        auctionCurrencyMetadata.decimals,
      ),
    },
    timeBufferInSeconds: rawAuction.timeBufferInSeconds,
    bidBufferBps: rawAuction.bidBufferBps,
  };
}
