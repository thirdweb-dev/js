import {
  ens,
  useContractEnabledExtensions,
  useContractPublishMetadataFromURI,
  useReleasedContractCompilerMetadata,
  useReleasedContractFunctions,
  useReleasedContractInfo,
  useReleaserProfile,
} from "../hooks";
import { ReleaserHeader } from "../releaser/releaser-header";
import { MarkdownRenderer } from "./markdown-renderer";
import {
  Divider,
  Flex,
  GridItem,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  PublishedContract,
  PublishedMetadata,
  fetchSourceFilesFromMetadata,
} from "@thirdweb-dev/sdk";
import { StorageSingleton } from "components/app-layouts/providers";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { ShareButton } from "components/share-buttom";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FcCheckmark } from "react-icons/fc";
import { IoDocumentOutline } from "react-icons/io5";
import { SiTwitter } from "react-icons/si";
import invariant from "tiny-invariant";
import {
  Card,
  Heading,
  LinkButton,
  Text,
  TrackedIconButton,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export interface ExtendedReleasedContractInfo extends PublishedContract {
  name: string;
  description: string;
  version: string;
  releaser: string;
  tags: string[];
}

interface ReleasedContractProps {
  release: ExtendedReleasedContractInfo;
  walletOrEns: string;
}

export const ReleasedContract: React.FC<ReleasedContractProps> = ({
  release,
  walletOrEns,
}) => {
  const releasedContractInfo = useReleasedContractInfo(release);
  const { data: compilerInfo } = useReleasedContractCompilerMetadata(release);

  const router = useRouter();
  const contractReleaseMetadata = useContractPublishMetadataFromURI(
    release.metadataUri,
  );

  const enabledExtensions = useContractEnabledExtensions(
    contractReleaseMetadata.data?.abi,
  );

  const releaserProfile = useReleaserProfile(release.releaser);

  const currentRoute = `https://thirdweb.com${router.asPath}`;

  const contractFunctions = useReleasedContractFunctions(release);

  // const { onCopy, hasCopied } = useClipboard(currentRoute);

  const ensQuery = ens.useQuery(release.releaser);

  const releaserEnsOrAddress = ensQuery.data?.ensName || release.releaser;

  const ogImageUrl = useMemo(() => {
    const url = new URL("https://og-image.thirdweb.com/thirdweb");
    url.searchParams.append("version", release.version);
    url.searchParams.append("description", release.description);
    url.searchParams.append("contractName", release.name);
    if (compilerInfo?.licenses) {
      compilerInfo.licenses.forEach((license) => {
        url.searchParams.append("licenses", license);
      });
    }
    if (enabledExtensions) {
      enabledExtensions
        .map((extension) => extension.name)
        .forEach((extension) => {
          url.searchParams.append("extensions", extension);
        });
    }
    url.searchParams.append("releaser", releaserEnsOrAddress);
    if (releaserProfile.data?.avatar) {
      url.searchParams.append("avatar", releaserProfile.data.avatar);
    }
    return `${url.href}&.png`;
  }, [
    release,
    compilerInfo,
    enabledExtensions,
    releaserEnsOrAddress,
    releaserProfile?.data,
  ]);

  const twitterIntentUrl = useMemo(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.append(
      "text",
      `Check out this ${release.name} contract on @thirdweb_
      
Deploy it in one click`,
    );
    url.searchParams.append("url", currentRoute);
    return url.href;
  }, [release, currentRoute]);

  const sources = useQuery(
    ["sources", release],
    async () => {
      invariant(
        contractReleaseMetadata.data?.compilerMetadata?.sources,
        "no compilerMetadata sources available",
      );
      return (
        await fetchSourceFilesFromMetadata(
          {
            metadata: {
              sources: contractReleaseMetadata.data.compilerMetadata.sources,
            },
          } as unknown as PublishedMetadata,
          StorageSingleton,
        )
      )
        .filter((source) => !source.filename.includes("@"))
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        });
    },
    { enabled: !!contractReleaseMetadata.data?.compilerMetadata?.sources },
  );

  return (
    <>
      <NextSeo
        title={`${shortenIfAddress(releaserEnsOrAddress)}/${release.name}`}
        description={`${release.description}${
          release.description ? ". " : ""
        }Deploy ${release.name} in one click with thirdweb.`}
        openGraph={{
          title: `${shortenIfAddress(releaserEnsOrAddress)}/${release.name}`,
          url: currentRoute,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 650,
              alt: "thirdweb",
            },
          ],
        }}
      />
      <GridItem order={{ base: 4, md: 3 }} colSpan={{ base: 12, md: 9 }}>
        <Flex flexDir="column" gap={6}>
          {releasedContractInfo.data?.publishedMetadata?.readme && (
            <Card as={Flex} flexDir="column" gap={2} p={6}>
              <MarkdownRenderer
                markdownText={
                  releasedContractInfo.data?.publishedMetadata?.readme
                }
              />
            </Card>
          )}
          {releasedContractInfo.data?.publishedMetadata?.changelog && (
            <Card as={Flex} flexDir="column" gap={2} p={0}>
              <Heading px={6} pt={5} pb={2} size="title.sm">
                {releasedContractInfo.data?.publishedMetadata?.version} Release
                Notes
              </Heading>
              <Divider />

              <MarkdownRenderer
                px={6}
                pt={2}
                pb={5}
                markdownText={
                  releasedContractInfo.data?.publishedMetadata?.changelog
                }
              />
            </Card>
          )}
          {contractFunctions && (
            <ContractFunctionsOverview
              functions={contractFunctions}
              sources={sources.data}
            />
          )}
        </Flex>
      </GridItem>
      <GridItem order={{ base: 3, md: 4 }} colSpan={{ base: 12, md: 3 }}>
        <Flex flexDir="column" gap={6}>
          {walletOrEns && <ReleaserHeader wallet={walletOrEns} />}
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading size="title.sm">Contract details</Heading>
            <List as={Flex} flexDir="column" gap={3}>
              <ListItem>
                <Flex gap={2} alignItems="center">
                  <Icon as={IoDocumentOutline} boxSize={5} />
                  <Text size="label.md" lineHeight={1.2}>
                    License
                    {compilerInfo?.licenses &&
                    compilerInfo?.licenses?.length > 1
                      ? "s"
                      : ""}
                    : {compilerInfo?.licenses?.join(", ") || "None"}
                  </Text>
                </Flex>
              </ListItem>
              {(enabledExtensions || []).map((feature) => (
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
              <ShareButton
                url={currentRoute}
                title={`${shortenIfAddress(releaserEnsOrAddress)}/${
                  release.name
                }`}
                text={`Deploy ${shortenIfAddress(releaserEnsOrAddress)}/${
                  release.name
                } in one click with thirdweb.`}
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href={twitterIntentUrl}
                bg="transparent"
                aria-label="twitter"
                icon={<Icon boxSize={5} as={SiTwitter} />}
                category="released-contract"
                label="share-twitter"
              />
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
    </>
  );
};
