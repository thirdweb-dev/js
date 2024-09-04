import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { PublishedBy } from "components/contract-components/shared/published-by";
import type { ThirdwebContract } from "thirdweb";
import { AnalyticsOverview } from "./components/Analytics";
import { BuildYourApp } from "./components/BuildYourApp";
import { ContractChecklist } from "./components/ContractChecklist";
import { LatestEvents } from "./components/LatestEvents";
import { MarketplaceDetails } from "./components/MarketplaceDetails";
import { NFTDetails } from "./components/NFTDetails";
import { PermissionsTable } from "./components/PermissionsTable";
import { TokenDetails } from "./components/TokenDetails";

interface ContractOverviewPageProps {
  contract: ThirdwebContract;
  hasEnglishAuctions: boolean;
  hasDirectListings: boolean;
  isErc721: boolean;
  isErc1155: boolean;
  isErc20: boolean;
  isPermissionsEnumerable: boolean;
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
}) => {
  return (
    <SimpleGrid columns={{ base: 1, xl: 10 }} gap={20}>
      <GridItem as={Flex} colSpan={{ xl: 7 }} direction="column" gap={16}>
        <ContractChecklist contract={contract} />

        <AnalyticsOverview
          contractAddress={contract.address}
          chainId={contract.chain.id}
          trackingCategory={TRACKING_CATEGORY}
        />

        {(hasEnglishAuctions || hasDirectListings) && (
          <MarketplaceDetails
            contract={contract}
            trackingCategory={TRACKING_CATEGORY}
            hasEnglishAuctions={hasEnglishAuctions}
            hasDirectListings={hasDirectListings}
          />
        )}
        {(isErc1155 || isErc721) && (
          <NFTDetails
            contract={contract}
            trackingCategory={TRACKING_CATEGORY}
            isErc721={isErc721}
          />
        )}
        {isErc20 && <TokenDetails contract={contract} />}
        <LatestEvents
          contract={contract}
          trackingCategory={TRACKING_CATEGORY}
        />
        {isPermissionsEnumerable && (
          <PermissionsTable
            contract={contract}
            trackingCategory={TRACKING_CATEGORY}
          />
        )}
        <BuildYourApp trackingCategory={TRACKING_CATEGORY} />
      </GridItem>
      <GridItem colSpan={{ xl: 3 }} as={Flex} direction="column" gap={6}>
        <PublishedBy contractAddress={contract.address} />
        {/* TODO: this is broken because it relies on something that no longer exists on contract instance */}
        {/* {contract?.abi && <Extensions abi={contract?.abi} />} */}
      </GridItem>
    </SimpleGrid>
  );
};
