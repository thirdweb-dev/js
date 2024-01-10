import {
  useContractEnabledExtensions,
  useContractPublishMetadataFromURI,
  useEns,
  usePublishedContractCompilerMetadata,
  usePublishedContractEvents,
  usePublishedContractFunctions,
  usePublishedContractInfo,
  usePublisherProfile,
} from "../hooks";
import { PublisherHeader } from "../publisher/publisher-header";
import { AddressesModal } from "./addresses-modal";
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
  PublishedContract as PublishedContractType,
  PublishedMetadata,
  fetchSourceFilesFromMetadata,
} from "@thirdweb-dev/sdk";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { replaceDeployerAddress } from "components/explore/publisher";
import { ShareButton } from "components/share-buttom";
import { Extensions } from "contract-ui/tabs/overview/components/Extensions";
import { format } from "date-fns";
import { correctAndUniqueLicenses } from "lib/licenses";
import { StorageSingleton, replaceIpfsUrl } from "lib/sdk";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { PublishedContractOG } from "og-lib/url-utils";
import { useMemo } from "react";
import { BiPencil } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { VscBook, VscCalendar, VscServer } from "react-icons/vsc";
import invariant from "tiny-invariant";
import {
  Card,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedIconButton,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export interface ExtendedPublishedContract extends PublishedContractType {
  name: string;
  displayName?: string;
  description: string;
  version: string;
  publisher: string;
  tags?: string[];
  logo?: string;
  audit?: string;
}

interface PublishedContractProps {
  contract: ExtendedPublishedContract;
  walletOrEns: string;
}

export const PublishedContract: React.FC<PublishedContractProps> = ({
  contract,
  walletOrEns,
}) => {
  const address = useAddress();
  const publishedContractInfo = usePublishedContractInfo(contract);
  const { data: compilerInfo } = usePublishedContractCompilerMetadata(contract);

  const router = useRouter();
  const contractPublishMetadata = useContractPublishMetadataFromURI(
    contract.metadataUri,
  );

  const dynamicContractType =
    publishedContractInfo.data?.publishedMetadata.routerType;

  const compositeAbi =
    publishedContractInfo.data?.publishedMetadata.compositeAbi;

  const abi =
    compositeAbi &&
    (dynamicContractType === "plugin" ||
      dynamicContractType === "dynamic" ||
      !publishedContractInfo.data?.publishedMetadata.deployType ||
      publishedContractInfo.data?.publishedMetadata.name.includes(
        "MarketplaceV3",
      ))
      ? compositeAbi
      : contractPublishMetadata.data?.abi;

  const enabledExtensions = useContractEnabledExtensions(abi);

  const publisherProfile = usePublisherProfile(contract.publisher);

  const currentRoute = `https://thirdweb.com${router.asPath.replace(
    "/publish",
    "",
  )}`.replace("deployer.thirdweb.eth", "thirdweb.eth");

  const contractFunctions = usePublishedContractFunctions(contract);
  const contractEvents = usePublishedContractEvents(contract);

  const ensQuery = useEns(contract.publisher);

  const publisherEnsOrAddress = replaceDeployerAddress(
    shortenIfAddress(ensQuery.data?.ensName || contract.publisher),
  );

  const publishDate = format(
    new Date(
      parseInt(
        publishedContractInfo?.data?.publishedTimestamp.toString() || "0",
      ) * 1000,
    ),
    "MMM dd, yyyy",
  );

  const licenses = correctAndUniqueLicenses(compilerInfo?.licenses || []);

  const publishedContractName = useMemo(() => {
    if (contract.displayName) {
      return contract.displayName;
    }
    return contract.name;
  }, [contract.displayName, contract.name]);

  const extensionNames = useMemo(() => {
    return enabledExtensions.map((ext) => ext.name);
  }, [enabledExtensions]);

  const ogImageUrl = useMemo(
    () =>
      PublishedContractOG.toUrl({
        name: publishedContractName,
        description: contract.description,
        version: contract.version,
        publisher: publisherEnsOrAddress,
        extension: extensionNames,
        license: licenses,
        publishDate,
        publisherAvatar: publisherProfile.data?.avatar || undefined,
        logo: contract.logo,
      }),
    [
      extensionNames,
      licenses,
      contract.description,
      contract.logo,
      publishedContractName,
      contract.version,
      publishDate,
      publisherEnsOrAddress,
      publisherProfile.data?.avatar,
    ],
  );

  const twitterIntentUrl = useMemo(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.append(
      "text",
      `Check out this ${publishedContractName} contract on @thirdweb

Deploy it in one click`,
    );
    url.searchParams.append("url", currentRoute);
    return url.href;
  }, [publishedContractName, currentRoute]);

  const sources = useQuery(
    ["sources", contract],
    async () => {
      invariant(
        contractPublishMetadata.data?.compilerMetadata?.sources,
        "no compilerMetadata sources available",
      );
      return (
        await fetchSourceFilesFromMetadata(
          {
            metadata: {
              sources: contractPublishMetadata.data.compilerMetadata.sources,
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
    { enabled: !!contractPublishMetadata.data?.compilerMetadata?.sources },
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
      return `${publishedContractName} - ${clearType} | Published Smart Contract`;
    }

    return `${publishedContractName} | Published Smart Contract`;
  }, [extensionNames, publishedContractName]);

  const implementationAddresses = useMemo(
    () =>
      publishedContractInfo.data?.publishedMetadata?.factoryDeploymentData
        ?.implementationAddresses,
    [
      publishedContractInfo.data?.publishedMetadata?.factoryDeploymentData
        ?.implementationAddresses,
    ],
  );

  const factoryAddresses = useMemo(
    () =>
      publishedContractInfo.data?.publishedMetadata?.factoryDeploymentData
        ?.factoryAddresses,
    [
      publishedContractInfo.data?.publishedMetadata?.factoryDeploymentData
        ?.factoryAddresses,
    ],
  );

  const hasImplementationAddresses = useMemo(
    () => Object.values(implementationAddresses || {}).some((v) => v !== ""),
    [implementationAddresses],
  );

  const hasFactoryAddresses = useMemo(
    () => Object.values(factoryAddresses || {}).some((v) => v !== ""),
    [factoryAddresses],
  );

  return (
    <>
      <NextSeo
        title={title}
        description={`${contract.description}${
          contract.description ? ". " : ""
        }Deploy ${publishedContractName} in one click with thirdweb.`}
        openGraph={{
          title,
          url: currentRoute,
          images: [
            {
              url: ogImageUrl.toString(),
              width: 1200,
              height: 630,
              alt: `${publishedContractName} contract on thirdweb`,
            },
          ],
        }}
      />
      <GridItem colSpan={{ base: 12, md: 9 }}>
        <Flex flexDir="column" gap={6}>
          {address === contract.publisher && (
            <LinkButton
              ml="auto"
              size="sm"
              variant="outline"
              leftIcon={<Icon as={BiPencil} />}
              href={`/contracts/publish/${encodeURIComponent(
                contract.metadataUri.replace("ipfs://", ""),
              )}`}
            >
              Edit
            </LinkButton>
          )}
          {publishedContractInfo.data?.publishedMetadata?.readme && (
            <Card as={Flex} flexDir="column" gap={2} p={6} position="relative">
              <MarkdownRenderer
                markdownText={
                  publishedContractInfo.data?.publishedMetadata?.readme
                }
              />
            </Card>
          )}

          {publishedContractInfo.data?.publishedMetadata?.changelog && (
            <Card as={Flex} flexDir="column" gap={2} p={0}>
              <Heading px={6} pt={5} pb={2} size="title.sm">
                {publishedContractInfo.data?.publishedMetadata?.version} Release
                Notes
              </Heading>
              <Divider />

              <MarkdownRenderer
                px={6}
                pt={2}
                pb={5}
                markdownText={
                  publishedContractInfo.data?.publishedMetadata?.changelog
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
                abi={contractPublishMetadata.data?.abi}
              />
            </Card>
          )}
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 3 }}>
        <Flex flexDir="column" gap={6}>
          {walletOrEns && <PublisherHeader wallet={walletOrEns} />}
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading as="h4" size="title.sm">
              Details
            </Heading>
            <List as={Flex} flexDir="column" gap={3}>
              <>
                {publishedContractInfo.data?.publishedTimestamp && (
                  <ListItem>
                    <Flex gap={2} alignItems="flex-start">
                      <Icon color="paragraph" as={VscCalendar} boxSize={5} />
                      <Flex direction="column" gap={1}>
                        <Heading as="h5" size="label.sm">
                          Publish Date
                        </Heading>
                        <Text size="body.md" lineHeight={1.2}>
                          {publishDate}
                        </Text>
                      </Flex>
                    </Flex>
                  </ListItem>
                )}
                {publishedContractInfo.data?.publishedMetadata?.audit && (
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
                              publishedContractInfo.data.publishedMetadata
                                .audit,
                            )}
                            isExternal
                            _dark={{
                              color: "blue.400",
                              _hover: { color: "blue.500" },
                            }}
                            _light={{
                              color: "blue.500",
                              _hover: { color: "blue.500" },
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
                {(publishedContractInfo.data?.publishedMetadata
                  ?.isDeployableViaProxy &&
                  hasImplementationAddresses) ||
                (publishedContractInfo.data?.publishedMetadata
                  ?.isDeployableViaFactory &&
                  hasFactoryAddresses) ? (
                  <ListItem>
                    <Flex gap={2} alignItems="flex-start">
                      <Icon color="paragraph" as={VscServer} boxSize={5} />
                      <Flex direction="column" gap={1}>
                        <Heading as="h5" size="label.sm">
                          {publishedContractInfo.data?.publishedMetadata
                            ?.isDeployableViaFactory
                            ? "Factory"
                            : "Proxy"}{" "}
                          Enabled
                        </Heading>
                        {implementationAddresses &&
                        hasImplementationAddresses ? (
                          <AddressesModal
                            chainAddressRecord={implementationAddresses}
                            buttonTitle="Implementations"
                            modalTitle="Implementation Addresses"
                          />
                        ) : null}
                        {factoryAddresses &&
                        hasFactoryAddresses &&
                        publishedContractInfo.data?.publishedMetadata
                          ?.isDeployableViaFactory ? (
                          <AddressesModal
                            chainAddressRecord={factoryAddresses}
                            buttonTitle="Factories"
                            modalTitle="Factory Addresses"
                          />
                        ) : null}
                      </Flex>
                    </Flex>
                  </ListItem>
                ) : null}
              </>
            </List>
          </Flex>
          <Divider />
          {contractPublishMetadata.data?.abi && (
            <Extensions
              abi={
                compositeAbi &&
                (dynamicContractType === "plugin" ||
                  dynamicContractType === "dynamic" ||
                  !publishedContractInfo.data?.publishedMetadata.deployType ||
                  publishedContractInfo.data?.publishedMetadata.name.includes(
                    "MarketplaceV3",
                  ))
                  ? compositeAbi
                  : contractPublishMetadata.data?.abi
              }
            />
          )}
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading as="h4" size="title.sm">
              Share
            </Heading>
            <Flex gap={2} alignItems="center">
              <ShareButton
                url={currentRoute}
                title={`${shortenIfAddress(
                  publisherEnsOrAddress,
                )}/${publishedContractName}`}
                text={`Deploy ${shortenIfAddress(
                  publisherEnsOrAddress,
                )}/${publishedContractName} in one click with thirdweb.`}
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
                href="https://portal.thirdweb.com/contracts/publish/overview"
                w="full"
                variant="ghost"
                isExternal
              >
                Learn about Publish
              </LinkButton>
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
    </>
  );
};
