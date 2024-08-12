import { Skeleton, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { totalAuctions, totalListings } from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import { Card } from "tw-components";

const TotalListingsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const { data: directListingCount, isSuccess: listingLoaded } =
    useReadContract(totalListings, {
      contract,
    });
  const { data: englishAuctionCount, isSuccess: auctionLoaded } =
    useReadContract(totalAuctions, {
      contract,
    });
  const _totalListings = useMemo(
    () => (directListingCount || 0n) + (englishAuctionCount || 0n),
    [directListingCount, englishAuctionCount],
  );

  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>Total Listings</StatLabel>
      <Skeleton isLoaded={listingLoaded && auctionLoaded}>
        <StatNumber>{_totalListings.toString()}</StatNumber>
      </Skeleton>
    </Card>
  );
};

const DirectListingsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const { data: directListingCount, isSuccess } = useReadContract(
    totalListings,
    {
      contract,
    },
  );

  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>Direct Listings</StatLabel>
      <Skeleton isLoaded={isSuccess}>
        <StatNumber>{(directListingCount || 0n).toString()}</StatNumber>
      </Skeleton>
    </Card>
  );
};

const EnglishAuctionsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const { data: englishAuctionCount, isSuccess } = useReadContract(
    totalAuctions,
    {
      contract,
    },
  );

  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>English Auctions</StatLabel>
      <Skeleton isLoaded={isSuccess}>
        <StatNumber>{(englishAuctionCount || 0n).toString()}</StatNumber>
      </Skeleton>
    </Card>
  );
};

interface ListingStatsV3Props {
  contract: ThirdwebContract;
  hasDirectListings: boolean;
  hasEnglishAuctions: boolean;
}

export const ListingStatsV3: React.FC<ListingStatsV3Props> = ({
  contract,
  hasDirectListings,
  hasEnglishAuctions,
}) => {
  return (
    <Stack spacing={{ base: 3, md: 6 }} direction="row">
      {hasDirectListings && hasEnglishAuctions && contract && (
        <TotalListingsStat contract={contract} />
      )}
      {hasDirectListings && <DirectListingsStat contract={contract} />}
      {hasEnglishAuctions && <EnglishAuctionsStat contract={contract} />}
    </Stack>
  );
};
