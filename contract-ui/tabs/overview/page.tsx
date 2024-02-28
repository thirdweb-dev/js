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
import { Divider, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { contractType, useContract } from "@thirdweb-dev/react";
import { Abi, getAllDetectedFeatureNames } from "@thirdweb-dev/sdk";
import { PublishedBy } from "components/contract-components/shared/published-by";
import { RelevantDataSection } from "components/dashboard/RelevantDataSection";
import { useMemo } from "react";

interface ContractOverviewPageProps {
  contractAddress?: string;
}

const TRACKING_CATEGORY = "contract_overview";

export const ContractOverviewPage: React.FC<ContractOverviewPageProps> = ({
  contractAddress,
}) => {
  const { contract } = useContract(contractAddress);
  const contractTypeQuery = contractType.useQuery(contractAddress);
  const contractTypeData = contractTypeQuery?.data || "custom";

  const detectedFeatureNames = useMemo(
    () =>
      contract?.abi ? getAllDetectedFeatureNames(contract.abi as Abi) : [],
    [contract?.abi],
  );

  const { guides, templates } = useMemo(
    () => getGuidesAndTemplates(detectedFeatureNames, contractTypeData),
    [detectedFeatureNames, contractTypeData],
  );

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  return (
    <SimpleGrid columns={{ base: 1, xl: 10 }} gap={20}>
      <GridItem as={Flex} colSpan={{ xl: 7 }} direction="column" gap={16}>
        {contract && <ContractChecklist contract={contract} />}
        {contract && (
          <AnalyticsOverview
            contractAddress={contractAddress}
            chainId={contract.chainId}
            trackingCategory={TRACKING_CATEGORY}
          />
        )}
        {contract &&
          (contractTypeData === "marketplace" ||
            ["DirectListings", "EnglishAuctions"].some((type) =>
              detectedFeatureNames.includes(type),
            )) && (
            <MarketplaceDetails
              contractAddress={contractAddress}
              trackingCategory={TRACKING_CATEGORY}
              contractType={contractTypeData as "marketplace"}
              features={detectedFeatureNames}
            />
          )}
        {contract &&
          ["ERC1155", "ERC721"].some((type) =>
            detectedFeatureNames.includes(type),
          ) && (
            <NFTDetails
              contractAddress={contract.getAddress()}
              chainId={contract.chainId}
              trackingCategory={TRACKING_CATEGORY}
              features={detectedFeatureNames}
            />
          )}
        {contract &&
          ["ERC20"].some((type) => detectedFeatureNames.includes(type)) && (
            <TokenDetails contractAddress={contractAddress} />
          )}
        <LatestEvents
          address={contractAddress}
          trackingCategory={TRACKING_CATEGORY}
        />
        {contract &&
          ["PermissionsEnumerable"].some((type) =>
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
        <PublishedBy contractAddress={contractAddress} />
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
