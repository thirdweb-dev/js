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
 * Get a listing
 *
 * @example
 * ```javascript
 * const listingId = 0; // the listing id to check
 * const { data: listing, isLoading, error } = useListing(contract, listingId);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the desired listing
 * @see {@link https://portal.thirdweb.com/react/react.uselisting?utm_source=sdk | Documentation}
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
 * Get a direct listing
 *
 * @example
 * ```javascript
 * const listingId = 0; // the listing id to check
 * const { data: directListing, isLoading, error } = useListing(contract, listingId);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the desired direct listing
 * @twfeature DirectListings
 * @see {@link https://portal.thirdweb.com/react/react.usedirectlisting?utm_source=sdk | Documentation}
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
 * Get an english auction
 *
 * @example
 * ```javascript
 * const auctionId = 0; // the listing id to check
 * const { data: englishAuction, isLoading, error } = useEnglishAuction(contract, auctionId);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param auctionId - the auction id to check
 * @returns a response object that includes the desired english auction
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.useenglishauctions?utm_source=sdk | Documentation}
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
 * Get all listings
 *
 * @example
 * ```javascript
 * const { data: listings, isLoading, error } = useListings(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of listings
 * @see {@link https://portal.thirdweb.com/react/react.uselistings?utm_source=sdk | Documentation}
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
 * Get all direct listings
 *
 * @example
 * ```javascript
 * const { data: directListings, isLoading, error } = useDirectListings(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of direct listings
 * @twfeature DirectListings
 * @see {@link https://portal.thirdweb.com/react/react.usedirectlistings?utm_source=sdk | Documentation}
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
 * Get all valid direct listings
 *
 * @example
 * ```javascript
 * const { data: validDirectListings, isLoading, error } = useValidDirectListings(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of direct listings
 * @twfeature DirectListings
 * @see {@link https://portal.thirdweb.com/react/react.usevaliddirectlistings?utm_source=sdk | Documentation}
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
 * Get all english auctions
 *
 * @example
 * ```javascript
 * const { data: englishAuctions, isLoading, error } = useEnglishAuctions(contract, { start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of english auctions
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.useenglishauctions?utm_source=sdk | Documentation}
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
 * @see {@link https://portal.thirdweb.com/react/react.usevalidenglishauctions?utm_source=sdk | Documentation}
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
 * Get the total count of listings
 *
 * @example
 * ```javascript
 * const { data: listingsCount, isLoading, error } = useListingsCount(contract);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @returns a response object that includes the listing count
 * @see {@link https://portal.thirdweb.com/react/react.uselistingscount?utm_source=sdk | Documentation}
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
 * Get the total count of direct listings
 *
 * @example
 * ```javascript
 * const { data: directListingsCount, isLoading, error } = useDirectListingsCount(contract);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @returns a response object that includes the direct listings count
 * @twfeature DirectListings
 * @see {@link https://portal.thirdweb.com/react/react.usedirectlistingscount?utm_source=sdk | Documentation}
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
 * Get the total count of english auctions
 *
 * @example
 * ```javascript
 * const { data: englishAuctionsCount, isLoading, error } = useEnglishAuctionsCount(contract);
 * ```
 *
 * @param contract - an instance of a marketplace v3 contract
 * @returns a response object that includes the direct english actions count
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.useenglishauctionscount?utm_source=sdk | Documentation}
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
 * Get all active listings
 *
 * @example
 * ```javascript
 * const { data: listings, isLoading, error } = useActiveListings(contract, { seller: "{{wallet_address}}", tokenContract: "0x...", tokenId: 1, start: 0, count: 100 });
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param filter - filter to pass to the query for the sake of pagination & filtering
 * @returns a response object that includes an array of listings
 * @see {@link https://portal.thirdweb.com/react/react.useactivelistings?utm_source=sdk | Documentation}
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
 * Get the winning bid for an auction
 *
 * @example
 * ```javascript
 * const listingId = 0;
 * const { data: winningBid, isLoading, error } = useWinningBid(contract, listingId);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the {@link Offer} that is winning the auction
 * @see {@link https://portal.thirdweb.com/react/react.usewinningbid?utm_source=sdk | Documentation}
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
 * Get the winning bid for an english auction
 *
 * @example
 * ```javascript
 * const listingId = 0;
 * const { data: winningBid, isLoading, error } = useWinningBid(contract, listingId);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param auctionId - the auction id to check
 * @returns a response object that includes the {@link Bid} that is winning the auction
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.useenglishauctionwinningbid?utm_source=sdk | Documentation}
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
 * Get the winner of an english auction
 *
 * @example
 * ```javascript
 * const listingId = 0;
 * const { data: auctionWinner, isLoading, error } = useAuctionWinner(contract, listingId);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the address of the winner of the auction or undefined if there is no winner yet
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.useauctionwinner?utm_source=sdk | Documentation}
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
 * Get the bid buffer for an english auction
 *
 * @example
 * ```javascript
 * const { data: bidBuffer, isLoading, error } = useBidBuffer(contract);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check (only necessary for marketplace v3)

 * @returns a response object that includes an array of listings
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.usebidbuffer?utm_source=sdk | Documentation}
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
 * Get the minimum next bid for an english auction
 *
 * @example
 * ```javascript
 * const listingId = 0;
 * const { data: minimumNextBid, isLoading, error } = useMinimumNextBid(contract, listingId);
 * ```
 *
 * @param contract - an instance of a marketplace contract
 * @param listingId - the listing id to check
 * @returns a response object that includes the minimum next bid for the auction listing
 * @twfeature EnglishAucton
 * @see {@link https://portal.thirdweb.com/react/react.useminimumnextbid?utm_source=sdk | Documentation}
 */
export function useMinimumNextBid(
  contract: RequiredParam<Marketplace | MarketplaceV3>,
  listingId: RequiredParam<BigNumberish>,
) {
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
 * Get all the offers for a listing
 *
 * @remarks Fetch all the offers for a specified direct or auction listing.
 * @example
 * ```javascript
 * const listingId = 0;
 * const { data: offers, isLoading, error } = useOffers(contract, listingId);
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @param listingId - the id of the listing to fetch offers for
 * @see {@link https://portal.thirdweb.com/react/react.useoffers?utm_source=sdk | Documentation}
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

/** **********************/
/**     WRITE HOOKS     **/
/** **********************/

/**
 * Create a new direct listing
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: createDirectListing,
 *     isLoading,
 *     error,
 *   } = useCreateDirectListing(contract);
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
 * @twfeature DirectListings
 * @see {@link https://portal.thirdweb.com/react/react.usecreatedirectlisting?utm_source=sdk | Documentation}
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
 * Create a new english auction
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: createAuctionListing,
 *     isLoading,
 *     error,
 *   } = useCreateAuctionListing(contract);
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
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.usecreateauctionlisting?utm_source=sdk | Documentation}
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
 * Cancel a listing
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: cancelListing,
 *     isLoading,
 *     error,
 *   } = useCancelListing(contract);
 *
 *   if (error) {
 *     console.error("failed to cancel auction listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={cancelListing}
 *     >
 *       Cancel Auction Listing!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to cancel a listing
 * @see {@link https://portal.thirdweb.com/react/react.usecancellisting?utm_source=sdk | Documentation}
 * @beta
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
 * Cancel a direct listing
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: cancelDirectListing,
 *     isLoading,
 *     error,
 *   } = useCancelDirectListing(contract);
 *
 *   if (error) {
 *     console.error("failed to cancel direct listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={cancelDirectListing}
 *     >
 *       Cancel Direct Listing
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace v3 contract
 * @returns a mutation object that can be used to cancel a direct listing
 * @twfeature DirectListings
 * @see {@link https://portal.thirdweb.com/react/react.usecanceldirectlisting?utm_source=sdk | Documentation}
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
 * Cancel an english auction
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: cancelEnglishAuction,
 *     isLoading,
 *     error,
 *   } = useCancelEnglishAuction(contract);
 *
 *   if (error) {
 *     console.error("failed to cancel english auction", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={cancelEnglishAuction}
 *     >
 *       Cancel English Auction
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace v3 contract
 * @returns a mutation object that can be used to cancel an english auction
 * @twfeature EnglishAuctions
 * @see {@link https://portal.thirdweb.com/react/react.usecancelenglishauction?utm_source=sdk | Documentation}
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
 * Make a bid on an auction listing
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: makeBid,
 *     isLoading,
 *     error,
 *   } = useMakeBid(contract);
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
 * @see {@link https://portal.thirdweb.com/react/react.usemakebid?utm_source=sdk | Documentation}
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
 * Nake an offer on a direct or auction listing
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: makeOffer,
 *     isLoading,
 *     error,
 *   } = useMakeOffer(contract);
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
 * @see {@link https://portal.thirdweb.com/react/react.usemakeoffer?utm_source=sdk | Documentation}
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
 * Accept a specific offer on a direct listing
 *
 * @remarks will accept the latest offer by the given offeror.
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: acceptOffer,
 *     isLoading,
 *     error,
 *   } = useAcceptDirectListingOffer(contract);
 *
 *   if (error) {
 *     console.error("failed to accept offer", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => acceptOffer({ listingId: 1, addressOfOfferor: "{{wallet_address}}" })}
 *     >
 *       Accept offer
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a Marketplace contract
 * @returns a mutation object that can be used to accept an offer on a direct listing
 * @see {@link https://portal.thirdweb.com/react/react.useacceptdirectlistingoffer?utm_source=sdk | Documentation}
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
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: executeAuctionSale,
 *     isLoading,
 *     error,
 *   } = useExecuteAuctionSale(contract);
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
 * @see {@link https://portal.thirdweb.com/react/react.useexecuteauctionsale?utm_source=sdk | Documentation}
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
 * Buy out an auction listing
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}");
 *   const {
 *     mutate: buyNow,
 *     isLoading,
 *     error,
 *   } = useBuyNow(contract);
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
 * @see {@link https://portal.thirdweb.com/react/react.usebuynow?utm_source=sdk | Documentation}
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

/**
 * Buy a direct listing
 *
 * @example
 * ```jsx
 * const Component = () => {
 *   const { contract } = useContract("{{contract_address}}", "marketplace-v3");
 *   const {
 *     mutate: buyNow,
 *     isLoading,
 *     error,
 *   } = useBuyDirectListing(contract);
 *
 *   if (error) {
 *     console.error("failed to buy direct listing", error);
 *   }
 *
 *   return (
 *     <button
 *       disabled={isLoading}
 *       onClick={() => buyNow({listingId: 1, quantity: 1, buyer: "{{address}}"})}
 *     >
 *       Buy listing!
 *     </button>
 *   );
 * };
 * ```
 *
 * @param contract - an instance of a MarketplaceV3 contract
 * @returns a mutation object that can be used to buy out a direct listing
 * @see {@link https://portal.thirdweb.com/react/react.useBuyDirectListing?utm_source=sdk | Documentation}
 * @beta
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
