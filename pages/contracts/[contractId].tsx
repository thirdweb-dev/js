import {
  Box,
  Center,
  Divider,
  Flex,
  Icon,
  IconButton,
  Image,
  LinkBox,
  LinkOverlay,
  Skeleton,
} from "@chakra-ui/react";
import { detectFeatures } from "@thirdweb-dev/sdk";
import { FeatureWithEnabled } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { ContractDeployForm } from "components/contract-components/contract-deploy-form";
import { useContractPublishMetadataFromURI } from "components/contract-components/hooks";
import { FeatureIconMap } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import { FiArrowLeft, FiCheckCircle, FiExternalLink } from "react-icons/fi";
import { Card, Heading, LinkButton, Text, TrackedLink } from "tw-components";

const ALWAYS_SUGGESTED = ["ContractMetadata", "Permissions"];

function extractFeatures(
  input: ReturnType<typeof detectFeatures>,
  enabledFeatures: FeatureWithEnabled[] = [],
  suggestedFeatures: FeatureWithEnabled[] = [],
  parent = "__ROOT__",
) {
  if (!input) {
    return {
      enabledFeatures,
      suggestedFeatures,
    };
  }
  for (const featureKey in input) {
    const feature = input[featureKey];
    // if feature is enabled, then add it to enabledFeatures
    if (feature.enabled) {
      enabledFeatures.push(feature);
    }
    // otherwise if it is disabled, but it's parent is enabled or suggested, then add it to suggestedFeatures
    else if (
      enabledFeatures.findIndex((f) => f.name === parent) > -1 ||
      ALWAYS_SUGGESTED.includes(feature.name)
    ) {
      suggestedFeatures.push(feature);
    }
    // recurse
    extractFeatures(
      feature.features,
      enabledFeatures,
      suggestedFeatures,
      feature.name,
    );
  }

  return {
    enabledFeatures,
    suggestedFeatures,
  };
}

function useContractFeatures(abi?: any) {
  const features = useMemo(() => {
    if (abi) {
      return extractFeatures(detectFeatures(abi));
    }
    return undefined;
  }, [abi]);
  return features;
}

export default function ContractDetailPage() {
  const { Track } = useTrack({
    page: "contract-detail",
  });

  const router = useRouter();
  const contractId = useSingleQueryParam("contractId");
  const from = useSingleQueryParam("from");
  const publishMetadataQuery = useContractPublishMetadataFromURI(
    contractId || "",
  );
  const contractTypeImage = useMemo(() => {
    return contractId && contractId in FeatureIconMap
      ? FeatureIconMap[contractId as keyof typeof FeatureIconMap]
      : FeatureIconMap["custom"];
  }, [contractId]);
  const features = useContractFeatures(publishMetadataQuery.data?.abi);

  const [enabledFeatures] = useMemo(() => {
    if (!features) {
      return [[]];
    }
    const enabled = features.enabledFeatures;

    return [enabled] as const;
  }, [features]);

  return (
    <Track>
      <Flex direction="column" as="section" gap={4}>
        <Flex align="center" gap={4} justify="space-between" as="header">
          <Flex align="center" gap={2}>
            {from && (
              <IconButton
                variant="ghost"
                aria-label="back"
                onClick={() => router.back()}
                icon={<Icon boxSize={6} as={FiArrowLeft} />}
              />
            )}
            <Skeleton isLoaded={publishMetadataQuery.isSuccess}>
              {publishMetadataQuery.data?.image ? (
                typeof publishMetadataQuery.data.image === "string" ? (
                  <Image
                    objectFit="contain"
                    boxSize="64px"
                    src={publishMetadataQuery.data.image}
                    alt={publishMetadataQuery.data?.name}
                  />
                ) : (
                  <ChakraNextImage
                    boxSize="64px"
                    src={publishMetadataQuery.data.image}
                    alt={publishMetadataQuery.data?.name}
                  />
                )
              ) : contractTypeImage ? (
                <ChakraNextImage
                  boxSize="64px"
                  src={contractTypeImage}
                  alt={publishMetadataQuery.data?.name || ""}
                />
              ) : null}
            </Skeleton>
            <Flex direction="column" gap={1} align="flex-start">
              <Skeleton isLoaded={publishMetadataQuery.isSuccess}>
                <Heading size="title.md">
                  {publishMetadataQuery.isSuccess
                    ? publishMetadataQuery.data?.name
                    : "testing testing testing"}
                </Heading>
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
        <Divider borderColor="borderColor" />
        <Flex gap={12} direction="column" as="main">
          {contractId && (
            <Flex gap={4} direction="column">
              <Card>
                <Flex direction="column" gap={6}>
                  {enabledFeatures.length > 0 && (
                    <Flex direction="column" gap={4}>
                      <Box>
                        <Heading size="subtitle.md">
                          <TrackedLink
                            href="https://portal.thirdweb.com/thirdweb-deploy/contract-extensions"
                            category="extensions-deploy"
                            label="header"
                            isExternal
                          >
                            <Flex alignItems="center" gap={2}>
                              Detected Extensions
                              <Icon as={FiExternalLink} />
                            </Flex>
                          </TrackedLink>
                        </Heading>
                        <Text>
                          These extensions will automatically be available for
                          this contract in the dashboard as well as in the SDKs.
                        </Text>
                      </Box>
                      <Flex gap={2}>
                        {enabledFeatures.map((feature) => (
                          <EnabledFeature
                            key={feature.name}
                            feature={feature}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  )}
                  <ContractDeployForm contractId={contractId} />
                </Flex>
              </Card>
            </Flex>
          )}
          <Center>
            <LinkButton
              size="sm"
              variant="outline"
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-extensions"
            >
              Learn about thirdweb extensions
            </LinkButton>
          </Center>
        </Flex>
      </Flex>
    </Track>
  );
}

ContractDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

interface EnabledFeatureProps {
  feature: FeatureWithEnabled;
}

const EnabledFeature: React.FC<EnabledFeatureProps> = ({ feature }) => {
  const { trackEvent } = useTrack();
  return (
    <Card
      overflow="hidden"
      py={2}
      as={LinkBox}
      _hover={{ opacity: 0.8 }}
      borderRadius="full"
    >
      <Flex gap={2} align="center" justify="space-between">
        <Flex gap={2} align="center">
          <Icon boxSize={4} color="green.500" as={FiCheckCircle} />
          <LinkOverlay
            href={`https://portal.thirdweb.com/contracts/${feature.docLinks.contracts}`}
            isExternal
            onClick={() =>
              trackEvent({
                category: "extensions-deploy",
                action: "click",
                label: feature.name,
              })
            }
          >
            <Heading textAlign="left" size="subtitle.sm">
              {feature.name}
            </Heading>
          </LinkOverlay>
          <Icon as={FiExternalLink} />
        </Flex>
      </Flex>
    </Card>
  );
};
