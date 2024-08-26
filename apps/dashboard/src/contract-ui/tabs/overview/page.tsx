import { Divider, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { PublishedBy } from "components/contract-components/shared/published-by";
import { RelevantDataSection } from "components/dashboard/RelevantDataSection";
import type { ContractType } from "constants/contracts";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { AnalyticsOverview } from "./components/Analytics";
import { BuildYourApp } from "./components/BuildYourApp";
import { ContractChecklist } from "./components/ContractChecklist";
import { Extensions } from "./components/Extensions";
import { LatestEvents } from "./components/LatestEvents";
import { MarketplaceDetails } from "./components/MarketplaceDetails";
import { NFTDetails } from "./components/NFTDetails";
import { PermissionsTable } from "./components/PermissionsTable";
import { TokenDetails } from "./components/TokenDetails";
import { getGuidesAndTemplates } from "./helpers/getGuidesAndTemplates";

interface ContractOverviewPageProps {
  contract: ThirdwebContract;
  contractType: ContractType;
  detectedFeatureNames: string[];
}

const TRACKING_CATEGORY = "contract_overview";

export const ContractOverviewPage: React.FC<ContractOverviewPageProps> = ({
  contract,
  contractType,
  detectedFeatureNames,
}) => {
  const { guides, templates } = useMemo(
    () => getGuidesAndTemplates(detectedFeatureNames, contractType),
    [detectedFeatureNames, contractType],
  );

  return (
    <SimpleGrid columns={{ base: 1, xl: 10 }} gap={20}>
      <GridItem as={Flex} colSpan={{ xl: 7 }} direction="column" gap={16}>
        {contract && <ContractChecklist contract={contract} />}
        {contract && (
          <AnalyticsOverview
            contractAddress={contract.address}
            chainId={contract.chain.id}
            trackingCategory={TRACKING_CATEGORY}
          />
        )}
        {contract &&
          (contractType === "marketplace" ||
            ["DirectListings", "EnglishAuctions"].some((type) =>
              detectedFeatureNames.includes(type),
            )) && (
            <MarketplaceDetails
              contract={contract}
              trackingCategory={TRACKING_CATEGORY}
              features={detectedFeatureNames}
            />
          )}
        {contract &&
          ["ERC1155", "ERC721"].some((type) =>
            detectedFeatureNames.includes(type),
          ) && (
            <NFTDetails
              contract={contract}
              trackingCategory={TRACKING_CATEGORY}
              features={detectedFeatureNames}
            />
          )}
        {["ERC20"].some((type) => detectedFeatureNames.includes(type)) && (
          <TokenDetails contract={contract} />
        )}
        <LatestEvents
          contract={contract}
          trackingCategory={TRACKING_CATEGORY}
        />
        {["PermissionsEnumerable"].some((type) =>
          detectedFeatureNames.includes(type),
        ) && (
          <PermissionsTable
            contract={contract}
            trackingCategory={TRACKING_CATEGORY}
          />
        )}
        <BuildYourApp trackingCategory={TRACKING_CATEGORY} />
      </GridItem>
      <GridItem colSpan={{ xl: 3 }} as={Flex} direction="column" gap={6}>
        <PublishedBy contractAddress={contract.address} />
        {contract?.abi && <Extensions abi={contract?.abi} />}
        {(guides.length > 0 || templates.length > 0) && <Divider />}
        <RelevantDataSection
          data={guides}
          title="guide"
          TRACKING_CATEGORY={TRACKING_CATEGORY}
        />
        {guides.length > 0 && templates.length > 0 && <Divider />}
        <RelevantDataSection
          data={templates}
          title="template"
          TRACKING_CATEGORY={TRACKING_CATEGORY}
        />
        {templates.length > 0 && <Divider />}
      </GridItem>
    </SimpleGrid>
  );
};
