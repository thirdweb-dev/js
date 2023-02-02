import {
  useContractEnabledExtensions,
  useContractPublishMetadataFromURI,
  useEns,
  useReleasedContractCompilerMetadata,
  useReleasedContractEvents,
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
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import {
  PublishedContract,
  PublishedMetadata,
  fetchSourceFilesFromMetadata,
} from "@thirdweb-dev/sdk/evm";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { replaceDeployerAddress } from "components/explore/publisher";
import { ShareButton } from "components/share-buttom";
import { format } from "date-fns";
import { correctAndUniqueLicenses } from "lib/licenses";
import { StorageSingleton, replaceIpfsUrl } from "lib/sdk";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ReleaseOG } from "og-lib/url-utils";
import { useMemo } from "react";
import { BiPencil } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { VscBook, VscCalendar } from "react-icons/vsc";
import invariant from "tiny-invariant";
import {
  Card,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export interface ExtendedReleasedContractInfo extends PublishedContract {
  name: string;
  displayName?: string;
  description: string;
  version: string;
  releaser: string;
  tags?: string[];
  logo?: string;
  audit?: string;
}

interface ReleasedContractProps {
  release: ExtendedReleasedContractInfo;
  walletOrEns: string;
}

export const ReleasedContract: React.FC<ReleasedContractProps> = ({
  release,
  walletOrEns,
}) => {
  const address = useAddress();
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

  const currentRoute = `https://thirdweb.com${router.asPath}`.replace(
    "deployer.thirdweb.eth",
    "thirdweb.eth",
  );

  const contractFunctions = useReleasedContractFunctions(release);
  const contractEvents = useReleasedContractEvents(release);

  const ensQuery = useEns(release.releaser);

  const releaserEnsOrAddress = replaceDeployerAddress(
    shortenIfAddress(ensQuery.data?.ensName || release.releaser),
  );

  const releasedDate = format(
    new Date(
      parseInt(
        releasedContractInfo?.data?.publishedTimestamp.toString() || "0",
      ) * 1000,
    ),
    "MMM dd, yyyy",
  );

  const licenses = correctAndUniqueLicenses(compilerInfo?.licenses || []);

  const releaseName = useMemo(() => {
    if (release.displayName) {
      return release.displayName;
    }
    return release.name;
  }, [release.displayName, release.name]);

  const extensionNames = useMemo(() => {
    return enabledExtensions.map((ext) => ext.name);
  }, [enabledExtensions]);

  const ogImageUrl = useMemo(
    () =>
      ReleaseOG.toUrl({
        name: releaseName,
        description: release.description,
        version: release.version,
        publisher: releaserEnsOrAddress,
        extension: extensionNames,
        license: licenses,
        publishDate: releasedDate,
        publisherAvatar: releaserProfile.data?.avatar || undefined,
        logo: release.logo,
      }),
    [
      extensionNames,
      licenses,
      release.description,
      release.logo,
      releaseName,
      release.version,
      releasedDate,
      releaserEnsOrAddress,
      releaserProfile.data?.avatar,
    ],
  );

  const twitterIntentUrl = useMemo(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.append(
      "text",
      `Check out this ${releaseName} contract on @thirdweb
      
Deploy it in one click`,
    );
    url.searchParams.append("url", currentRoute);
    return url.href;
  }, [releaseName, currentRoute]);

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
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        })
        .slice()
        .reverse();
    },
    { enabled: !!contractReleaseMetadata.data?.compilerMetadata?.sources },
  );

  const title = useMemo(() => {
    let clearType = "";
    if (extensionNames.includes("ERC721")) {
      clearType = "ERC721";
    } else if (extensionNames.includes("ERC20")) {
      clearType = "ERC20";
    } else if (extensionNames.includes("ERC1155")) {
      clearType = "ERC1155";
    }
    if (clearType) {
      return `${releaseName} - ${clearType} | Smart Contract Release`;
    }

    return `${releaseName} | Smart Contract Release`;
  }, [extensionNames, releaseName]);

  return (
    <>
      <NextSeo
        title={title}
        description={`${release.description}${
          release.description ? ". " : ""
        }Deploy ${releaseName} in one click with thirdweb.`}
        openGraph={{
          title,
          url: currentRoute,
          images: [
            {
              url: ogImageUrl.toString(),
              width: 1200,
              height: 630,
              alt: `${releaseName} contract on thirdweb`,
            },
          ],
        }}
      />
      <GridItem colSpan={{ base: 12, md: 9 }}>
        <Flex flexDir="column" gap={6}>
          {address === release.releaser && (
            <LinkButton
              ml="auto"
              size="sm"
              variant="outline"
              leftIcon={<Icon as={BiPencil} />}
              href={`/contracts/release/${encodeURIComponent(
                release.metadataUri.replace("ipfs://", ""),
              )}`}
            >
              Edit Release
            </LinkButton>
          )}
          {releasedContractInfo.data?.publishedMetadata?.readme && (
            <Card as={Flex} flexDir="column" gap={2} p={6} position="relative">
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
            <Card p={0}>
              <ContractFunctionsOverview
                functions={contractFunctions}
                events={contractEvents}
                sources={sources.data}
                abi={contractReleaseMetadata.data?.abi}
              />
            </Card>
          )}
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 3 }}>
        <Flex flexDir="column" gap={6}>
          {walletOrEns && <ReleaserHeader wallet={walletOrEns} />}
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading as="h4" size="title.sm">
              Details
            </Heading>
            <List as={Flex} flexDir="column" gap={3}>
              <>
                {releasedContractInfo.data?.publishedTimestamp && (
                  <ListItem>
                    <Flex gap={2} alignItems="flex-start">
                      <Icon color="paragraph" as={VscCalendar} boxSize={5} />
                      <Flex direction="column" gap={1}>
                        <Heading as="h5" size="label.sm">
                          Release Date
                        </Heading>
                        <Text size="body.md" lineHeight={1.2}>
                          {releasedDate}
                        </Text>
                      </Flex>
                    </Flex>
                  </ListItem>
                )}
                {releasedContractInfo.data?.publishedMetadata?.audit && (
                  <ListItem>
                    <Flex gap={2} alignItems="flex-start">
                      <Icon as={BsShieldCheck} boxSize={5} color="green" />
                      <Flex direction="column" gap={1}>
                        <Heading as="h5" size="label.sm">
                          Audit Report
                        </Heading>
                        <Text size="body.md" lineHeight={1.2}>
                          <Link
                            href={replaceIpfsUrl(
                              releasedContractInfo.data.publishedMetadata.audit,
                            )}
                            isExternal
                            _dark={{
                              color: "blue.300",
                              _hover: { color: "blue.500" },
                            }}
                            _light={{
                              color: "blue.500",
                              _hover: { color: "blue.700" },
                            }}
                          >
                            View Audit Report
                          </Link>
                        </Text>
                      </Flex>
                    </Flex>
                  </ListItem>
                )}
                <ListItem>
                  <Flex gap={2} alignItems="flex-start">
                    <Icon color="paragraph" as={VscBook} boxSize={5} />
                    <Flex direction="column" gap={1}>
                      <Heading as="h5" size="label.sm">
                        License
                        {licenses.length > 1 ? "s" : ""}
                      </Heading>
                      <Text size="body.md" lineHeight={1.2}>
                        {licenses.join(", ") || "None"}
                      </Text>
                    </Flex>
                  </Flex>
                </ListItem>
              </>
            </List>
          </Flex>
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading as="h4" size="title.sm">
              Extensions
            </Heading>
            <List as={Flex} flexDir="column" gap={3}>
              {enabledExtensions.length ? (
                enabledExtensions.map((extension) => (
                  <ListItem key={extension.name}>
                    <Flex gap={2} alignItems="center">
                      <Icon as={FcCheckmark} boxSize={5} />
                      <Text size="label.md">
                        <TrackedLink
                          href={`https://portal.thirdweb.com/contracts/${extension.docLinks.contracts}`}
                          isExternal
                          category="extension"
                          label={extension.name}
                        >
                          {extension.name}
                        </TrackedLink>
                      </Text>
                    </Flex>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <Text size="body.md" fontStyle="italic">
                    No extensions detected
                  </Text>
                </ListItem>
              )}
            </List>
          </Flex>
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading as="h4" size="title.sm">
              Share
            </Heading>
            <Flex gap={2} alignItems="center">
              <ShareButton
                url={currentRoute}
                title={`${shortenIfAddress(
                  releaserEnsOrAddress,
                )}/${releaseName}`}
                text={`Deploy ${shortenIfAddress(
                  releaserEnsOrAddress,
                )}/${releaseName} in one click with thirdweb.`}
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
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Flex gap={2} alignItems="center">
              <LinkButton
                colorScheme="blue"
                href="https://portal.thirdweb.com/release"
                w="full"
                variant="ghost"
                isExternal
              >
                Learn about Release
              </LinkButton>
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
    </>
  );
};
