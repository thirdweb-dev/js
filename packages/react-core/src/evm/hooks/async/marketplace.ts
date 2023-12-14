import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../useSDK";
import {
  AcceptDirectOffer,
  BuyFromListingParams,
  BuyNowParams,
  ExecuteAuctionSale,
  MakeBidParams,
  MakeOfferParams,
} from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useAddress } from "../wallet";
import { useContractEvents } from "./contracts";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  AuctionListing,
  DirectListing,
  Marketplace,
  MarketplaceFilter,
  MarketplaceV3,
  NewAuctionListing,
  NewDirectListing,
} from "@thirdweb-dev/sdk";
import { ListingType } from "@thirdweb-dev/sdk";
import type { DirectListingInputParams } from "@thirdweb-dev/sdk";
import type { EnglishAuctionInputParams } from "@thirdweb-dev/sdk";
import type { BigNumberish, providers } from "ethers";
import { BigNumber } from "ethers";
import invariant from "tiny-invariant";

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Hook for getting a specific listing on a `Marketplace` contract.
 *
 * Note: this hook is only available for `Marketplace` contracts.
 *
 * If you are using [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3),
 * use `useDirectListing` or `useEnglishAuction` instead.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useListing } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 * const listingId = 0;
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data, isLoading, error } = useListing(contract, listingId);
 * }
 * ```
 *
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the desired listing
 * The hook's `data` property, once loaded, is an object containing the desired listing data.
 *
 * The exact shape of the object depends on the type of listing.
 *
 * For auctions, it will be a
 * `AuctionListing` object.
 * For direct listings, it will be a `DirectListing` object.
 *
 * ```jsx
 * AuctionListing | DirectListing | undefined;
 * ```
 *
 * You can use the shared `type` property to determine which type of listing is being returned.
 *
 * ```ts
 * interface AuctionListing {
 *   // The id of the listing
 *   id: string;
 *
 *   // The address of the asset being listed.
 *   assetContractAddress: string;
 *
 *   // The ID of the token to list.
 *   tokenId: BigNumberish;
 *
 *   // The asset being listed.
 *   asset: NFTMetadata;
 *
 *   // The start time of the listing.
 *   startTimeInEpochSeconds: BigNumberish;
 *
 *   // Number of seconds until the auction expires.
 *   endTimeInEpochSeconds: BigNumberish;
 *
 *   // The quantity of tokens to include in the listing.
 *   // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: BigNumberish;
 *
 *   // The address of the currency to accept for the listing.
 *   currencyContractAddress: string;
 *
 *   // The reserve price is the minimum price that a bid must be in order to be accepted.
 *   reservePrice: BigNumber;
 *
 *   // The buyout price of the listing.
 *   buyoutPrice: BigNumber;
 *
 *   // The `CurrencyValue` of the buyout price listing.
 *   // Useful for displaying the price information.
 *   buyoutCurrencyValuePerToken: CurrencyValue;
 *
 *   // The `CurrencyValue` of the reserve price.
 *   // Useful for displaying the price information.
 *   reservePriceCurrencyValuePerToken: CurrencyValue;
 *
 *   // The address of the seller.
 *   sellerAddress: string;
 *
 *   // The type of listing.
 *   type: ListingType.Auction;
 * }
 *
 * interface DirectListing {
 *   // The id of the listing.
 *   id: string;
 *
 *   // The address of the asset being listed.
 *   assetContractAddress: string;
 *
 *   // The ID of the token to list.
 *   tokenId: BigNumberish;
 *
 *   // The asset being listed.
 *   asset: NFTMetadata;
 *
 *   // The start time of the listing.
 *   startTimeInSeconds: BigNumberish;
 *
 *   // Number of seconds until the listing expires.
 *   secondsUntilEnd: BigNumberish;
 *
 *   // The quantity of tokens to include in the listing.
 *   // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: BigNumberish;
 *
 *   // The address of the currency to accept for the listing.
 *   currencyContractAddress: string;
 *
 *   // The `CurrencyValue` of the listing. Useful for displaying the price information.
 *   buyoutCurrencyValuePerToken: CurrencyValue;
 *
 *   // The buyout price of the listing.
 *   buyoutPrice: BigNumber;
 *
 *   // The address of the seller.
 *   sellerAddress: string;
 *
 *   // The type of listing.
 *   type: ListingType.Direct;
 * }
 * ```
 *
 * @marketplace
 */
export function useListing(
  contract: RequiredParam<Marketplace>,
  listingId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.getListing(contractAddress, listingId),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");
      return contract.getListing(listingId);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook to get a specific direct listing from a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace`
 * contracts, use `useListing` instead.
 *
 * @example
 *
 * ```jsx
 * import { useDirectListing, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * // The listing id you want to check
 * const listingId = "{{listing_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: directListing,
 *     isLoading,
 *     error,
 *   } = useDirectListing(contract, listingId);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param listingId - The ID of the listing to get. If the listing is not found (or is not a direct listing), the `error` property will be set in the return value of the hook.
 * @returns
 * The hook's data property, once loaded, is a `DirectListingV3` object, containing the following properties:
 *
 * ```ts
 * {
 *   // The id of the listing.
 *   id: string;
 *   // The address of the creator of listing.
 *   creatorAddress: string;
 *   // The address of the asset being listed.
 *   assetContractAddress: string;
 *   // The ID of the token to list.
 *   tokenId: string;
 *   // The quantity of tokens to include in the listing.
 *   // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: string;
 *   // The address of the currency to accept for the listing.
 *   currencyContractAddress: string;
 *   // The `CurrencyValue` of the listing. Useful for displaying the price information.
 *   currencyValuePerToken: CurrencyValue;
 *   // The price to pay per unit of NFTs listed.
 *   pricePerToken: string;
 *   // The asset being listed.
 *   asset: NFTMetadata;
 *   // The start time of the listing.
 *   startTimeInSeconds: number;
 *   // The end time of the listing.
 *   endTimeInSeconds: number;
 *   // Whether the listing is reserved to be bought from a specific set of buyers.
 *   isReservedListing: boolean;
 *   // Whether the listing is CREATED, COMPLETED, or CANCELLED.
 *   status: Status;
 * }
 * ```
 * @twfeature DirectListings
 * @marketplace
 */
export function useDirectListing(
  contract: RequiredParam<MarketplaceV3>,
  listingId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.directListings.getListing(
      contractAddress,
      listingId,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");
      return contract.directListings.getListing(listingId);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook to get an english auction listing from a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace`
 * contracts, use `useListing` instead.
 *
 * @example
 * ```jsx
 * import { useEnglishAuction, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * // The auction id you want to check
 * const listingId = "{{auction_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: englishAuction,
 *     isLoading,
 *     error,
 *   } = useEnglishAuction(contract, listingId);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param auctionId -
 * the auction id to check.  If the listing with this ID cannot be found (or is not an auction), the `error` property will be set.
 *
 * @returns
 * The hook's `data` property, once loaded, will be an `EnglishAuction` object, containing the following properties:
 *
 * ```ts
 * {
 *   // The id of the auction
 *   id: string;
 *   // The address of the creator of auction.
 *   creatorAddress: string;
 *   // The address of the asset being auctioned.
 *   assetContractAddress: string;
 *   // The ID of the token to auction.
 *   tokenId: string;
 *   // The quantity of tokens to include in the auction.
 *   // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: string;
 *   // The address of the currency to accept for the auction.
 *   currencyContractAddress: string;
 *   // The minimum price that a bid must be in order to be accepted.
 *   minimumBidAmount: string;
 *   // The `CurrencyValue` of the minimum bid amount.
 *   // Useful for displaying the price information.
 *   minimumBidCurrencyValue: CurrencyValue;
 *   // The buyout price of the auction.
 *   buyoutBidAmount: string;
 *   // The `CurrencyValue` of the buyout price.
 *   // Useful for displaying the price information.
 *   buyoutCurrencyValue: CurrencyValue;
 *   // This is a buffer e.g. x seconds.
 *   // If a new winning bid is made less than x seconds before expirationTimestamp, the
 *   // expirationTimestamp is increased by x seconds.
 *   timeBufferInSeconds: number;
 *   // This is a buffer in basis points e.g. x%.
 *   // To be considered as a new winning bid, a bid must be at least x% greater than
 *   // the current winning bid.
 *   bidBufferBps: number;
 *   // The start time of the auction.
 *   startTimeInSeconds: number;
 *   // The end time of the auction.
 *   endTimeInSeconds: number;
 *   // The asset being auctioned.
 *   asset: NFTMetadata;
 *   // Whether the listing is CREATED, COMPLETED, or CANCELLED.
 *   status: Status;
 * }
 * ```
 *
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useEnglishAuction(
  contract: RequiredParam<MarketplaceV3>,
  auctionId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.englishAuctions.getAuction(
      contractAddress,
      auctionId,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(auctionId, "No auction id provided");
      return contract.englishAuctions.getAuction(auctionId);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook for getting all listings (including expired ones) from a `Marketplace` contract.
 *
 * Note: this hook is only available for `Marketplace` contracts.
 *
 * If you are using [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3),
 * use `useDirectListings` or `useEnglishAuctions` instead.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useListings } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data, isLoading, error } = useListings(contract);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace contract
 *
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * ```jsx
 * import { useContract, useListings } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data, isLoading, error } = useListings(
 *     contract,
 *     // highlight-start
 *     {
 *       count: 100, // number of listings to fetch
 *       offeror: "{{offeror_address}}", // only show listings with offers from this address
 *       seller: "{{seller_address}}", // only show listings where this address is the seller
 *       start: 0, // start at this listing index (pagination)
 *       tokenContract: "{{token_contract_address}}", // only show listings from this collection
 *       tokenId: "{{token_id}}", // only show listings for this token
 *     },
 *     // highlight-end
 *   );
 * }
 * ```
 *
 * @returns a response object that includes an array of listings
 *
 * The hook's `data` property, once loaded, is an array of listing objects.
 *
 * The exact shape of each object depends on the type of listing.
 *
 * For auctions, it will be a
 * `AuctionListing` object.
 * For direct listings, it will be a `DirectListing` object.
 *
 * ```ts
 * (AuctionListing | DirectListing)[] | undefined;
 * ```
 *
 * You can use the shared `type` property to determine which type of listing is being returned.
 *
 * ```ts
 * interface AuctionListing {
 *
 *    // The id of the listing
 *   id: string;
 *
 *    // The address of the asset being listed.
 *   assetContractAddress: string;
 *
 *    // The ID of the token to list.
 *   tokenId: BigNumberish;
 *
 *    // The asset being listed.
 *   asset: NFTMetadata;
 *
 *    // The start time of the listing.
 *   startTimeInEpochSeconds: BigNumberish;
 *
 *    // Number of seconds until the auction expires.
 *   endTimeInEpochSeconds: BigNumberish;
 *
 *    // The quantity of tokens to include in the listing.
 *    // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: BigNumberish;
 *
 *    // The address of the currency to accept for the listing.
 *   currencyContractAddress: string;
 *
 *    // The reserve price is the minimum price that a bid must be in order to be accepted.
 *   reservePrice: BigNumber;
 *
 *    // The buyout price of the listing.
 *   buyoutPrice: BigNumber;
 *
 *    // The `CurrencyValue` of the buyout price listing.
 *    // Useful for displaying the price information.
 *   buyoutCurrencyValuePerToken: CurrencyValue;
 *
 *    // The `CurrencyValue` of the reserve price.
 *    // Useful for displaying the price information.
 *   reservePriceCurrencyValuePerToken: CurrencyValue;
 *
 *    // The address of the seller.
 *   sellerAddress: string;
 *
 *   // type of listing
 *   type: ListingType.Auction;
 * }
 *
 * interface DirectListing {
 *
 *    // The id of the listing.
 *   id: string;
 *
 *    // The address of the asset being listed.
 *   assetContractAddress: string;
 *
 *    // The ID of the token to list.
 *   tokenId: BigNumberish;
 *
 *    // The asset being listed.
 *   asset: NFTMetadata;
 *
 *    // The start time of the listing.
 *   startTimeInSeconds: BigNumberish;
 *
 *    // Number of seconds until the listing expires.
 *   secondsUntilEnd: BigNumberish;
 *
 *    // The quantity of tokens to include in the listing.
 *    // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: BigNumberish;
 *
 *    // The address of the currency to accept for the listing.
 *   currencyContractAddress: string;
 *
 *    // The `CurrencyValue` of the listing. Useful for displaying the price information.
 *   buyoutCurrencyValuePerToken: CurrencyValue;
 *
 *    // The buyout price of the listing.
 *   buyoutPrice: BigNumber;
 *
 *    // The address of the seller.
 *   sellerAddress: string;
 *
 *   // type of listing
 *   type: ListingType.Direct;
 * ```
 *
 * @marketplace
 */
export function useListings(
  contract: RequiredParam<Marketplace>,
  filter?: MarketplaceFilter,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.getAllListings(contractAddress, filter),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.getAllListings(filter);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook to get all the direct listings from a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace`
 * contracts, use `useListings` instead.
 *
 * @example
 *
 * ```jsx
 * import { useDirectListings, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: directListings,
 *     isLoading,
 *     error,
 *   } = useDirectListings(contract);
 * }
 * ```
 *
 *
 * @param contract - an instance of a marketplace v3 contract
 *
 * @param filter -
 * filter to pass to the query for the sake of pagination & filtering
 * ```tsx
 * import { useDirectListings, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: directListings,
 *     isLoading,
 *     error,
 *   } = useDirectListings(
 *     contract,
 *     {
 *       count: 100, // Number of listings to fetch
 *       offeror: "{{offeror_address}}", // Has offers from this address
 *       seller: "{{seller_address}}", // Being sold by this address
 *       start: 0, // Start from this index (pagination)
 *       tokenContract: "{{token_contract_address}}", // Only show listings for NFTs from this collection
 *       tokenId: "{{token_id}}", // Only show listings with this NFT ID
 *     },
 *   );
 * }
 * ```
 *
 * @returns
 * The hook's data property, once loaded, is a `DirectListingV3` object, containing the following properties:
 *
 * ```ts
 * {
 *   // The id of the listing.
 *   id: string;
 *   // The address of the creator of listing.
 *   creatorAddress: string;
 *   // The address of the asset being listed.
 *   assetContractAddress: string;
 *   // The ID of the token to list.
 *   tokenId: string;
 *   // The quantity of tokens to include in the listing.
 *   // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: string;
 *   // The address of the currency to accept for the listing.
 *   currencyContractAddress: string;
 *   // The `CurrencyValue` of the listing. Useful for displaying the price information.
 *   currencyValuePerToken: CurrencyValue;
 *   // The price to pay per unit of NFTs listed.
 *   pricePerToken: string;
 *   // The asset being listed.
 *   asset: NFTMetadata;
 *   // The start time of the listing.
 *   startTimeInSeconds: number;
 *   // The end time of the listing.
 *   endTimeInSeconds: number;
 *   // Whether the listing is reserved to be bought from a specific set of buyers.
 *   isReservedListing: boolean;
 *   // Whether the listing is CREATED, COMPLETED, or CANCELLED.
 *   status: Status;
 * }
 * ```
 *
 * @twfeature DirectListings
 * @marketplace
 */
export function useDirectListings(
  contract: RequiredParam<MarketplaceV3>,
  filter?: MarketplaceFilter,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.directListings.getAll(
      contractAddress,
      filter,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.directListings.getAll(filter);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook to get a list of valid direct listings from a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * A listing is considered valid if the:
 *
 * - Seller still owns the NFT
 * - Listing has not expired (time is before `endTimeInSeconds`)
 * - Listing has not been canceled
 * - Listing has not been bought out (all `quantity` of the NFTs have not been purchased)
 *
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace` contracts, use `useActiveListings` instead.
 *
 * @example
 *
 *
 * ```jsx
 * import { useValidDirectListings, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: directListings,
 *     isLoading,
 *     error,
 *   } = useValidDirectListings(contract);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 *
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * ```jsx
 * import { useValidDirectListings, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: directListings,
 *     isLoading,
 *     error,
 *   } = useValidDirectListings(
 *     contract,
 *     // highlight-start
 *     {
 *       count: 100, // Number of listings to fetch
 *       offeror: "{{offeror_address}}", // Has offers from this address
 *       seller: "{{seller_address}}", // Being sold by this address
 *       start: 0, // Start from this index (pagination)
 *       tokenContract: "{{token_contract_address}}", // Only show NFTs from this collection
 *       tokenId: "{{token_id}}", // Only show NFTs with this token ID
 *     },
 *     // highlight-end
 *   );
 * }
 * ```
 *
 * @returns
 * The hook's `data` property, once loaded, is an array of `DirectListingV3` objects, each containing the following properties:
 *
 * ```ts
 * Array<{
 *   // The id of the listing.
 *   id: string;
 *
 *   // The address of the creator of listing.
 *   creatorAddress: string;
 *
 *   // The address of the asset being listed.
 *   assetContractAddress: string;
 *
 *   // The ID of the token to list.
 *   tokenId: string;
 *
 *   // The quantity of tokens to include in the listing.
 *   // For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: string;
 *
 *   // The address of the currency to accept for the listing.
 *   currencyContractAddress: string;
 *
 *   // The `CurrencyValue` of the listing. Useful for displaying the price information.
 *   currencyValuePerToken: CurrencyValue;
 *
 *   // The price to pay per unit of NFTs listed.
 *   pricePerToken: string;
 *
 *   // The asset being listed.
 *   asset: NFTMetadata;
 *
 *   // The start time of the listing.
 *   startTimeInSeconds: number;
 *
 *   // The end time of the listing.
 *   endTimeInSeconds: number;
 *
 *   // Whether the listing is reserved to be bought from a specific set of buyers.
 *   isReservedListing: boolean;
 *
 *   // Whether the listing is CREATED, COMPLETED, or CANCELLED.
 *   status: Status;
 * }>;
 * ```
 *
 * @twfeature DirectListings
 * @marketplace
 */
export function useValidDirectListings(
  contract: RequiredParam<MarketplaceV3>,
  filter?: MarketplaceFilter,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.directListings.getAllValid(
      contractAddress,
      filter,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.directListings.getAllValid(filter);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook to get a list of all English auctions from a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace` contracts, use `useListings` instead.
 *
 * @example
 *
 * ```jsx
 * import { useEnglishAuctions, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: englishAuctions,
 *     isLoading,
 *     error,
 *   } = useEnglishAuctions(contract);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 *
 * @param filter -
 * filter to pass to the query for the sake of pagination & filtering
 *
 * ```ts
 * import { useEnglishAuctions, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: englishAuctions,
 *     isLoading,
 *     error,
 *   } = useEnglishAuctions(
 *     contract,
 *     {
 *       count: 100, // Number of auctions to fetch
 *       offeror: "{{offeror_address}}", // Has offers from this address
 *       seller: "{{seller_address}}", // Being sold by this address
 *       start: 0, // Start from this index (pagination)
 *       tokenContract: "{{token_contract_address}}", // Only show NFTs from this collection
 *       tokenId: "{{token_id}}", // Only show NFTs with this ID
 *     },
 *   );
 * }
 * ```
 *
 * @returns
 * The hook's data property, once loaded, is an array of EnglishAuction objects, each containing the following properties:
 *
 * ```ts
 * Array<{
 *   // The id of the auction
 *   id: string;
 *
 *   // The address of the creator of auction.
 *   creatorAddress: string;
 *
 *   // The address of the asset being auctioned.
 *   assetContractAddress: string;
 *
 *   // The ID of the token to auction.
 *   tokenId: string;
 *
 *   // The quantity of tokens to include in the auction.
 *   //  For ERC721s, this value should always be 1 (and will be forced internally regardless of what is passed here).
 *   quantity: string;
 *
 *   // The address of the currency to accept for the auction.
 *   currencyContractAddress: string;
 *
 *   // The minimum price that a bid must be in order to be accepted.
 *   minimumBidAmount: string;
 *
 *   // The `CurrencyValue` of the minimum bid amount.
 *   // Useful for displaying the price information.
 *   minimumBidCurrencyValue: CurrencyValue;
 *
 *   // The buyout price of the auction.
 *   buyoutBidAmount: string;
 *
 *   // The `CurrencyValue` of the buyout price.
 *   // Useful for displaying the price information.
 *   buyoutCurrencyValue: CurrencyValue;
 *
 *   // This is a buffer e.g. x seconds.
 *   // If a new winning bid is made less than x seconds before expirationTimestamp, the
 *   // expirationTimestamp is increased by x seconds.
 *   timeBufferInSeconds: number;
 *
 *   // This is a buffer in basis points e.g. x%.
 *   // To be considered as a new winning bid, a bid must be at least x% greater than
 *   // the current winning bid.
 *   bidBufferBps: number;
 *
 *   // The start time of the auction.
 *   startTimeInSeconds: number;
 *
 *   // The end time of the auction.
 *   endTimeInSeconds: number;
 *
 *   // The asset being auctioned.
 *   asset: NFTMetadata;
 *
 *   // Whether the listing is CREATED, COMPLETED, or CANCELLED.
 *   status: Status;
 * }>;
 * ```
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useEnglishAuctions(
  contract: RequiredParam<MarketplaceV3>,
  filter?: MarketplaceFilter,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.englishAuctions.getAll(
      contractAddress,
      filter,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.englishAuctions.getAll(filter);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Get all valid english auctions
 *
 * @example
 * ```javascript
 * const { data: validEnglishAuctions, isLoading, error } = useValidEnglishAuctions(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of english auctions
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useValidEnglishAuctions(
  contract: RequiredParam<MarketplaceV3>,
  filter?: MarketplaceFilter,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.englishAuctions.getAllValid(
      contractAddress,
      filter,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.englishAuctions.getAllValid(filter);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook for getting the total number of listings on a `Marketplace` contract.
 *
 * Note: this hook is only available for `Marketplace` contracts.
 *
 * If you are using [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3),
 * use `useDirectListingsCount` or `useEnglishAuctionsCount` instead.
 *
 * @example
 *
 *
 * ```jsx
 * import { useContract, useListingsCount } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data: listingsCount, isLoading, error } = useListingsCount(contract);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace contract
 *
 * @returns
 * The hook's `data` property, once loaded, is a `BigNumber` containing the total number of listings on the contract.
 *
 * @marketplace
 */
export function useListingsCount(contract: RequiredParam<Marketplace>) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.getTotalCount(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.getTotalCount();
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * Hook to get the total number of direct listings on a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace`
 * contracts, use `useListingsCount` instead.
 *
 * @example
 *
 * ```jsx
 * import { useDirectListingsCount, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: listingsCount,
 *     isLoading,
 *     error,
 *   } = useDirectListingsCount(contract);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 *
 * @returns
 * The hook's `data` property, once loaded, is a `BigNumber` containing the number of direct listings on the Marketplace V3 contract.
 *
 * @twfeature DirectListings
 * @marketplace
 */
export function useDirectListingsCount(contract: RequiredParam<MarketplaceV3>) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.directListings.getTotalCount(
      contractAddress,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.directListings.getTotalCount();
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * Hook to get the total number of direct listings on a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace`
 * contracts, use `useListingsCount` instead.
 *
 * @example
 *
 * ```jsx
 * import { useEnglishAuctionsCount, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: englishAuctionsCount,
 *     isLoading,
 *     error,
 *   } = useEnglishAuctionsCount(contract);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 *
 * @returns
 * The hook's `data` property, once loaded, is a `BigNumber` representing the number of direct listings on the Marketplace V3 contract.
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useEnglishAuctionsCount(
  contract: RequiredParam<MarketplaceV3>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.englishAuctions.getTotalCount(
      contractAddress,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.englishAuctions.getTotalCount();
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * Hook for fetching all active listings from a `Marketplace` contract.
 *
 * **Note: This hook is only for Marketplace contracts. For Marketplace V3 contracts, use `useValidDirectListings` or `useValidEnglishAuctions` instead.**
 *
 *
 * @example
 * ```javascript
 * import { useActiveListings, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data, isLoading, error } = useActiveListings(contract);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param filter -
 * By default, the hook returns all active listings from the marketplace.
 *
 * You can filter the results by providing a filter object as the second argument for the sake of pagination & filtering
 *
 * ```tsx
 * import { useActiveListings, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *
 *   const { data, isLoading, error } = useActiveListings(
 *     contract,
 *     {
 *       seller: "{{wallet_address}}", // Filter by seller
 *       tokenContract: "{{contract_address}}", // Filter by token contract
 *       offeror: "{{wallet_address}}", // Filter by offeror
 *       tokenId: "{{token_id}}", // Filter by token ID
 *       count: 10, // Limit the number of results
 *       start: 0, // Start from the nth result (useful for pagination)
 *     },
 *   );
 * }
 * ```
 *
 * @returns a response object that includes an array of listings.
 * The hook's `data` property, once loaded, returns an array containing both `AuctionListing` and `DirectListing` objects.
 * Use the `type` property to determine which type of listing each one is.
 *
 * #### AuctionListing
 *
 * ```ts
 * {
 *     // The id of the listing
 *     id: string;
 *
 *     // The address of the asset being listed.
 *     assetContractAddress: string;
 *
 *     // The ID of the token to list.
 *     tokenId: BigNumberish;
 *
 *     // The asset being listed.
 *     asset: NFTMetadata;
 *
 *     // The start time of the listing.
 *     startTimeInEpochSeconds: BigNumberish;
 *
 *     // Number of seconds until the auction expires.
 *     endTimeInEpochSeconds: BigNumberish;
 *
 *     // The quantity of tokens in the listing.
 *     // For ERC721s, this value should always be 1
 *     quantity: BigNumberish;
 *
 *     // The address of the currency to accept for the listing.
 *     currencyContractAddress: string;
 *
 *     // The reserve price is the minimum price that a bid must be in order to be accepted.
 *     reservePrice: BigNumber;
 *
 *     // The buyout price of the listing.
 *     buyoutPrice: BigNumber;
 *
 *     // The `CurrencyValue` of the buyout price listing.
 *     // Useful for displaying the price information.
 *     buyoutCurrencyValuePerToken: CurrencyValue;
 *
 *     // The `CurrencyValue` of the reserve price.
 *     // Useful for displaying the price information.
 *     reservePriceCurrencyValuePerToken: CurrencyValue;
 *
 *     // The address of the seller.
 *     sellerAddress: string;
 *
 *     // Listing type Enum
 *     type: ListingType.Auction;
 * }
 * ```
 *
 * ### DirectListing
 *
 * ```ts
 * {
 *     // The id of the listing.
 *     id: string;
 *
 *     //The address of the asset being listed.
 *     assetContractAddress: string;
 *
 *     // The ID of the token to list.
 *     tokenId: BigNumberish;
 *
 *     //The asset being listed.
 *     asset: NFTMetadata;
 *
 *     //The start time of the listing.
 *     startTimeInSeconds: BigNumberish;
 *
 *     //Number of seconds until the listing expires.
 *     secondsUntilEnd: BigNumberish;
 *
 *     // The quantity of tokens to include in the listing.
 *     // For ERC721s, this value should always be 1
 *     quantity: BigNumberish;
 *
 *     // The address of the currency to accept for the listing.
 *     currencyContractAddress: string;
 *
 *     // The `CurrencyValue` of the listing. Useful for displaying the price information.
 *     buyoutCurrencyValuePerToken: CurrencyValue;
 *
 *     // The buyout price of the listing.
 *     buyoutPrice: BigNumber;
 *
 *     // The address of the seller.
 *     sellerAddress: string;
 *
 *     // Listing type Enum
 *     type: ListingType.Direct;
 * }
 * ```
 *
 * @marketplace
 */
export function useActiveListings(
  contract: RequiredParam<Marketplace>,
  filter?: MarketplaceFilter,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.getActiveListings(contractAddress, filter),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      return contract.getActiveListings(filter);
    },
    {
      enabled: !!contract,
      keepPreviousData: true,
    },
  );
}

/**
 * Hook for getting the winning bid of an auction listing on a `Marketplace` contract.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useWinningBid } from "@thirdweb-dev/react";
 *
 * // Your marketplace contract address
 * const contractAddress = "{{contract_address}}";
 * // The listing ID to check
 * const listingId = "{{listing_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data, isLoading, error } = useWinningBid(contract, listingId);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace contract
 *
 * @param listingId -
 * The ID of the listing to get the winning bid for.
 * If the listing cannot be found, is not an auction listing, or is not active, the `error` property will be set.
 *
 * @returns a response object that includes the `Offer` that is winning the auction
 * @marketplace
 */
export function useWinningBid(
  contract: RequiredParam<Marketplace>,
  listingId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.auction.getWinningBid(
      contractAddress,
      listingId,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");
      invariant(
        contract.auction.getWinningBid,
        "contract does not support auction.getWinningBid",
      );
      return contract.auction.getWinningBid(listingId);
    },
    {
      enabled: !!contract && listingId !== undefined,
    },
  );
}

/**
 * Hook to get the winning bid for an English auction listing from a
 * [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * @example
 * ```jsx
 * import { useEnglishAuctionWinningBid, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * // The id of the auction listing you want to check
 * const listingId = "{{auction_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     data: winningBid,
 *     isLoading,
 *     error,
 *   } = useEnglishAuctionWinningBid(contract, listingId);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace contract
 *
 * @param auctionId - the auction id to check
 * If the listing cannot be found, or is not an English auction, the `error` property will be set.
 *
 * @returns a response object that includes the `Bid` that is winning the auction
 * If there are no bids, the `data` property will be `undefined`. Use the `isLoading` property to differentiate between
 * the loading state and the no bids state.
 *
 * If there is a bid, the hook's `data` property, once loaded, will be an object of type `Bid`, containing the following properties:
 *
 * ```ts
 * {
 *   // The id of the auction.
 *   auctionId: string;
 *   // The address of the buyer who made the offer.
 *   bidderAddress: string;
 *   // The currency contract address of the offer token.
 *   currencyContractAddress: string;
 *   // The amount of coins offered per token.
 *   bidAmount: string;
 *   // The `CurrencyValue` of the listing. Useful for displaying the price information.
 *   bidAmountCurrencyValue: {
 *     symbol: string;
 *     value: BigNumber;
 *     name: string;
 *     decimals: number;
 *     displayValue: string;
 *   }
 * }
 * ```
 *
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useEnglishAuctionWinningBid(
  contract: RequiredParam<MarketplaceV3>,
  auctionId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.englishAuctions.getWinningBid(
      contractAddress,
      auctionId,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(auctionId, "No auction id provided");
      invariant(
        contract.englishAuctions.getWinningBid,
        "contract does not support englishAuctions.getWinningBid",
      );
      return contract.englishAuctions.getWinningBid(auctionId);
    },
    {
      enabled: !!contract && auctionId !== undefined,
    },
  );
}

/**
 * Hook for getting the winner of an auction (or english auction) on a `Marketplace` or [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * @example
 * ```javascript
 * import { useAuctionWinner, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 * const listingId = "{{listing_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data, isLoading, error } = useAuctionWinner(
 *     contract,
 *     listingId, // The listing id of the item that you want to get the auction winner for
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a marketplace contract
 *
 * @param listingId - The listing ID of the item that you want to get the auction winner for.
 * The listing must be an auction (or english auction) listing, the hook will populate the error property if it is not.
 *
 * @returns
 * The hook's data property, once loaded, contains a `string` representing the address of the auction winner, or undefined if there is no winner.
 *
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useAuctionWinner(
  contract: RequiredParam<Marketplace | MarketplaceV3>,
  listingId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.auction.getWinner(
      contractAddress,
      listingId,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");

      const isV1 = isMarketplaceV1(contract);

      if (isV1) {
        invariant(
          contract.auction.getWinner,
          "contract does not support auction.getWinner",
        );
        return contract.auction.getWinner(listingId);
      } else if (!isV1) {
        invariant(
          contract.englishAuctions.getWinner,
          "contract does not support englishAuctions.getWinner",
        );
        return contract.englishAuctions.getWinner(listingId);
      }
      invariant(false, "Contract is not a valid marketplace contract");
    },
    {
      enabled: !!contract && listingId !== undefined,
    },
  );
}

/**
 * Hook for determining the current bid buffer on a `Marketplace` or [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * The bid buffer is what percentage higher the next bid must be than the current highest bid, or the starting price if there are no bids.
 *
 * @example
 * ```javascript
 * import { useBidBuffer, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 * // Listing ID to get the bid buffer for
 * const listingId = 1;
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const {
 *     data: bidBuffer,
 *     isLoading,
 *     error,
 *   } = useBidBuffer(contract, listingId);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 *
 * @param listingId - The listing ID of the item that you want to get the bid buffer for.
 * The listing must be an auction (or english auction) listing, the hook will populate the `error` property if it is not.
 *
 * @returns
 * The hook's data property, once loaded, returns a BigNumber value representing the current bid buffer.
 *
 * The `bidBuffer` value returned is in percentage format. For example, a value of `500` means that the next bid must be 5% higher than the current highest bid.
 *
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useBidBuffer(
  contract: RequiredParam<Marketplace | MarketplaceV3>,
  listingId?: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.auction.getBidBufferBps(
      contractAddress,
      listingId,
    ),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");

      const isV1 = isMarketplaceV1(contract);

      if (isV1) {
        invariant(
          contract.getBidBufferBps,
          "contract does not support getBidBufferBps",
        );
        return contract.getBidBufferBps();
      } else if (!isV1) {
        invariant(
          contract.englishAuctions.getBidBufferBps,
          "contract does not support englishAuctions.getBidBufferBps",
        );
        requiredParamInvariant(listingId, "No listing id provided");
        return BigNumber.from(
          contract.englishAuctions.getBidBufferBps(listingId),
        );
      }
      invariant(false, "Contract is not a valid marketplace contract");
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * Hook for getting the minimum value a bid must be to be valid
 * in an auction listing on a `Marketplace` or
 * [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * Takes into account the current highest bid, or the reserve price if there is no bid,
 * and increments it by the bid buffer to calculate the minimum next bid.
 *
 * @example
 *
 * ```jsx
 * import { useContract, useMinimumNextBid } from "@thirdweb-dev/react";
 *
 * const contractAddress = "{{contract_address}}";
 * const listingId = "{{listing_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data, isLoading, error } = useMinimumNextBid(contract, listingId);
 * }
 * ```
 *
 * @param contract - an instance of a marketplace contract
 *
 * @param listingId -
 * The ID of the listing to get the minimum next bid for.
 *
 * If the listing cannot be found, is not an auction listing, or is not active, the `error` property will be set.
 *
 *
 * @returns a response object that includes the minimum next bid for the auction listing
 * @twfeature EnglishAucton
 * @marketplace
 */
export function useMinimumNextBid(
  contract: RequiredParam<Marketplace | MarketplaceV3>,
  listingId: RequiredParam<BigNumberish>,
): UseQueryResult<
  {
    symbol: string;
    value: BigNumber;
    name: string;
    decimals: number;
    displayValue: string;
  },
  unknown
> {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.auction.getMinimumNextBid(
      contractAddress,
      listingId,
    ),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");

      const isV1 = isMarketplaceV1(contract);

      if (isV1) {
        invariant(
          contract.auction.getMinimumNextBid,
          "contract does not support auction.getMinimumNextBid",
        );
        return contract.auction.getMinimumNextBid(listingId);
      } else if (!isV1) {
        invariant(
          contract.englishAuctions.getMinimumNextBid,
          "contract does not support englishAuctions.getMinimumNextBid",
        );
        return contract.englishAuctions.getMinimumNextBid(listingId);
      }
      invariant(false, "Contract is not a valid marketplace contract");
    },
    {
      enabled: !!contract && listingId !== undefined,
    },
  );
}

/**
 * Hook for getting all of the offers made on a
 * direct listing on a `Marketplace` contract.
 *
 * @example
 *
 * ```jsx
 * import { useOffers, useContract } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * // The listing ID you want to fetch offers for
 * const listingId = "{{listing_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { data: offers, isLoading, error } = useOffers(contract, listingId);
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 *
 * @param listingId - the id of the listing to fetch offers for
 * If the listing cannot be found, is not a direct listing, or is not active, the `error` property will be set.
 *
 * @returns
 * This hook uses the `useEvents` hook under the hood to fetch `NewOffer` events for the given listing ID.
 *
 * The return value is an array of `NewOffer` event objects. Each event object has the following properties:
 *
 * ```ts
 * {
 *   offeror: string;
 *   offerId: BigNumber;
 *   assetContract: string;
 *   offer: {
 *     offerId: BigNumber;
 *     offeror: string;
 *     assetContract: string;
 *     tokenId: BigNumber;
 *     quantity: BigNumber;
 *     currency: string;
 *     totalPrice: BigNumber;
 *     expirationTimestamp: BigNumber;
 *     tokenType: "ERC721" | "ERC1155";
 *     status: "UNSET" | "CREATED" | "COMPLETED" | "CANCELLED";
 *   }
 * }
 * ```
 *
 * @marketplace
 */
export function useOffers(
  contract: RequiredParam<Marketplace>,
  listingId: RequiredParam<BigNumberish>,
) {
  const result = useContractEvents(contract, "NewOffer");
  return {
    ...result,
    data: result.data
      ?.filter((ev) => ev.data.listingId.eq(listingId))
      ?.map((ev) => ev.data),
  };
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Hook for creating a new direct listing on a `Marketplace`
 * or [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) smart contract.
 *
 * Direct listings require the user to approve the marketplace to transfer the NFTs on their behalf as part of the listing creation process.
 * This is because the marketplace needs permission to execute sales and transfer the NFTs to the buyer when a sale is made.
 *
 * @example
 * ```jsx
 * import {
 *   useCreateDirectListing,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     mutateAsync: createDirectListing,
 *     isLoading,
 *     error,
 *   } = useCreateDirectListing(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         createDirectListing({
 *           assetContractAddress: "{{asset_contract_address}}",
 *           tokenId: "{{token_id}}",
 *           pricePerToken: "{{price_per_token}}",
 *           currencyContractAddress: "{{currency_contract_address}}",
 *           isReservedListing: false,
 *           quantity: "{{quantity}}",
 *           startTimestamp: new Date(),
 *           endTimestamp: new Date(
 *             new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
 *           ),
 *         })
 *       }
 *     >
 *       Create Direct Listing
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 *
 * @returns a mutation object that can be used to create a new direct listing
 * #### assetContractAddress (required)
 *
 * The address of the NFT smart contract that you want to list.
 *
 *
 * #### tokenId (required)
 *
 * The token ID of the NFT that you want to list.
 *
 *
 * #### pricePerToken (required)
 *
 * The price to **buy** each token in the listing.
 *
 * - For ERC721 NFTs, this is the price to buy the NFT outright.
 * - For ERC1155 NFTs, this is the price to `1` quantity of the NFT.
 *
 *
 * #### currencyContractAddress (optional)
 *
 * The address of the currency you want users to pay with and make bids in.
 *
 * You likely want to use the token native to the chain you are on, e.g. Ether on Ethereum.
 *
 * To do that, you can import the `NATIVE_TOKEN_ADDRESS` constant from `@thirdweb-dev/sdk`.
 *
 * The default value is `NATIVE_TOKEN_ADDRESS`.
 *
 *
 * #### isReservedListing (optional)
 *
 * When set to true, the seller must explicitly approve which wallet addresses can buy the NFT.
 *
 *
 *
 * #### quantity (optional)
 *
 * How many tokens to include in the listing.
 *
 * - For ERC721 NFTs, this is always `1`.
 * - For ERC1155 NFTs, this is the quantity of tokens to include in the listing.
 *
 *
 * #### startTimestamp (optional)
 *
 * A `Date` object for the start time of the listing.
 *
 * The default value is `new Date()`, which is the current time.
 *
 *
 * #### endTimestamp (optional)
 *
 * A `Date` object for the end time of the listing (when the listing will expire).
 * @twfeature DirectListings
 * @marketplace
 */
export function useCreateDirectListing<
  TMarketplace extends Marketplace | MarketplaceV3,
>(contract: RequiredParam<TMarketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (
      data: TMarketplace extends Marketplace
        ? NewDirectListing
        : DirectListingInputParams,
    ) => {
      invariant(walletAddress, "No wallet connected, cannot create listing");
      requiredParamInvariant(contract, "No Contract instance provided");

      const isV1 = isMarketplaceV1(contract);

      if (isV1) {
        invariant(
          contract.direct.createListing,
          "contract does not support direct.createListing",
        );
        return await contract.direct.createListing(data as NewDirectListing);
      } else if (!isV1) {
        invariant(
          contract.directListings.createListing,
          "contract does not support directListings.createListing",
        );
        return await contract.directListings.createListing(
          data as DirectListingInputParams,
        );
      }
      invariant(false, "Contract is not a valid marketplace contract");
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for creating an auction listing on a `Marketplace` or
 * [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) smart contract.
 *
 * Auction listings hold the NFTs in escrow; requiring the seller to transfer the NFTs to the marketplace contract
 * as part of the listing creation process.
 *
 * Provide your `Marketplace`
 * or
 * [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3)
 * contract as the argument to the hook.
 *
 * Then, provide the information about the listing you want to create as the argument to the mutation.
 *
 * @example
 * ```jsx
 * import {
 *   useCreateAuctionListing,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 * import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     mutateAsync: createAuctionListing,
 *     isLoading,
 *     error,
 *   } = useCreateAuctionListing(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         createAuctionListing({
 *           tokenId: "{{token_id}}", // The ID of the token to list.
 *           assetContractAddress: "{{asset_contract_address}}", // The contract address of the asset being listed.
 *           currencyContractAddress: NATIVE_TOKEN_ADDRESS, // The address of the currency to accept for the listing.
 *           quantity: "{{quantity}}",
 *           startTimestamp: new Date(),
 *           buyoutBidAmount: "{{buyout_bid_amount}}",
 *           minimumBidAmount: "{{minimum_bid_amount}}",
 *           endTimestamp: new Date(),
 *           bidBufferBps: "{{bid_buffer_bps}}",
 *           timeBufferInSeconds: "{{time_buffer_in_seconds}}",
 *         })
 *       }
 *     >
 *       Create Auction Listing
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns
 * a mutation object that can be used to create a new auction listing.
 * #### tokenId (required)
 *
 * The token ID of the NFT you are listing for auction.
 *
 * #### assetContractAddress (required)
 *
 * The smart contract address of the NFT you are listing for auction.
 *
 * #### buyoutBidAmount (required)
 *
 * The price to **buy** each token in the listing.
 *
 * - For ERC721 NFTs, this is the price to buy the NFT outright.
 * - For ERC1155 NFTs, this is the price to `1` quantity of the NFT.
 *
 * #### currencyContractAddress (optional)
 *
 * The address of the currency you want users to pay with and make bids in.
 *
 * You likely want to use the token native to the chain you are on, e.g. Ether on Ethereum.
 *
 * To do that, you can import the `NATIVE_TOKEN_ADDRESS` constant from `@thirdweb-dev/sdk`.
 *
 * The default value is `NATIVE_TOKEN_ADDRESS`.
 *
 *
 * #### quantity (optional)
 *
 * How many tokens to include in the listing.
 *
 * - For ERC721 NFTs, this is always `1`.
 * - For ERC1155 NFTs, this is the quantity of tokens to include in the listing.
 *
 * The default value is `1`.
 *
 *
 * #### minimumBidAmount (required)
 *
 * The minimum price that a bid must be in order to be placed on the listing, per token.
 *
 * Bids that are lower than the reserve price will be rejected by the contract.
 *
 * The default value is `0`.
 *
 *
 * #### startTimestamp (optional)
 *
 * A `Date` object for the start time of the listing.
 *
 * The default value is `new Date()`, which is the current time.
 *
 *
 * #### endTimestamp (optional)
 *
 * A `Date` object for the end time of the listing (when the listing will expire).
 *
 *
 * #### bidBufferBps (optional)
 *
 * Bid buffer in basis points (1/100th of a percent).
 *
 * The bid buffer is what percentage higher the next bid must be than the current highest bid.
 *
 * For example, if you set a bid buffer of `100`, then the next bid must be at least `1%` higher than the current highest bid.
 *
 *
 * #### timeBufferInSeconds (optional)
 *
 * Time buffer in seconds.
 *
 * The time buffer is how much time is added to the listing when a new bid is placed.
 *
 * This is to prevent users from placing a bid at the last second and winning the auction.
 *
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useCreateAuctionListing<
  TMarketplace extends Marketplace | MarketplaceV3,
>(contract: RequiredParam<TMarketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (
      data: TMarketplace extends Marketplace
        ? NewAuctionListing
        : EnglishAuctionInputParams,
    ) => {
      invariant(walletAddress, "no wallet connected, cannot create listing");
      requiredParamInvariant(contract, "No Contract instance provided");

      const isV1 = isMarketplaceV1(contract);

      if (isV1) {
        invariant(
          contract.auction.createListing,
          "contract does not support auction.createListing",
        );
        return await contract.auction.createListing(data as NewAuctionListing);
      } else if (!isV1) {
        invariant(
          contract.englishAuctions.createAuction,
          "contract does not support englishAuctions.createAuction",
        );
        return await contract.englishAuctions.createAuction(
          data as EnglishAuctionInputParams,
        );
      }
      invariant(false, "Contract is not a valid marketplace contract");
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for canceling an existing auction or listing on a
 * `Marketplace` contract.
 *
 * **Note**: Auction listings cannot be canceled if a bid has been placed.
 *
 * **Note: This hook is only for `Marketplace` contracts.**
 *
 * For [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3)
 * contracts, use `useCancelDirectListing` or `useCancelEnglishAuction` instead.
 *
 * @example
 * ```jsx
 * import { useCancelListing, useContract, Web3Button } from "@thirdweb-dev/react";
 * import { ListingType } from "@thirdweb-dev/sdk";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const {
 *     mutateAsync: cancelListing,
 *     isLoading,
 *     error,
 *   } = useCancelListing(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         cancelListing({
 *           id: "{{listing_id}}",
 *           type: ListingType.Direct, // Direct (0) or Auction (1)
 *         })
 *       }
 *     >
 *       Cancel Listing
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns
 * a mutation object that can be used to cancel a listing. The `error` property is set  if the listing is not active, or was not created by the wallet.
 *
 * #### listingId
 *
 * The ID of the listing you want to cancel.
 *
 * #### listingType
 *
 * The type of listing you are canceling. Either `ListingType.Direct` (0) or `ListingType.Auction` (1).
 *
 * @marketplace
 */
export function useCancelListing(
  contract: RequiredParam<Marketplace>,
): UseMutationResult<
  Omit<
    {
      receipt: providers.TransactionReceipt;
      data: () => Promise<unknown>;
    },
    "data"
  >,
  unknown,
  Pick<AuctionListing | DirectListing, "type" | "id">,
  unknown
> {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: Pick<AuctionListing | DirectListing, "type" | "id">) => {
      invariant(walletAddress, "no wallet connected, cannot create listing");
      requiredParamInvariant(contract, "No Contract instance provided");

      if (data.type === ListingType.Auction) {
        invariant(
          contract.auction.cancelListing,
          "contract does not support auction.cancelListing",
        );
        return await contract.auction.cancelListing(data.id);
      } else {
        invariant(
          contract.direct.cancelListing,
          "contract does not support direct.cancelListing",
        );
        return await contract.direct.cancelListing(data.id);
      }
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for canceling a direct listing on a [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * Direct listings can be canceled at any time, (unless the listing has already been sold).
 * Only the creator of the listing can cancel it.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace`
 * contracts, use `useCancelListing` instead.
 *
 *
 * ```jsx
 * import { useCancelDirectListing } from "@thirdweb-dev/react";
 *
 * const { mutateAsync, isLoading, error } = useCancelDirectListing(contract);
 * ```
 *
 * @example
 * ```jsx
 * import {
 *   useCancelDirectListing,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 * import { ListingType } from "@thirdweb-dev/sdk";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * // The ID of the listing you want to cancel
 * const listingId = "{{listing_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     mutateAsync: cancelDirectListing,
 *     isLoading,
 *     error,
 *   } = useCancelDirectListing(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() => cancelDirectListing(listingId)}
 *     >
 *       Cancel Direct Listing
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace v3 contract
 * @returns a mutation object that can be used to cancel a direct listing by passing the ID of the listing you want to cancel.
 * @twfeature DirectListings
 * @marketplace
 */
export function useCancelDirectListing(contract: RequiredParam<MarketplaceV3>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (listingId: BigNumberish) => {
      invariant(walletAddress, "no wallet connected, cannot create listing");
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");

      invariant(
        contract.directListings.cancelListing,
        "contract does not support directListings.cancelListing",
      );
      return await contract.directListings.cancelListing(listingId);
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for canceling an english auction on a [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract.
 *
 * **Note**: English auctions cannot be canceled if a bid has been placed.
 *
 * **Note: This hook is only for [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contracts.**
 *
 * For `Marketplace`
 * contracts, use `useCancelListing` instead.
 *
 * ```jsx
 * import { useCancelEnglishAuction } from "@thirdweb-dev/react";
 *
 * const { mutateAsync, isLoading, error } = useCancelEnglishAuction(contract);
 * ```
 *
 * @example
 * ```jsx
 * import {
 *   useCancelEnglishAuction,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * // The ID of the listing you want to cancel
 * const listingId = "{{listing_id}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     mutateAsync: cancelEnglishAuction,
 *     isLoading,
 *     error,
 *   } = useCancelEnglishAuction(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() => cancelEnglishAuction(listingId)}
 *     >
 *       Cancel English Auction
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace v3 contract
 * @returns
 * a mutation object that can be used to cancel an english auction by passing the `listingId` of the auction you want to cancel.
 *
 * the `error` property is set if the listing is not active, cannot be canceled, or was not created by the wallet.
 *
 * @twfeature EnglishAuctions
 * @marketplace
 */
export function useCancelEnglishAuction(
  contract: RequiredParam<MarketplaceV3>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (auctionId: BigNumberish) => {
      invariant(walletAddress, "no wallet connected, cannot create listing");
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(auctionId, "No auction id provided");

      invariant(
        contract.englishAuctions.cancelAuction,
        "contract does not support englishAuctions.cancelAuction",
      );
      return await contract.englishAuctions.cancelAuction(auctionId);
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for placing a bid on a `Marketplace` auction listing.
 *
 * Bids have several important properties:
 *
 * - Cannot be canceled once placed.
 * - Are automatically refunded if they are outbid.
 * - Must be higher than the current highest bid by the percentage defined in the bid buffer.
 * - Must be higher than the reserve price (if there is no bid yet).
 *
 * @example
 *
 * ```jsx
 * import { useMakeBid, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { mutateAsync: makeBid, isLoading, error } = useMakeBid(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         makeBid({
 *           listingId: "1", // ID of the listing to bid on. Must be an auction.
 *           bid: "1", // Uses the currencyContractAddress of the listing.
 *         })
 *       }
 *     >
 *       Make Bid
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 *
 * @returns a mutation object that can be used to make a bid on an auction listing
 *
 * #### listingId (required)
 *
 * The ID of the listing to bid on. Must be an auction type listing.
 * (Use `useMakeOffer` for direct listings).
 *
 * If the listing cannot be found, is not an auction, or is not active, the `error` property will be set.
 *
 *
 * #### bid (required)
 *
 * The amount to bid on the listing. Uses the `currencyContractAddress` of the listing.
 *
 * For example, if the listing uses the `NATIVE_TOKEN_ADDRESS` on Ethereum, the bid amount is the amount of ETH to bid. Can be
 * in the form of a number, string, or BigNumber.
 *
 * The bid value **must** be either:
 *
 * - Greater than or equal to the reserve price if there is no current bid.
 * - Greater than the current highest bid by the percentage defined in the bid buffer.
 *
 * Use the `useNextMinimumBid` hook to get the next minimum bid amount required.
 *
 * @marketplace
 */
export function useMakeBid(contract: RequiredParam<Marketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: MakeBidParams) => {
      invariant(walletAddress, "no wallet connected, cannot make bid");
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.auction.makeBid,
        "contract does not support auction.makeBid",
      );
      return await contract.auction.makeBid(data.listingId, data.bid);
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for placing an offer on a `Marketplace` direct listing.
 *
 * @example
 *
 * ```jsx
 * import { useMakeOffer, useContract, Web3Button } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { mutateAsync: makeOffer, isLoading, error } = useMakeOffer(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         makeOffer({
 *           listingId: 1, // ID of the listing to make an offer on
 *           pricePerToken: 1, // Price per token to offer (in the listing's currency)
 *           quantity: 1, // Number of NFTs you want to buy (used for ERC1155 NFTs)
 *         })
 *       }
 *     >
 *       Make Bid
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 *
 * @returns a mutation object that can be used to make a bid on an auction listing
 *
 * #### listingId (required)
 *
 * The ID of the listing to make an offer on.
 *
 * If the listing cannot be found, is not a direct listing, or is not active, the `error` property will be set.
 *
 * #### pricePerToken (required)
 *
 * The price to offer per token.
 *
 * - For ERC1155, this is the price to offer per quantity of the NFT (see [`quantity`](#quantity) below).
 * - For ERC721, this is the price to offer to buy the NFT.
 *
 * #### quantity (optional)
 *
 * Used for ERC1155 NFTs, where multiple quantity of the same NFT can be bought at once.
 *
 * This field works with the `pricePerToken` field to calculate the total price of the offer.
 * For example, if you want to buy 5 NFTs at a price of 1 ETH each, you would set `pricePerToken` to `1` and `quantity` to `5`, for a total of `5` ETH as the offer.
 *
 * For ERC721 NFTs, this value is ignored and `1` is used instead.
 *
 * The default value is `1`.
 *
 * @marketplace
 */
export function useMakeOffer(contract: RequiredParam<Marketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: MakeOfferParams) => {
      invariant(walletAddress, "no wallet connected, cannot make bid");
      requiredParamInvariant(contract, "No Contract instance provided");
      return await contract.makeOffer(
        data.listingId,
        data.pricePerToken,
        data.quantity,
      );
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for accepting an offer from a direct listing on a Marketplace contract.
 *
 * Allows the seller (the user who listed the NFT for sale) to accept an offer on their listing, triggering a sale event, meaning the:
 * - NFT(s) are transferred from the seller to the buyer.
 * - Funds from the offeror are sent to the seller.
 *
 * @example
 * ```tsx
 * import {
 *   useAcceptDirectListingOffer,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const {
 *     mutateAsync: acceptDirectOffer,
 *     isLoading,
 *     error,
 *   } = useAcceptDirectListingOffer(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         acceptDirectOffer({
 *           listingId: "{{listing_id}}",
 *           addressOfOfferor: "{{offeror_address}}",
 *         })
 *       }
 *     >
 *       Accept Offer
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns - Mutation object that can be used to accept an offer on a direct listing
 *
 * @marketplace
 */
export function useAcceptDirectListingOffer(
  contract: RequiredParam<Marketplace>,
) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: AcceptDirectOffer) => {
      invariant(walletAddress, "no wallet connected, cannot make bid");
      requiredParamInvariant(contract?.direct, "No Direct instance provided");
      return await contract.direct.acceptOffer(
        data.listingId,
        data.addressOfOfferor,
      );
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for executing a sale of an auction listing on a `Marketplace` contract.
 *
 * Triggers a new sale, transferring the NFT(s) to the buyer and the funds to the seller.
 *
 * A sale must be executed when an auction ends, and the auction has a winning bid that was below the buyout price. This means the
 * auction has finished, and the highest bidder has won the auction. **Any wallet** can now execute the sale, transferring the NFT(s)
 * to the buyer and the funds to the seller.
 *
 * @example
 *
 *
 * ```jsx
 * import {
 *   useExecuteAuctionSale,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const {
 *     mutateAsync: executeAuctionSale,
 *     isLoading,
 *     error,
 *   } = useExecuteAuctionSale(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         executeAuctionSale({
 *           // The listingId of the auction to execute
 *           listingId: "{{listing_id}}",
 *         })
 *       }
 *     >
 *       Execute Auction Sale
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to accept an offer on a direct listing
 *
 * #### listingId
 *
 * The ID of the auction listing to execute the sale on. If the listing cannot be found, is not an auction, or is not ready to be executed, the `error` property will be set.
 *
 *
 * @marketplace
 */
export function useExecuteAuctionSale(contract: RequiredParam<Marketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: ExecuteAuctionSale) => {
      invariant(walletAddress, "no wallet connected, cannot make bid");
      requiredParamInvariant(
        contract?.auction,
        "No Auction marketplace instance provided",
      );
      return await contract.auction.executeSale(data.listingId);
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for buying a listing on a `Marketplace` smart contract.
 *
 * If the listing is in a currency that is not native to the chain (e.g. not Ether on Ethereum), the hook will prompt the user
 * to approve the marketplace contract to spend the currency on their behalf before performing the buy.
 *
 * **This hook is only for `Marketplace` contracts.**
 *
 * ```jsx
 * import { useBuyNow } from "@thirdweb-dev/react";
 *
 * const { mutateAsync, isLoading, error } = useBuyNow(contract);
 * ```
 *
 *
 * @example
 * ```jsx
 * import { useBuyNow } from "@thirdweb-dev/react";
 *
 * const { mutateAsync, isLoading, error } = useBuyNow(contract);
 * ```
 *
 * ## Usage
 *
 * Provide your marketplace contract as the argument.
 *
 * ```jsx
 * import { useBuyNow, useContract, Web3Button } from "@thirdweb-dev/react";
 * import { ListingType } from "@thirdweb-dev/sdk";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace");
 *   const { mutateAsync: buyNow, isLoading, error } = useBuyNow(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         buyNow({
 *           id: "{{listing_id}}", // ID of the listing to buy
 *           type: ListingType.Direct, // Direct (0) or Auction (1)
 *           buyAmount: "{{buy_amount}}", // Amount to buy
 *           buyForWallet: "{{wallet_address}}", // Wallet to buy for, defaults to current wallet
 *         })
 *       }
 *     >
 *       Buy Now
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to buy out an auction listing
 * @marketplace
 */
export function useBuyNow(contract: RequiredParam<Marketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: BuyNowParams) => {
      invariant(walletAddress, "no wallet connected, cannot make bid");
      requiredParamInvariant(contract, "No Contract instance provided");
      if (data.type === ListingType.Direct) {
        invariant(
          contract.direct.buyoutListing,
          "contract does not support direct.buyoutListing",
        );

        return await contract.direct.buyoutListing(
          data.id,
          data.buyAmount,
          data.buyForWallet,
        );
      }
      invariant(
        contract.auction.buyoutListing,
        "contract does not support auction.buyoutListing",
      );
      return await contract.auction.buyoutListing(data.id);
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

/**
 * Hook for buying a direct listing on a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) smart contract.
 *
 * If the listing is in a currency that is not native to the chain (e.g. not Ether on Ethereum), the hook will prompt the user
 * to approve the marketplace contract to spend the currency on their behalf before performing the buy.
 *
 * ```jsx
 * import { useBuyDirectListing } from "@thirdweb-dev/react";
 *
 * const { mutateAsync, isLoading, error } = useBuyDirectListing(contract);
 * ```
 *
 * @example
 * ```jsx
 * import {
 *   useBuyDirectListing,
 *   useContract,
 *   Web3Button,
 * } from "@thirdweb-dev/react";
 * import { ListingType } from "@thirdweb-dev/sdk";
 *
 * // Your smart contract address
 * const contractAddress = "{{contract_address}}";
 *
 * function App() {
 *   const { contract } = useContract(contractAddress, "marketplace-v3");
 *   const {
 *     mutateAsync: buyDirectListing,
 *     isLoading,
 *     error,
 *   } = useBuyDirectListing(contract);
 *
 *   return (
 *     <Web3Button
 *       contractAddress={contractAddress}
 *       action={() =>
 *         buyDirectListing({
 *           listingId: "{{listing_id}}", // ID of the listing to buy
 *           quantity: "1",
 *           buyer: "{{wallet_address}}", // Wallet to buy for
 *         })
 *       }
 *     >
 *       Buy Now
 *     </Web3Button>
 *   );
 * }
 * ```
 *
 * @param contract - an instance of a MarketplaceV3 contract
 * @returns a mutation object that can be used to buy out a direct listing
 * @marketplace
 */
export function useBuyDirectListing(contract: RequiredParam<MarketplaceV3>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();

  return useMutation(
    async (data: BuyFromListingParams) => {
      invariant(walletAddress, "no wallet connected, cannot buy from listing");
      requiredParamInvariant(contract, "No Contract instance provided");
      invariant(
        contract.directListings.buyFromListing,
        "contract does not support directListings.buyFromListing",
      );

      return await contract.directListings.buyFromListing(
        data.listingId,
        data.quantity,
        data.buyer,
      );
    },
    {
      onSettled: () =>
        invalidateContractAndBalances(
          queryClient,
          contractAddress,
          activeChainId,
        ),
    },
  );
}

function isMarketplaceV1(
  contract: RequiredParam<Marketplace | MarketplaceV3>,
): contract is Marketplace {
  return (contract as Marketplace).getAllListings !== undefined;
}
