import { Skeleton, Stack, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { totalAuctions, totalListings } from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";
import { Card } from "tw-components";

const TotalListingsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const directListingsQuery = useReadContract(totalListings, {
    contract,
  });
  const englishAuctionsQuery = useReadContract(totalAuctions, {
    contract,
  });
  const combinedListingCount = useMemo(
    () => (directListingsQuery.data || 0n) + (englishAuctionsQuery.data || 0n),
    [directListingsQuery.data, englishAuctionsQuery.data],
  );

  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>Total Listings</StatLabel>
      <Skeleton
        isLoaded={
          directListingsQuery.isSuccess && englishAuctionsQuery.isSuccess
        }
      >
        <StatNumber>{combinedListingCount.toString()}</StatNumber>
      </Skeleton>
    </Card>
  );
};

const DirectListingsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const directListingsQuery = useReadContract(totalListings, {
    contract,
  });

  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>Direct Listings</StatLabel>
      <Skeleton isLoaded={directListingsQuery.isSuccess}>
        <StatNumber>{(directListingsQuery.data || 0n).toString()}</StatNumber>
      </Skeleton>
    </Card>
  );
};

const EnglishAuctionsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const englishAuctionsQuery = useReadContract(totalAuctions, {
    contract,
  });

  return (
    <Card as={Stat}>
      <StatLabel mb={{ base: 1, md: 0 }}>English Auctions</StatLabel>
      <Skeleton isLoaded={englishAuctionsQuery.isSuccess}>
        <StatNumber>{(englishAuctionsQuery.data || 0n).toString()}</StatNumber>
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
