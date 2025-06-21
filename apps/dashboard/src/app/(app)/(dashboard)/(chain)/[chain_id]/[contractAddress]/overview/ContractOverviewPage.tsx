import { ExternalLinkIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { UpsellBannerCard } from "@/components/blocks/UpsellBannerCard";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
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
  projectMeta: ProjectMeta | undefined;
}

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
  projectMeta,
}) => {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
      <div className="flex grow flex-col gap-10 overflow-hidden">
        {isErc20 && (
          <UpsellBannerCard
            accentColor="blue"
            cta={{
              icon: <ExternalLinkIcon className="size-4" />,
              link: `/${chainSlug}/${contract.address}`,
              target: "_blank",
              text: "View token page",
            }}
            description="A public page is available for this contract for anyone to buy this token"
            title="Public token page available"
          />
        )}

        <ContractChecklist
          chainSlug={chainSlug}
          contract={contract}
          functionSelectors={functionSelectors}
          isErc20={isErc20}
          isErc721={isErc721}
          isErc1155={isErc1155}
          projectMeta={projectMeta}
        />

        {isAnalyticsSupported && (
          <ContractAnalyticsOverviewCard
            chainId={contract.chain.id}
            chainSlug={chainSlug}
            contractAddress={contract.address}
            projectMeta={projectMeta}
          />
        )}

        {(hasEnglishAuctions || hasDirectListings) && (
          <MarketplaceDetails
            chainSlug={chainSlug}
            contract={contract}
            hasDirectListings={hasDirectListings}
            hasEnglishAuctions={hasEnglishAuctions}
            projectMeta={projectMeta}
          />
        )}

        {(isErc1155 || isErc721) && (
          <NFTDetails
            chainSlug={chainSlug}
            contract={contract}
            isErc721={isErc721}
            projectMeta={projectMeta}
          />
        )}

        {isErc20 && <TokenDetailsCard contract={contract} />}

        <LatestEvents
          chainSlug={chainSlug}
          contract={contract}
          projectMeta={projectMeta}
        />

        {isPermissionsEnumerable && (
          <PermissionsTable
            chainSlug={chainSlug}
            contract={contract}
            projectMeta={projectMeta}
          />
        )}

        <BuildYourApp
          chainSlug={chainSlug}
          contractAddress={contract.address}
          projectMeta={projectMeta}
        />
      </div>
      <div className="shrink-0 lg:w-[300px]">{publishedBy}</div>
    </div>
  );
};
