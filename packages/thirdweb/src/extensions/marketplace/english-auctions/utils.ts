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
    blockTimeStamp: latestBlock.timestamp,
    endTimestamp: rawAuction.endTimestamp,
    listingStatus: rawAuction.status,
    startTimestamp: rawAuction.startTimestamp,
  });

  const currencyContract = getContract({
    ...options.contract,
    address: rawAuction.currency,
  });
  const [auctionCurrencyMetadata, nftAsset] = await Promise.all([
    getCurrencyMetadata({
      contract: currencyContract,
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
    asset: nftAsset,
    assetContractAddress: rawAuction.assetContract,
    bidBufferBps: rawAuction.bidBufferBps,
    buyoutBidAmount: rawAuction.buyoutBidAmount,
    buyoutCurrencyValue: {
      ...auctionCurrencyMetadata,
      chainId: currencyContract.chain.id,
      displayValue: toTokens(
        rawAuction.buyoutBidAmount,
        auctionCurrencyMetadata.decimals,
      ),
      tokenAddress: currencyContract.address,
      value: rawAuction.buyoutBidAmount,
    },
    creatorAddress: rawAuction.auctionCreator,
    currencyContractAddress: rawAuction.currency,
    endTimeInSeconds: rawAuction.endTimestamp,
    id: rawAuction.auctionId,
    minimumBidAmount: rawAuction.minimumBidAmount,
    minimumBidCurrencyValue: {
      ...auctionCurrencyMetadata,
      chainId: currencyContract.chain.id,
      displayValue: toTokens(
        rawAuction.minimumBidAmount,
        auctionCurrencyMetadata.decimals,
      ),
      tokenAddress: currencyContract.address,
      value: rawAuction.minimumBidAmount,
    },
    quantity: rawAuction.quantity,
    startTimeInSeconds: rawAuction.startTimestamp,
    status,
    timeBufferInSeconds: rawAuction.timeBufferInSeconds,
    tokenId: rawAuction.tokenId,
    type: "english-auction",
  };
}
