import type { IERC1155, IERC165, IERC721 } from "@thirdweb-dev/contracts-js";
import {
  BigNumber,
  BigNumberish,
  Contract,
  ContractFunction,
  providers,
} from "ethers";
import invariant from "tiny-invariant";
import { DEFAULT_QUERY_ALL_COUNT } from "../../core/schema/QueryParams";
import { MAX_BPS } from "../../core/schema/shared";
import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../constants/contract";
import { ContractWrapper } from "../core/classes/internal/contract-wrapper";
import { fetchCurrencyValue } from "./currency/fetchCurrencyValue";
import { NewDirectListing } from "../types/marketplace/NewDirectListing";
import { NewAuctionListing } from "../types/marketplace/NewAuctionListing";
import { UnmappedOffer } from "../types/marketplace/UnmappedOffer";
import { Offer } from "../types/marketplace/Offer";

/**
 * This method checks if the given token is approved for the transferrerContractAddress contract.
 * This is particularly useful for contracts that need to transfer NFTs on the users' behalf
 *
 * @internal
 * @param provider - The connected provider
 * @param transferrerContractAddress - The address of the marketplace contract
 * @param assetContract - The address of the asset contract.
 * @param tokenId - The token id of the token.
 * @param owner - The address of the account that owns the token.
 * @returns  True if the transferrerContractAddress is approved on the token, false otherwise.
 */
export async function isTokenApprovedForTransfer(
  provider: providers.Provider,
  transferrerContractAddress: string,
  assetContract: string,
  tokenId: BigNumberish,
  owner: string,
): Promise<boolean> {
  try {
    const ERC165Abi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/IERC165.json")
    ).default;
    const erc165 = new Contract(assetContract, ERC165Abi, provider) as IERC165;
    const [isERC721, isERC1155] = await Promise.all([
      erc165.supportsInterface(InterfaceId_IERC721),
      erc165.supportsInterface(InterfaceId_IERC1155),
    ]);
    if (isERC721) {
      const ERC721Abi = (
        await import("@thirdweb-dev/contracts-js/dist/abis/IERC721.json")
      ).default;
      const asset = new Contract(assetContract, ERC721Abi, provider) as IERC721;

      const approved = await asset.isApprovedForAll(
        owner,
        transferrerContractAddress,
      );
      if (approved) {
        return true;
      }

      // Handle reverts in case of non-existent tokens
      let approvedAddress;
      try {
        approvedAddress = await asset.getApproved(tokenId);
      } catch (e) {}
      return (
        approvedAddress?.toLowerCase() ===
        transferrerContractAddress.toLowerCase()
      );
    } else if (isERC1155) {
      const ERC1155Abi = (
        await import("@thirdweb-dev/contracts-js/dist/abis/IERC1155.json")
      ).default;
      const asset = new Contract(
        assetContract,
        ERC1155Abi,
        provider,
      ) as IERC1155;
      return await asset.isApprovedForAll(owner, transferrerContractAddress);
    } else {
      console.error("Contract does not implement ERC 1155 or ERC 721.");
      return false;
    }
  } catch (err: any) {
    console.error("Failed to check if token is approved", err);
    return false;
  }
}

/**
 * Checks if the marketplace is approved to make transfers on the assetContract
 * If not, it tries to set the approval.
 * @param contractWrapper - The contract wrapper to use
 * @param marketplaceAddress - The address of the marketplace contract
 * @param assetContract - The address of the asset contract.
 * @param tokenId - The token id of the token.
 * @param from - The address of the account that owns the token.
 */
export async function handleTokenApproval(
  contractWrapper: ContractWrapper<any>,
  marketplaceAddress: string,
  assetContract: string,
  tokenId: BigNumberish,
  from: string,
): Promise<void> {
  const ERC165Abi = (
    await import("@thirdweb-dev/contracts-js/dist/abis/IERC165.json")
  ).default;
  const erc165 = new ContractWrapper<IERC165>(
    contractWrapper.getSignerOrProvider(),
    assetContract,
    ERC165Abi,
    contractWrapper.options,
    contractWrapper.storage,
  );
  const [isERC721, isERC1155] = await Promise.all([
    erc165.read("supportsInterface", [InterfaceId_IERC721]),
    erc165.read("supportsInterface", [InterfaceId_IERC1155]),
  ]);
  // check for token approval
  if (isERC721) {
    const ERC721Abi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/IERC721.json")
    ).default;
    const asset = new ContractWrapper<IERC721>(
      contractWrapper.getSignerOrProvider(),
      assetContract,
      ERC721Abi,
      contractWrapper.options,
      contractWrapper.storage,
    );
    const approved = await asset.read("isApprovedForAll", [
      from,
      marketplaceAddress,
    ]);
    if (!approved) {
      const isTokenApproved =
        (await asset.read("getApproved", [tokenId])).toLowerCase() ===
        marketplaceAddress.toLowerCase();

      if (!isTokenApproved) {
        await asset.sendTransaction("setApprovalForAll", [
          marketplaceAddress,
          true,
        ]);
      }
    }
  } else if (isERC1155) {
    const ERC1155Abi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/IERC1155.json")
    ).default;
    const asset = new ContractWrapper<IERC1155>(
      contractWrapper.getSignerOrProvider(),
      assetContract,
      ERC1155Abi,
      contractWrapper.options,
      contractWrapper.storage,
    );

    const approved = await asset.read("isApprovedForAll", [
      from,
      marketplaceAddress,
    ]);
    if (!approved) {
      await asset.sendTransaction("setApprovalForAll", [
        marketplaceAddress,
        true,
      ]);
    }
  } else {
    throw Error("Contract must implement ERC 1155 or ERC 721.");
  }
}

/**
 * Used to verify fields in new listing.
 * @internal
 */
// TODO this should be done in zod
export function validateNewListingParam(
  param: NewDirectListing | NewAuctionListing,
) {
  invariant(
    param.assetContractAddress !== undefined &&
      param.assetContractAddress !== null,
    "Asset contract address is required",
  );
  invariant(
    param.buyoutPricePerToken !== undefined &&
      param.buyoutPricePerToken !== null,
    "Buyout price is required",
  );
  invariant(
    param.listingDurationInSeconds !== undefined &&
      param.listingDurationInSeconds !== null,
    "Listing duration is required",
  );
  invariant(
    param.startTimestamp !== undefined && param.startTimestamp !== null,
    "Start time is required",
  );
  invariant(
    param.tokenId !== undefined && param.tokenId !== null,
    "Token ID is required",
  );
  invariant(
    param.quantity !== undefined && param.quantity !== null,
    "Quantity is required",
  );

  switch (param.type) {
    case "NewAuctionListing": {
      invariant(
        param.reservePricePerToken !== undefined &&
          param.reservePricePerToken !== null,
        "Reserve price is required",
      );
    }
  }
}

/**
 * Maps a contract offer to the strict interface
 *
 * @internal
 * @param offer - The offer to map
 * @returns  An `Offer` object
 */
export async function mapOffer(
  provider: providers.Provider,
  listingId: BigNumber,
  offer: UnmappedOffer,
): Promise<Offer> {
  return {
    quantity: offer.quantityDesired,
    pricePerToken: offer.pricePerToken,
    currencyContractAddress: offer.currency,
    buyerAddress: offer.offeror,
    quantityDesired: offer.quantityWanted,
    currencyValue: await fetchCurrencyValue(
      provider,
      offer.currency,
      (offer.quantityWanted as BigNumber).mul(offer.pricePerToken as BigNumber),
    ),
    listingId,
  } as Offer;
}

export function isWinningBid(
  winningPrice: BigNumberish,
  newBidPrice: BigNumberish,
  bidBuffer: BigNumberish,
): boolean {
  bidBuffer = BigNumber.from(bidBuffer);
  winningPrice = BigNumber.from(winningPrice);
  newBidPrice = BigNumber.from(newBidPrice);
  if (winningPrice.eq(BigNumber.from(0))) {
    return false;
  }
  const buffer = newBidPrice.sub(winningPrice).mul(MAX_BPS).div(winningPrice);
  return buffer.gte(bidBuffer);
}

export async function getAllInBatches(
  start: number,
  end: number,
  fn: ContractFunction,
): Promise<any[]> {
  const batches: any[] = [];
  while (end - start > DEFAULT_QUERY_ALL_COUNT) {
    batches.push(fn(start, start + DEFAULT_QUERY_ALL_COUNT - 1));
    start += DEFAULT_QUERY_ALL_COUNT;
  }
  batches.push(fn(start, end - 1));

  return await Promise.all(batches);
}
