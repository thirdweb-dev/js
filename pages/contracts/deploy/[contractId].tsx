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
import type { FeatureWithEnabled } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { ContractDeployForm } from "components/contract-components/contract-deploy-form";
import {
  useContractEnabledExtensions,
  useContractPublishMetadataFromURI,
} from "components/contract-components/hooks";
import { ContractIdImage } from "components/contract-components/shared/contract-id-image";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useEffect, useRef } from "react";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { Card, Heading, LinkButton, Text, TrackedLink } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const ContractDeployDetailPage: ThirdwebNextPage = () => {
  const router = useRouter();
  const trackEvent = useTrack();
  const contractId = useSingleQueryParam("contractId");
  const from = useSingleQueryParam("from");
  const publishMetadataQuery = useContractPublishMetadataFromURI(
    contractId || "",
  );

  const hasTrackedImpression = useRef<boolean>(false);
  useEffect(() => {
    if (publishMetadataQuery.data && !hasTrackedImpression.current) {
      hasTrackedImpression.current = true;
      trackEvent({
        action: "impression",
        category: "deploy",
        analytics: publishMetadataQuery.data.analytics,
      });
    }
  }, [publishMetadataQuery.data, trackEvent]);

  const enabledFeatures = useContractEnabledExtensions(
    publishMetadataQuery.data?.abi,
  );

  return (
    <>
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
            {contractId && (
              <ContractIdImage boxSize={12} contractId={contractId} />
            )}
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
        <Divider />
        <Flex gap={12} direction="column" as="main">
          {contractId && (
            <Flex gap={4} direction="column">
              <Card p={{ base: 6, md: 10 }}>
                <Flex direction="column" gap={8}>
                  {enabledFeatures.length > 0 && (
                    <Flex direction="column" gap={4}>
                      <Box>
                        <Heading size="subtitle.md">
                          <TrackedLink
                            href="https://portal.thirdweb.com/contracts/build/overview"
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
                      <Flex gap={2} flexWrap="wrap">
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
              variant="outline"
              isExternal
              href="https://portal.thirdweb.com/contracts/build/overview"
            >
              Learn about thirdweb extensions
            </LinkButton>
          </Center>
        </Flex>
      </Flex>
    </>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

ContractDeployDetailPage.getLayout = function getLayout(page, props) {
  return <AppLayout {...props}>{page}</AppLayout>;
};

ContractDeployDetailPage.pageId = PageId.DeploySingle;

export default ContractDeployDetailPage;

interface EnabledFeatureProps {
  feature: FeatureWithEnabled;
}

const EnabledFeature: React.FC<EnabledFeatureProps> = ({ feature }) => {
  const trackEvent = useTrack();
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
          <Image
            boxSize={4}
            src="/assets/dashboard/extension-check.svg"
            alt=""
          />
          <LinkOverlay
            href={`https://portal.thirdweb.com/solidity/extensions/${feature.docLinks.contracts}`}
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
