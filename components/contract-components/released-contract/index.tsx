import {
  useContractEnabledFeatures,
  useContractPublishMetadataFromURI,
  useReleasedContractCompilerMetadata,
  useReleasedContractInfo,
} from "../hooks";
import { ReleaserHeader } from "../releaser/releaser-header";
import { ExtractedContractFunctions } from "./extracted-contract-functions";
import {
  Divider,
  Flex,
  Icon,
  List,
  ListItem,
  useClipboard,
} from "@chakra-ui/react";
import { PublishedContract } from "@thirdweb-dev/sdk";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { BiShareAlt } from "react-icons/bi";
import { FcCheckmark } from "react-icons/fc";
import { IoMdCheckmark } from "react-icons/io";
import { IoDocumentOutline } from "react-icons/io5";
import { SiTwitter } from "react-icons/si";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedIconButton,
} from "tw-components";

interface ReleasedContractProps {
  release: PublishedContract;
}

export const ReleasedContract: React.FC<ReleasedContractProps> = ({
  release,
}) => {
  const releasedContractInfo = useReleasedContractInfo(release);
  const { data: compilerInfo } = useReleasedContractCompilerMetadata(release);
  const wallet = useSingleQueryParam("wallet");
  const router = useRouter();
  const contractReleaseMetadata = useContractPublishMetadataFromURI(
    release.metadataUri,
  );

  const enabledFeatures = useContractEnabledFeatures(
    contractReleaseMetadata.data?.abi,
  );

  const currentRoute = `https://thirdweb.com${router.asPath}`;

  const { onCopy, hasCopied } = useClipboard(currentRoute);
  return (
    <Flex gap={12} w="full" flexDir={{ base: "column", md: "row" }}>
      <NextSeo
        title={`${releasedContractInfo.data?.name} | Deploy in one click with thirdweb deploy`}
        description={`Browse previous versions of ${releasedContractInfo.data?.name} and deploy it in one click to any supported blockchains.`}
        openGraph={{
          title: `${releasedContractInfo.data?.name} | Deploy in one click with thirdweb deploy`,
          url: currentRoute,
        }}
      />
      <Flex w="full" flexDir="column" gap={6}>
        {releasedContractInfo.data?.publishedMetadata?.readme && (
          <Card w="full" as={Flex} flexDir="column" gap={2} p={0}>
            <Heading px={6} pt={5} pb={2} size="title.sm">
              Readme
            </Heading>
            <Divider />
            <Text px={6} pt={2} pb={5} whiteSpace="pre-wrap">
              {releasedContractInfo.data?.publishedMetadata.readme}
            </Text>
          </Card>
        )}
        {releasedContractInfo.data?.publishedMetadata?.changelog && (
          <Card w="full" as={Flex} flexDir="column" gap={2} p={0}>
            <Heading px={6} pt={5} pb={2} size="title.sm">
              {releasedContractInfo.data?.publishedMetadata?.version} Release
              Notes
            </Heading>
            <Divider />
            <Text px={6} pt={2} pb={5} whiteSpace="pre-wrap">
              {releasedContractInfo.data?.publishedMetadata?.changelog}
            </Text>
          </Card>
        )}
        {release && (
          <Card w="full" as={Flex} flexDir="column" gap={2} p={0}>
            <Heading px={6} pt={5} pb={2} size="title.sm">
              Functions
            </Heading>
            <Divider />
            <ExtractedContractFunctions contractRelease={release} />
          </Card>
        )}
      </Flex>
      <Flex w={{ base: "100vw", md: "25vw" }} flexDir="column" gap={6}>
        {wallet && <ReleaserHeader wallet={wallet} />}
        <Divider />
        <Flex flexDir="column" gap={4}>
          <Heading size="title.sm">Contract details</Heading>
          <List as={Flex} flexDir="column" gap={3}>
            <ListItem>
              <Flex gap={2} alignItems="center">
                <Icon as={IoDocumentOutline} boxSize={5} />
                <Text size="label.md">
                  License: {compilerInfo?.licenses?.join(", ") || "None"}
                </Text>
              </Flex>
            </ListItem>
            {(enabledFeatures || []).map((feature) => (
              <ListItem key={feature.name}>
                <Flex gap={2} alignItems="center">
                  <Icon as={FcCheckmark} boxSize={5} />
                  <Text size="label.md">{feature.name}</Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Flex>
        <Divider />
        <Flex flexDir="column" gap={4}>
          <Heading size="title.sm">Share</Heading>
          <Flex gap={2} alignItems="center">
            <TrackedIconButton
              bg="transparent"
              aria-label="copy-url"
              icon={
                <Icon boxSize={5} as={hasCopied ? IoMdCheckmark : BiShareAlt} />
              }
              category="released-contract"
              label="copy-url"
              onClick={onCopy}
            />
            <TrackedIconButton
              as={LinkButton}
              isExternal
              noIcon
              href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20${releasedContractInfo.data?.name}%20contract%20on%20%40thirdweb_%0A%0ADeploy%20it%20in%20one%20click%3A&url=${currentRoute}`}
              bg="transparent"
              aria-label="twitter"
              icon={<Icon boxSize={5} as={SiTwitter} />}
              category="released-contract"
              label="share-twitter"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
