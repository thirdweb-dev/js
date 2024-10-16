import { SkeletonContainer } from "@/components/ui/skeleton";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { totalAuctions, totalListings } from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

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
    <StatCard
      value={combinedListingCount.toString()}
      label="Total Listings"
      isPending={
        directListingsQuery.isPending || englishAuctionsQuery.isPending
      }
    />
  );
};

const DirectListingsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const directListingsQuery = useReadContract(totalListings, {
    contract,
  });

  return (
    <StatCard
      value={(directListingsQuery.data || 0n).toString()}
      isPending={directListingsQuery.isPending}
      label="Direct Listings"
    />
  );
};

const EnglishAuctionsStat: React.FC<{ contract: ThirdwebContract }> = ({
  contract,
}) => {
  const englishAuctionsQuery = useReadContract(totalAuctions, {
    contract,
  });

  return (
    <StatCard
      value={(englishAuctionsQuery.data || 0n).toString()}
      isPending={englishAuctionsQuery.isPending}
      label="English Auctions"
    />
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
    <div className="flex flex-row gap-3 md:gap-6 [&>*]:grow">
      {hasDirectListings && hasEnglishAuctions && contract && (
        <TotalListingsStat contract={contract} />
      )}
      {hasDirectListings && <DirectListingsStat contract={contract} />}
      {hasEnglishAuctions && <EnglishAuctionsStat contract={contract} />}
    </div>
  );
};

function StatCard(props: {
  value: string;
  isPending: boolean;
  label: string;
}) {
  return (
    <dl className="block rounded-lg border border-border bg-muted/50 p-4">
      <dt className="mb-1.5 text-sm md:text-base">{props.label}</dt>
      <SkeletonContainer
        loadedData={props.isPending ? undefined : props.value}
        skeletonData={"0000"}
        render={(v) => <dd className="truncate font-semibold text-xl">{v}</dd>}
      />
    </dl>
  );
}
