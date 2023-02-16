import { BuildYourApp } from "./components/BuildYourApp";
import { LatestEvents } from "./components/LatestEvents";
import { NFTDetails } from "./components/NFTDetails";
import { PermissionsTable } from "./components/PermissionsTable";
import { ShareContract } from "./components/ShareContract";
import { getGuidesAndTemplates } from "./helpers/getGuidesAndTemplates";
import { Divider, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { contractType, useContract } from "@thirdweb-dev/react";
import { Abi, getAllDetectedFeatureNames } from "@thirdweb-dev/sdk";
import { useMemo, useState } from "react";
import { Heading, Text, TrackedLink } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

const TRACKING_CATEGORY = "contract_overview";

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const [showAllGuides, setShowAllGuides] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
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
    <SimpleGrid columns={{ base: 1, xl: 4 }} gap={8}>
      <GridItem as={Flex} colSpan={{ xl: 3 }} direction="column" gap={16}>
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
        <LatestEvents
          address={contractAddress}
          trackingCategory={TRACKING_CATEGORY}
        />
        <BuildYourApp trackingCategory={TRACKING_CATEGORY} />
        {contract &&
          ["PermissionsEnumerable"].some((type) =>
            detectedFeatureNames.includes(type),
          ) && (
            <PermissionsTable
              contract={contract}
              trackingCategory={TRACKING_CATEGORY}
            />
          )}
        <ShareContract
          address={contractAddress}
          trackingCategory={TRACKING_CATEGORY}
        />
      </GridItem>
      <GridItem as={Flex} direction="column" gap={6}>
        {guides.length > 0 && (
          <Flex direction="column" gap={6}>
            <Heading size="title.sm">Relevant guides</Heading>
            <Flex gap={4} direction="column">
              {guides.slice(0, showAllGuides ? undefined : 3).map((guide) => (
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="guide"
                  trackingProps={{
                    guide: guide.title.replace(" ", "_").toLowerCase(),
                  }}
                  isExternal
                  fontWeight={500}
                  href={guide.url}
                  key={guide.title}
                  fontSize="14px"
                  color="heading"
                  opacity={0.6}
                  display="inline-block"
                  _hover={{
                    opacity: 1,
                    textDecoration: "none",
                  }}
                >
                  {guide.title}
                </TrackedLink>
              ))}
              {guides.length > 3 && !showAllGuides ? (
                <Text
                  onClick={() => setShowAllGuides(true)}
                  cursor="pointer"
                  opacity={0.6}
                  color="heading"
                  _hover={{ opacity: 1, textDecoration: "none" }}
                >
                  View more ➝
                </Text>
              ) : null}
            </Flex>
          </Flex>
        )}
        {guides.length > 0 && templates.length > 0 && <Divider />}
        {templates.length > 0 && (
          <Flex direction="column" gap={4}>
            <Heading size="title.sm">Relevant templates</Heading>
            <Flex gap={4} direction="column">
              {templates
                .slice(0, showAllTemplates ? undefined : 3)
                .map((template) => (
                  <TrackedLink
                    isExternal
                    category={TRACKING_CATEGORY}
                    label="template"
                    trackingProps={{
                      template: template.title
                        .replaceAll(" ", "_")
                        .toLowerCase(),
                    }}
                    fontWeight={500}
                    href={template.url}
                    key={template.title}
                    fontSize="14px"
                    color="heading"
                    opacity={0.6}
                    display="inline-block"
                    _hover={{ opacity: 1, textDecoration: "none" }}
                  >
                    {template.title}
                  </TrackedLink>
                ))}
              {templates.length > 3 && !showAllTemplates ? (
                <Text
                  onClick={() => setShowAllTemplates(true)}
                  cursor="pointer"
                  opacity={0.6}
                  color="heading"
                  _hover={{ opacity: 1, textDecoration: "none" }}
                >
                  View more ➝
                </Text>
              ) : null}
            </Flex>
          </Flex>
        )}
      </GridItem>
    </SimpleGrid>
  );
};
