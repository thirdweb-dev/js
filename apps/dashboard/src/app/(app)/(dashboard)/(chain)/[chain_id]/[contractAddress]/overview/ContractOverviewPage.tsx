import type { ThirdwebContract } from "thirdweb";
import { TokenDetailsCard } from "../tokens/components/supply";
import { ContractAnalyticsOverviewCard } from "./components/Analytics";
import { BuildYourApp } from "./components/BuildYourApp";
import { ContractChecklist } from "./components/ContractChecklist";
import { LatestEvents } from "./components/LatestEvents";
import { MarketplaceDetails } from "./components/MarketplaceDetails";
import { NFTDetails } from "./components/NFTDetails";
import { PermissionsTable } from "./components/PermissionsTable";

interface ContractOverviewPageProps {
  contract: ThirdwebContract;
  hasEnglishAuctions: boolean;
  hasDirectListings: boolean;
  isErc721: boolean;
  isErc1155: boolean;
  isErc20: boolean;
  isPermissionsEnumerable: boolean;
  chainSlug: string;
  isAnalyticsSupported: boolean;
  functionSelectors: string[];
  publishedBy: React.ReactNode;
}

const TRACKING_CATEGORY = "contract_overview";

export const ContractOverviewPage: React.FC<ContractOverviewPageProps> = ({
  contract,
  isErc1155,
  isErc20,
  isErc721,
  hasEnglishAuctions,
  hasDirectListings,
  isPermissionsEnumerable,
  chainSlug,
  isAnalyticsSupported,
  functionSelectors,
  publishedBy,
}) => {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
      <div className="flex grow flex-col gap-10 overflow-hidden">
        <ContractChecklist
          isErc721={isErc721}
          isErc1155={isErc1155}
          isErc20={isErc20}
          contract={contract}
          chainSlug={chainSlug}
          functionSelectors={functionSelectors}
        />

        {isAnalyticsSupported && (
          <ContractAnalyticsOverviewCard
            contractAddress={contract.address}
            chainId={contract.chain.id}
            trackingCategory={TRACKING_CATEGORY}
            chainSlug={chainSlug}
          />
        )}

        {(hasEnglishAuctions || hasDirectListings) && (
          <MarketplaceDetails
            contract={contract}
            trackingCategory={TRACKING_CATEGORY}
            hasEnglishAuctions={hasEnglishAuctions}
            hasDirectListings={hasDirectListings}
            chainSlug={chainSlug}
          />
        )}

        {(isErc1155 || isErc721) && (
          <NFTDetails
            contract={contract}
            trackingCategory={TRACKING_CATEGORY}
            isErc721={isErc721}
            chainSlug={chainSlug}
          />
        )}

        {isErc20 && <TokenDetailsCard contract={contract} />}

        <LatestEvents
          contract={contract}
          trackingCategory={TRACKING_CATEGORY}
          chainSlug={chainSlug}
        />

        {isPermissionsEnumerable && (
          <PermissionsTable
            contract={contract}
            trackingCategory={TRACKING_CATEGORY}
            chainSlug={chainSlug}
          />
        )}

        <BuildYourApp
          trackingCategory={TRACKING_CATEGORY}
          chainSlug={chainSlug}
          contractAddress={contract.address}
        />
      </div>
      <div className="shrink-0 lg:w-[300px]">{publishedBy}</div>
    </div>
  );
};
