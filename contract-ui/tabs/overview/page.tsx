import { BuildYourApp } from "./components/BuildYourApp";
import { LatestEvents } from "./components/LatestEvents";
import { ShareContract } from "./components/ShareContract";
import { getGuidesAndTemplates } from "./helpers/getGuidesAndTemplates";
import { Divider, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { contractType, useContract } from "@thirdweb-dev/react";
import { Abi, getAllDetectedFeatureNames } from "@thirdweb-dev/sdk";
import { ImportContract } from "components/contract-components/import-contract";
import { useMemo } from "react";
import { Heading, TrackedLink } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

const TRACKING_CATEGORY = "contract_overview";

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const { contract, isSuccess, isError } = useContract(contractAddress);
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

  if ((!contract?.abi && isSuccess) || isError) {
    return <ImportContract contractAddress={contractAddress} />;
  }

  return (
    <SimpleGrid columns={{ base: 1, xl: 4 }} gap={8}>
      <GridItem as={Flex} colSpan={{ xl: 3 }} direction="column" gap={16}>
        <LatestEvents
          address={contractAddress}
          trackingCategory={TRACKING_CATEGORY}
        />
        <BuildYourApp trackingCategory={TRACKING_CATEGORY} />
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
              {guides.map((guide) => (
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label={guide.title.toLowerCase().replace(" ", "_")}
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
            </Flex>
          </Flex>
        )}
        {guides.length > 0 && templates.length > 0 && <Divider />}
        {templates.length > 0 && (
          <Flex direction="column" gap={4}>
            <Heading size="title.sm">Relevant templates</Heading>
            <Flex gap={4} direction="column">
              {templates.map((template) => (
                <TrackedLink
                  isExternal
                  category={TRACKING_CATEGORY}
                  label={template.title.toLowerCase().replace(" ", "_")}
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
            </Flex>
          </Flex>
        )}
      </GridItem>
    </SimpleGrid>
  );
};
