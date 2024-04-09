import { getContract } from "../../contract/contract.js";
import type { BaseTransactionOptions } from "../../transaction/types.js";
import type { NFT } from "../../utils/nft/parseNft.js";
import { toTokens } from "../../utils/units.js";
import { getCurrencyMetadata } from "../erc20/read/getCurrencyMetadata.js";
import { isERC721 } from "../erc721/read/isERC721.js";
import { isERC1155 } from "../erc1155/read/isERC1155.js";
import type { getListing } from "./__generated__/IDirectListings/read/getListing.js";
import type { getAuction } from "./__generated__/IEnglishAuctions/read/getAuction.js";
import type { DirectListing, EnglishAuction, ListingStatus } from "./types.js";

type GetAssetParams = {
  tokenId: bigint;
};

/**
 * Retrieves the NFT asset based on the provided options.
 * @param options The transaction options.
 * @returns A promise that resolves to the NFT asset.
 * @example
 * ```ts
 * import { getNFTAsset } from "thirdweb/extensions/marketplace";
 *
 * const nft = await getNFTAsset({ contract, tokenId: 1n });
 * ```
 */
async function getNFTAsset(
  options: BaseTransactionOptions<GetAssetParams>,
): Promise<NFT> {
  const [erc721, erc1155] = await Promise.all([
    isERC721(options),
    isERC1155(options),
  ]);
  switch (true) {
    case erc721: {
      const { getNFT } = await import("../erc721/read/getNFT.js");
      return getNFT(options);
    }
    case erc1155: {
      const { getNFT } = await import("../erc1155/read/getNFT.js");
      return getNFT(options);
    }
    default: {
      throw new Error("Contract is neither ERC721 nor ERC1155.");
    }
  }
}

function computeStatus(options: {
  listingStatus: number;
  blockTimeStamp: bigint;
  startTimestamp: bigint;
  endTimestamp: bigint;
}): ListingStatus {
  switch (options.listingStatus) {
    case 1: {
      if (options.startTimestamp > options.blockTimeStamp) {
        return "CREATED";
      }
      if (options.endTimestamp < options.blockTimeStamp) {
        return "EXPIRED";
      }
      return "ACTIVE";
    }
    case 2: {
      return "COMPLETED";
    }
    case 3: {
      return "CANCELLED";
    }
    default: {
      throw new Error(`Invalid listing status: "${options.listingStatus}"`);
    }
  }
}

/**
 * @internal
 */
export async function mapDirectListing(
  options: BaseTransactionOptions<{
    latestBlock: { timestamp: bigint };
    rawListing: Awaited<ReturnType<typeof getListing>>;
  }>,
): Promise<DirectListing> {
  const { latestBlock, rawListing } = options;
  // process the listing
  const status = computeStatus({
    listingStatus: rawListing.status,
    blockTimeStamp: latestBlock.timestamp,
    startTimestamp: rawListing.startTimestamp,
    endTimestamp: rawListing.endTimestamp,
  });

  const [currencyValuePerToken, nftAsset] = await Promise.all([
    getCurrencyMetadata({
      contract: getContract({
        ...options.contract,
        address: rawListing.currency,
      }),
    }),
    getNFTAsset({
      ...options,
      contract: getContract({
        ...options.contract,
        address: rawListing.assetContract,
      }),
      tokenId: rawListing.tokenId,
    }),
  ]);

  return {
    id: rawListing.listingId,
    creatorAddress: rawListing.listingCreator,
    assetContractAddress: rawListing.assetContract,
    tokenId: rawListing.tokenId,
    quantity: rawListing.quantity,
    currencyContractAddress: rawListing.currency,
    currencyValuePerToken: {
      ...currencyValuePerToken,
      value: rawListing.pricePerToken,
      displayValue: toTokens(
        rawListing.pricePerToken,
        currencyValuePerToken.decimals,
      ),
    },
    pricePerToken: rawListing.pricePerToken,
    asset: nftAsset,
    startTimeInSeconds: rawListing.startTimestamp,
    endTimeInSeconds: rawListing.endTimestamp,
    isReservedListing: rawListing.reserved,
    status,
  };
}

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

/**
 * @internal
 */
export async function getAllInBatches<const T>(
  fn: (start: bigint, end: bigint) => Promise<T>,
  options: {
    start: bigint;
    end: bigint;
    maxSize: bigint;
  },
): Promise<T[]> {
  let start = options.start;
  const batches: Promise<T>[] = [];
  while (options.end - start > options.maxSize) {
    batches.push(fn(start, options.end + options.maxSize - 1n));
    start += options.maxSize;
  }
  batches.push(fn(start, options.end - 1n));

  return await Promise.all(batches);
}

export type IsListingValidParams = {
  listing: DirectListing;
  quantity?: bigint;
};
export type ValidReturn = { valid: true } | { valid: false; reason: string };

export async function isListingValid(
  options: BaseTransactionOptions<IsListingValidParams>,
): Promise<ValidReturn> {
  const assetContract = getContract({
    ...options.contract,
    address: options.listing.assetContractAddress,
  });

  const [erc721, erc1155] = await Promise.all([
    isERC721({ contract: assetContract }),
    isERC1155({ contract: assetContract }),
  ]);

  // if the asset is an erc721 token
  if (erc721) {
    const [{ isApprovedForAll }, { getApproved }, { ownerOf }] =
      await Promise.all([
        import("../erc721/__generated__/IERC721A/read/isApprovedForAll.js"),
        import("../erc721/__generated__/IERC721A/read/getApproved.js"),
        import("../erc721/__generated__/IERC721A/read/ownerOf.js"),
      ]);
    // check for token approval
    const [approvedForAll, approvedOperator, tokenOwner] = await Promise.all([
      isApprovedForAll({
        contract: assetContract,
        owner: options.listing.creatorAddress,
        // the marketplace contract address has to be approved to transfer the token
        operator: options.contract.address,
      }),
      getApproved({
        contract: assetContract,
        tokenId: options.listing.tokenId,
      }).catch(() => ""),
      ownerOf({
        contract: assetContract,
        tokenId: options.listing.tokenId,
      }),
    ]);
    // if the marketplace is not approved for all and the marketplace contract is not the approved operator for the token
    // -> the listing is not valid
    if (!approvedForAll && approvedOperator !== options.contract.address) {
      return { valid: false, reason: "Asset not approved for marketplace." };
    }
    // if the token owner is not the creator of the listing
    // -> the listing is not valid
    if (tokenOwner !== options.listing.creatorAddress) {
      return {
        valid: false,
        reason: "Listing creator no longer owns this token.",
      };
    }
    // otherwise the listing is valid
    return {
      valid: true,
    };
  }
  // if the asset is an erc1155 token
  if (erc1155) {
    const [{ isApprovedForAll }, { balanceOf }] = await Promise.all([
      import("../erc1155/__generated__/IERC1155/read/isApprovedForAll.js"),
      import("../erc1155/__generated__/IERC1155/read/balanceOf.js"),
    ]);

    const [approvedForAll, balance] = await Promise.all([
      isApprovedForAll({
        contract: assetContract,
        owner: options.listing.creatorAddress,
        // the marketplace contract address has to be approved to transfer the token
        operator: options.contract.address,
      }),
      balanceOf({
        contract: assetContract,
        owner: options.listing.creatorAddress,
        tokenId: options.listing.tokenId,
      }),
    ]);

    // if the marketplace is not approved for all
    // -> the listing is not valid
    if (!approvedForAll) {
      return { valid: false, reason: "Asset not approved for marketplace." };
    }
    // if the balance is less than the quantity the user is trying to purchase or the listing quantity
    // -> the listing is not valid
    const quantityWanted = options.quantity || options.listing.quantity;
    if (balance < quantityWanted) {
      return {
        valid: false,
        reason:
          "Seller does not have enough balance of token to fulfill order.",
      };
    }
    return {
      valid: true,
    };
  }
  // if the asset is neither ERC721 nor ERC1155

  return {
    valid: false,
    reason: "AssetContract must implement ERC 1155 or ERC 721.",
  };
}
