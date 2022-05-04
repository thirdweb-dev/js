import { Box, Flex, Tag, TagLabel, TagRightIcon } from "@chakra-ui/react";
import { useContractFunctions } from "@thirdweb-dev/react";
import { FeatureWithEnabled } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import {
  useContractFeatures,
  usePublishedMetadataQuery,
} from "components/contract-components/hooks";
import { useMemo, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { MdCheckCircle } from "react-icons/md";
import { Card, CodeBlock, Heading, LinkButton } from "tw-components";

interface ContentOverviewProps {
  contractAddress: string;
}

export const CustomContractCodeTab: React.VFC<ContentOverviewProps> = ({
  contractAddress,
}) => {
  const functionsQuery = useContractFunctions(contractAddress);
  const metadataQuery = usePublishedMetadataQuery(contractAddress);
  const contractFeatures = useContractFeatures(metadataQuery?.data?.abi);
  const [expandedFeature, setExpandedFeature] = useState<FeatureWithEnabled>();

  const isError = functionsQuery.isError;
  const isSuccess = functionsQuery.isSuccess;

  const functions = functionsQuery.data
    ?.filter(
      (d) =>
        d.name !== "contractURI" &&
        d.name !== "setThirdwebInfo" &&
        d.name !== "getPublishMetadataUri",
    )
    .map((f) => f.signature);

  const featureTags = useMemo(() => {
    const generateTags = (
      features: Record<string, FeatureWithEnabled> | undefined,
      tags: JSX.Element[],
    ) => {
      if (features) {
        Object.keys(features)
          .map((f) => features[f])
          .forEach((f) => {
            tags.push(
              <Tag
                size="lg"
                key={f.name}
                borderRadius="full"
                variant={f === expandedFeature ? "solid" : "subtle"}
                colorScheme={
                  f === expandedFeature ? (f.enabled ? "green" : "red") : "gray"
                }
                onClick={() => setExpandedFeature(f)}
                cursor="pointer"
              >
                <TagLabel>{f.name}</TagLabel>
                <TagRightIcon
                  as={f.enabled ? MdCheckCircle : IoMdCloseCircle}
                  color={
                    f === expandedFeature
                      ? "white"
                      : f.enabled
                      ? "green.600"
                      : "red.600"
                  }
                />
              </Tag>,
            );
            // recurse to get nested features
            generateTags(f.features, tags);
          });
      }
    };
    const tags: JSX.Element[] = [];
    generateTags(contractFeatures, tags);
    return tags;
  }, [contractFeatures, expandedFeature]);

  if (isError) {
    return <Box>Contract does not support generated functions</Box>;
  }

  const detectedFeaturesCard =
    featureTags.length > 0 ? (
      <>
        <Card as={Flex} flexDirection="column" gap={2}>
          <Heading size="subtitle.md">Features</Heading>
          <Flex gap={2} direction="row">
            {featureTags}
          </Flex>
          {expandedFeature ? (
            <Card as={Flex} gap={2} flexDirection="column">
              <CodeBlock
                key={expandedFeature.name}
                code={`// Implementing '${expandedFeature.docLinks.contracts}' unlocks these built-in SDK functions
contract.${expandedFeature.namespace}`}
                language="typescript"
              />

              <Flex gap={2} direction="row">
                <LinkButton
                  href={`https://docs.thirdweb.com/typescript/${expandedFeature.docLinks.sdk}`}
                  colorScheme="primary"
                  variant="ghost"
                  size="sm"
                  isExternal
                >
                  SDK Docs
                </LinkButton>
                <LinkButton
                  href={`https://docs.thirdweb.com/contracts/${expandedFeature.docLinks.contracts}`}
                  colorScheme="primary"
                  variant="ghost"
                  size="sm"
                  isExternal
                >
                  Contract Docs
                </LinkButton>
              </Flex>
            </Card>
          ) : undefined}
        </Card>
      </>
    ) : undefined;

  return (
    <Flex gap={4} direction="column">
      <Card as={Flex} gap={2} flexDirection="column">
        <Heading size="subtitle.md">Install the thirdweb SDK</Heading>
        <CodeBlock
          px={4}
          py={2}
          borderRadius="md"
          language="bash"
          code={`npm install @thirdweb-dev/sdk`}
        />
      </Card>
      <Card as={Flex} gap={2} flexDirection="column">
        <Heading size="subtitle.md">
          Use your contract with the thirdweb SDK
        </Heading>
        <CodeBlock
          language="typescript"
          code={`import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const provider = ethers.Wallet.createRandom();
const sdk = new ThirdwebSDK(provider);
const contract = await sdk.getContract("${contractAddress}");`}
        />
      </Card>
      {detectedFeaturesCard}
      <Card as={Flex} gap={2} flexDirection="column">
        <Heading size="subtitle.md">Contract functions</Heading>
        {isSuccess
          ? functions?.map((signature) => (
              <CodeBlock
                key={signature}
                code={`contract.functions.${signature}`}
                language="typescript"
              />
            ))
          : undefined}
      </Card>
    </Flex>
  );
};
