import { useActiveChainId } from "../../Provider";
import { BuyNowParams, MakeBidParams, RequiredParam } from "../../types";
import {
  cacheKeys,
  invalidateContractAndBalances,
} from "../../utils/cache-keys";
import { useQueryWithNetwork } from "../query-utils/useQueryWithNetwork";
import { useAddress } from "../useAddress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Marketplace,
  MarketplaceFilter,
  NewAuctionListing,
  NewDirectListing,
} from "@thirdweb-dev/sdk";
// eslint-disable-next-line no-duplicate-imports
import { ListingType } from "@thirdweb-dev/sdk";
import { BigNumber, BigNumberish } from "ethers";
import invariant from "tiny-invariant";

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
 * @returns a response object that includes an array of listings
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
      invariant(contract, "No Contract instance provided");
      return contract.getListing(BigNumber.from(listingId || 0));
    },
    {
      enabled: !!contract || !contractAddress,
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
      invariant(contract, "No Contract instance provided");
      return contract.getAllListings(filter);
    },
    {
      enabled: !!contract || !contractAddress,
      keepPreviousData: true,
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
      invariant(contract, "No Contract instance provided");

      return contract.getActiveListings(filter);
    },
    {
      enabled: !!contract || !contractAddress,
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
      invariant(contract, "No Contract instance provided");
      return contract.auction.getWinningBid(BigNumber.from(listingId || 0));
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
      invariant(contract, "No Contract instance provided");
      let winner: string | undefined;
      try {
        winner = await contract.auction.getWinner(
          BigNumber.from(listingId || 0),
        );
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
      invariant(contract, "No Contract instance provided");
      return contract.getBidBufferBps();
    },
    {
      enabled: !!contract,
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
export function useCreateDirectListing(contract: RequiredParam<Marketplace>) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: NewDirectListing) => {
      invariant(walletAddress, "no wallet connected, cannot create listing");
      invariant(
        contract?.direct?.createListing,
        "contract does not support direct.createListing",
      );
      return await contract.direct.createListing(data);
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
export function useCreateAuctionListing(contract: RequiredParam<Marketplace>) {
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: NewAuctionListing) => {
      invariant(walletAddress, "no wallet connected, cannot create listing");
      invariant(
        contract?.direct?.createListing,
        "contract does not support auction.createListing",
      );
      return await contract.auction.createListing(data);
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
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: MakeBidParams) => {
      invariant(walletAddress, "no wallet connected, cannot make bid");
      invariant(
        contract?.auction?.makeBid,
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
  const activeChainId = useActiveChainId();
  const contractAddress = contract?.getAddress();
  const queryClient = useQueryClient();
  const walletAddress = useAddress();
  return useMutation(
    async (data: BuyNowParams) => {
      invariant(walletAddress, "no wallet connected, cannot make bid");
      if (data.type === ListingType.Direct) {
        invariant(
          contract?.direct.buyoutListing,
          "contract does not support direct.buyoutListing",
        );

        return await contract.direct.buyoutListing(
          data.id,
          data.buyAmount,
          data.buyForWallet,
        );
      }
      invariant(
        contract?.auction?.buyoutListing,
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
