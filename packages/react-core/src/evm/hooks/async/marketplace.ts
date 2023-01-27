import {
  RequiredParam,
  requiredParamInvariant,
} from "../../../core/query-utils/required-param";
import { useSDKChainId } from "../../providers/base";
import {
  AcceptDirectOffer,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { BigNumberish } from "ethers";
import invariant from "tiny-invariant";
import { DirectListingInputParams } from "@thirdweb-dev/sdk/dist/declarations/src/evm/schema/marketplacev3/direct-listings";
import { EnglishAuctionInputParams } from "@thirdweb-dev/sdk/dist/declarations/src/evm/schema/marketplacev3/english-auctions";

/** **********************/
/**     READ  HOOKS     **/
/** **********************/

/**
 * Use this to get a specific listing from the marketplace.
 *
 * @example
 * ```javascript
 * const { data: listing, isLoading, error } = useListing(<YourMarketplaceContractInstance>, <listingId>);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the desired listing
 * @beta
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
 * Use this to get a specific direct listing from the marketplace v3.
 *
 * @example
 * ```javascript
 * const { data: directListing, isLoading, error } = useListing(<YourMarketplaceV3ContractInstance>, <listingId>);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the desired direct listing
 * @internal
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
 * Use this to get a specific english auction from the marketplace v3.
 *
 * @example
 * ```javascript
 * const { data: englishAuction, isLoading, error } = useEnglishAuction(<YourMarketplaceV3ContractInstance>, <auctionId>);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param auctionId - the auction id to check
 * @returns a response object that includes the desired english auction
 * @internal
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
 * Use this to get a list all listings from your marketplace contract.
 *
 * @example
 * ```javascript
 * const { data: listings, isLoading, error } = useListings(<YourMarketplaceContractInstance>, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of listings
 * @beta
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
 * Use this to get a list all direct listings from your marketplace v3 contract.
 *
 * @example
 * ```javascript
 * const { data: directListings, isLoading, error } = useDirectListings(<YourMarketplaceV3ContractInstance>, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of direct listings
 * @internal
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
 * Use this to get a list all english auctions from your marketplace v3 contract.
 *
 * @example
 * ```javascript
 * const { data: englishAuctions, isLoading, error } = useEnglishAuctions(<YourMarketplaceV3ContractInstance>, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of english auctions
 * @internal
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
 * Use this to get a count of all listings on your marketplace contract.
 *
 * @example
 * ```javascript
 * const { data: listingsCount, isLoading, error } = useListingsCount(<YourMarketplaceContractInstance>);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @returns a response object that includes the listing count
 * @beta
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
 * Use this to get a count of all direct listings on your marketplace v3 contract.
 *
 * @example
 * ```javascript
 * const { data: listingsCount, isLoading, error } = useListingsCount(<YourMarketplaceV3ContractInstance>);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @returns a response object that includes the direct listings count
 * @internal
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
 * Use this to get a count of all direct listings on your marketplace v3 contract.
 *
 * @example
 * ```javascript
 * const { data: englishAuctionsCount, isLoading, error } = useEnglishAuctionsCount(<YourMarketplaceV3ContractInstance>);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @returns a response object that includes the direct english actions count
 * @internal
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
 * Use this to get a list active listings from your marketplace contract.
 *
 * @example
 * ```javascript
 * const { data: listings, isLoading, error } = useActiveListings(<YourMarketplaceContractInstance>, { seller: "0x...", tokenContract: "0x...", tokenId: 1, start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of listings
 * @beta
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
 * Use this to get a the winning bid for an auction listing from your marketplace contract.
 *
 * @example
 * ```javascript
 * const { data: winningBid, isLoading, error } = useWinningBid(<YourMarketplaceContractInstance>, <listingId>);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the {@link Offer} that is winning the auction
 * @beta
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
      return contract.auction.getWinningBid(listingId);
    },
    {
      enabled: !!contract && listingId !== undefined,
    },
  );
}

/**
 * Use this to get the winner of an auction listing from your marketplace contract.
 *
 * @example
 * ```javascript
 * const { data: auctionWinner, isLoading, error } = useAuctionWinner(<YourMarketplaceContractInstance>, <listingId>);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the address of the winner of the auction or undefined if there is no winner yet
 * @beta
 */
export function useAuctionWinner(
  contract: RequiredParam<Marketplace>,
  listingId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.auction.getWinner(
      contractAddress,
      listingId,
    ),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");
      let winner: string | undefined;
      try {
        winner = await contract.auction.getWinner(listingId);
      } catch (err) {
        if (!(err as Error)?.message?.includes("Could not find auction")) {
          throw err;
        }
      }
      return winner;
    },
    {
      enabled: !!contract && listingId !== undefined,
    },
  );
}

/**
 * Use this to get the buffer in basis points between offers from your marketplace contract.
 *
 * @example
 * ```javascript
 * const { data: auctionWinner, isLoading, error } = useBidBuffer(<YourMarketplaceContractInstance>);
 * ```
 *
 * @param contract - an instance of a marketplace contract

 * @returns a response object that includes an array of listings
 * @beta
 */
export function useBidBuffer(contract: RequiredParam<Marketplace>) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.getBidBufferBps(contractAddress),
    () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      return contract.getBidBufferBps();
    },
    {
      enabled: !!contract,
    },
  );
}

/**
 * Use this to get the minimum next bid for the auction listing from your marketplace contract.
 *
 * @example
 * ```javascript
 * const { data: minimumNextBid, isLoading, error } = useMinimumNextBid(<YourMarketplaceContractInstance>, <listingId>);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the minimum next bid for the auction listing
 * @beta
 */
export function useMinimumNextBid(
  contract: RequiredParam<Marketplace>,
  listingId: RequiredParam<BigNumberish>,
) {
  const contractAddress = contract?.getAddress();
  return useQueryWithNetwork(
    cacheKeys.contract.marketplace.auction.getWinner(
      contractAddress,
      listingId,
    ),
    async () => {
      requiredParamInvariant(contract, "No Contract instance provided");
      requiredParamInvariant(listingId, "No listing id provided");
      return await contract.auction.getMinimumNextBid(listingId);
    },
    {
      enabled: !!contract && listingId !== undefined,
    },
  );
}

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Use this to create a new Direct Listing on your marketplace contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: createDirectListing,
 *     isLoading,
 *     error,
 *   } = useCreateDirectListing(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to create direct listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => createDirectListing(directListingData)}
 *     >
 *       Create Direct Listing!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to create a new direct listing
 * @beta
 */
export function useCreateDirectListing<TMarketplace extends Marketplace | MarketplaceV3>(contract: RequiredParam<TMarketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: TMarketplace extends Marketplace ? NewDirectListing : DirectListingInputParams) => {
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
        return await contract.directListings.createListing(data as DirectListingInputParams);
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
 * Use this to create a new Auction Listing on your marketplace contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: createAuctionListing,
 *     isLoading,
 *     error,
 *   } = useCreateAuctionListing(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to create auction listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => createAuctionListing(auctionListingData)}
 *     >
 *       Create Auction Listing!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to create a new auction listing
 * @beta
 */
export function useCreateAuctionListing<TMarketplace extends Marketplace | MarketplaceV3>(contract: RequiredParam<TMarketplace>) {
  const activeChainId = useSDKChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: TMarketplace extends Marketplace ? NewAuctionListing : EnglishAuctionInputParams) => {
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
        return await contract.englishAuctions.createAuction(data as EnglishAuctionInputParams);
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
 * Use this to cancel a listing on your marketplace contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: cancelListing,
 *     isLoading,
 *     error,
 *   } = useCancelListing(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to cancel auction listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => cancelListing()}
 *     >
 *       Cancel Auction Listing!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to cancel a listing
 * @beta
 */
export function useCancelListing(contract: RequiredParam<Marketplace>) {
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
 * Use this to cancel a direct listing on your marketplace v3 contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: cancelDirectListing,
 *     isLoading,
 *     error,
 *   } = useCancelDirectListing(">>YourMarketplaceV3ContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to cancel direct listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => cancelListing()}
 *     >
 *       Cancel Direct Listing
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace v3 contract
 * @returns a mutation object that can be used to cancel a direct listing
 * @beta
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
 * Use this to cancel a direct listing on your marketplace v3 contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: cancelEnglishAuction,
 *     isLoading,
 *     error,
 *   } = useCancelEnglishAuction(">>YourMarketplaceV3ContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to cancel english auction", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => cancelEnglishAuction()}
 *     >
 *       Cancel English Auction
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace v3 contract
 * @returns a mutation object that can be used to cancel an english auction
 * @beta
 */
export function useCancelEnglishAuction(contract: RequiredParam<MarketplaceV3>) {
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
 * Use this to place a bid on an auction listing from your marketplace contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: makeBid,
 *     isLoading,
 *     error,
 *   } = useMakeBid(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to make a bid", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => makeBid({ listingId: 1, bid: 2 })}
 *     >
 *       Bid!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to make a bid on an auction listing
 * @beta
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
 * Use this to make an offer on direct or auction listing from your marketplace contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: makeOffer,
 *     isLoading,
 *     error,
 *   } = useMakeOffer(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to make a bid", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => makeOffer({ listingId: 1, pricePerToken: 0.5, quantity: 1 })}
 *     >
 *       Bid!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to make a bid on an auction listing
 * @beta
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
 * Accept an offer on a direct listing from an offeror, will accept the latest offer by the given offeror.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: acceptOffer,
 *     isLoading,
 *     error,
 *   } = useAcceptDirectListingOffer(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to accept offer", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => acceptOffer({ listingId: 1, addressOfOfferor: "0x..." })}
 *     >
 *       Accept offer
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to accept an offer on a direct listing
 * @beta
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
 * Execute an auction sale. Can only be executed once the auction has ended and the auction has a winning bid.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: executeAuctionSale,
 *     isLoading,
 *     error,
 *   } = useExecuteAuctionSale(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to execute sale", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => executeAuctionSale({ listingId: 1 })}
 *     >
 *       Execute sale
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to accept an offer on a direct listing
 * @beta
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
 * Get all the offers for a listing
 *
 * @remarks Fetch all the offers for a specified direct or auction listing.
 * @example
 * ```javascript
 * const { data: offers, isLoading, error } = useOffers(<YourMarketplaceContractInstance>, <listingId>);
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @param listingId - the id of the listing to fetch offers for
 * @beta
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

/**
 * Use this to buy out an auction listing from your marketplace contract.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const {
 *     mutate: buyNow,
 *     isLoading,
 *     error,
 *   } = useBuyNow(">>YourMarketplaceContractInstance<<");
 *
 *   if (error) {
 *     console.error("failed to buyout listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => buyNow({listingId: 1, type: ListingType.Auction})}
 *     >
 *       Buy listing!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to buy out an auction listing
 * @beta
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

function isMarketplaceV1(contract: RequiredParam<Marketplace | MarketplaceV3>): contract is Marketplace {
  return (contract as Marketplace).getAllListings !== undefined;
}