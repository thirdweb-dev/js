import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { getAllQueryKey, getTotalCountQueryKey } from "./useGetAll";
import { useMarketplace } from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";

interface DirectListingProps {
  assetContractAddress: string;
  tokenId: string;
  quantity: string;
  currencyContractAddress: string;
  buyoutPricePerToken: string;
  startTimeInSeconds: string;
  listingDurationInSeconds: string;
}

export function useMarketplaceDirectListMutation(contractAddress?: string) {
  const marketplace = useMarketplace(contractAddress);
  return useMutationWithInvalidate(
    async (data: DirectListingProps) => {
      return await marketplace?.direct.createListing({
        ...data,
      });
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(marketplace),
          getTotalCountQueryKey(marketplace),
        ]);
      },
    },
  );
}

interface AuctionListingProps {
  assetContractAddress: string;
  tokenId: string;
  quantity: string;
  currencyContractAddress: string;
  buyoutPricePerToken: string;
  reservePricePerToken: string;
  startTimeInSeconds: string;
  listingDurationInSeconds: string;
}

export function useMarketplaceAuctionListMutation(contractAddress?: string) {
  const marketplace = useMarketplace(contractAddress);
  return useMutationWithInvalidate(
    async (data: AuctionListingProps) => {
      return await marketplace?.auction.createListing({
        ...data,
      });
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(marketplace),
          getTotalCountQueryKey(marketplace),
        ]);
      },
    },
  );
}

interface CancelListingProps {
  listingId: string;
  listingType: ListingType;
}

export function useMarketplaceCancelMutation(contractAddress?: string) {
  const marketplace = useMarketplace(contractAddress);
  return useMutationWithInvalidate(
    async (data: CancelListingProps) => {
      const { listingId, listingType } = data;

      if (listingType === ListingType.Auction) {
        return await marketplace?.auction.cancelListing(listingId);
      } else {
        return await marketplace?.direct.cancelListing(listingId);
      }
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          getAllQueryKey(marketplace),
          getTotalCountQueryKey(marketplace),
        ]);
      },
    },
  );
}
