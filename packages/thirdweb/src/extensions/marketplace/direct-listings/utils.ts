import { getContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toTokens } from "../../../utils/units.js";
import { getCurrencyMetadata } from "../../erc20/read/getCurrencyMetadata.js";
import { isERC721 } from "../../erc721/read/isERC721.js";
import { isERC1155 } from "../../erc1155/read/isERC1155.js";
import type { getListing } from "../__generated__/IDirectListings/read/getListing.js";
import { computeStatus, getNFTAsset } from "../utils.js";
import type { DirectListing } from "./types.js";

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
    blockTimeStamp: latestBlock.timestamp,
    endTimestamp: rawListing.endTimestamp,
    listingStatus: rawListing.status,
    startTimestamp: rawListing.startTimestamp,
  });

  const currencyContract = getContract({
    ...options.contract,
    address: rawListing.currency,
  });
  const [currencyValuePerToken, nftAsset] = await Promise.all([
    getCurrencyMetadata({
      contract: currencyContract,
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
    asset: nftAsset,
    assetContractAddress: rawListing.assetContract,
    creatorAddress: rawListing.listingCreator,
    currencyContractAddress: rawListing.currency,
    currencyValuePerToken: {
      ...currencyValuePerToken,
      chainId: currencyContract.chain.id,
      displayValue: toTokens(
        rawListing.pricePerToken,
        currencyValuePerToken.decimals,
      ),
      tokenAddress: currencyContract.address,
      value: rawListing.pricePerToken,
    },
    endTimeInSeconds: rawListing.endTimestamp,
    id: rawListing.listingId,
    isReservedListing: rawListing.reserved,
    pricePerToken: rawListing.pricePerToken,
    quantity: rawListing.quantity,
    startTimeInSeconds: rawListing.startTimestamp,
    status,
    tokenId: rawListing.tokenId,
    type: "direct-listing",
  };
}

type IsListingValidParams = {
  listing: DirectListing;
  quantity?: bigint;
};
type ValidReturn = { valid: true } | { valid: false; reason: string };

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
        import("../../erc721/__generated__/IERC721A/read/isApprovedForAll.js"),
        import("../../erc721/__generated__/IERC721A/read/getApproved.js"),
        import("../../erc721/__generated__/IERC721A/read/ownerOf.js"),
      ]);
    // check for token approval
    const [approvedForAll, approvedOperator, tokenOwner] = await Promise.all([
      isApprovedForAll({
        contract: assetContract,
        // the marketplace contract address has to be approved to transfer the token
        operator: options.contract.address,
        owner: options.listing.creatorAddress,
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
      return { reason: "Asset not approved for marketplace.", valid: false };
    }
    // if the token owner is not the creator of the listing
    // -> the listing is not valid
    if (tokenOwner !== options.listing.creatorAddress) {
      return {
        reason: "Listing creator no longer owns this token.",
        valid: false,
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
      import("../../erc1155/__generated__/IERC1155/read/isApprovedForAll.js"),
      import("../../erc1155/__generated__/IERC1155/read/balanceOf.js"),
    ]);

    const [approvedForAll, balance] = await Promise.all([
      isApprovedForAll({
        contract: assetContract,
        // the marketplace contract address has to be approved to transfer the token
        operator: options.contract.address,
        owner: options.listing.creatorAddress,
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
      return { reason: "Asset not approved for marketplace.", valid: false };
    }
    // if the balance is less than the quantity the user is trying to purchase or the listing quantity
    // -> the listing is not valid
    const quantityWanted = options.quantity || options.listing.quantity;
    if (balance < quantityWanted) {
      return {
        reason:
          "Seller does not have enough balance of token to fulfill order.",
        valid: false,
      };
    }
    return {
      valid: true,
    };
  }
  // if the asset is neither ERC721 nor ERC1155

  return {
    reason: "AssetContract must implement ERC 1155 or ERC 721.",
    valid: false,
  };
}
