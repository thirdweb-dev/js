"use client";

import {
  Divider,
  Flex,
  GridItem,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { format } from "date-fns/format";
import { correctAndUniqueLicenses } from "lib/licenses";
import { replaceIpfsUrl } from "lib/sdk";
import { useMemo } from "react";
import { BiPencil } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { VscBook, VscCalendar, VscServer } from "react-icons/vsc";
import { useActiveAccount } from "thirdweb/react";
import { download } from "thirdweb/storage";
import invariant from "tiny-invariant";
import { Card, Heading, Link, LinkButton, Text } from "tw-components";
import { thirdwebClient } from "../../../@/constants/client";
import type { PublishedContractWithVersion } from "../fetch-contracts-with-versions";
import {
  usePublishedContractEvents,
  usePublishedContractFunctions,
} from "../hooks";
import { PublisherHeader } from "../publisher/publisher-header";
import { AddressesModal } from "./addresses-modal";
import { MarkdownRenderer } from "./markdown-renderer";

export interface ExtendedPublishedContract
  extends PublishedContractWithVersion {
  name: string;
  displayName?: string;
  description?: string;
  version?: string;
  publisher?: string;
  tags?: string[];
  logo?: string;
  audit?: string;
}

interface PublishedContractProps {
  publishedContract: ExtendedPublishedContract;
  walletOrEns: string;
}

export const PublishedContract: React.FC<PublishedContractProps> = ({
  publishedContract,
  walletOrEns,
}) => {
  const address = useActiveAccount()?.address;

  const contractFunctions = usePublishedContractFunctions(publishedContract);
  const contractEvents = usePublishedContractEvents(publishedContract);

  const publishDate = format(
    new Date(
      Number.parseInt(publishedContract?.publishTimestamp.toString() || "0") *
        1000,
    ),
    "MMM dd, yyyy",
  );

  const licenses = correctAndUniqueLicenses(publishedContract?.licenses || []);

  // const publishedContractName =
  //   publishedContract?.displayName || publishedContract?.name;

  // const extensionNames = useMemo(() => {
  //   return enabledExtensions.map((ext) => ext.name);
  // }, [enabledExtensions]);

  // const ogImageUrl = useMemo(
  //   () =>
  //     PublishedContractOG.toUrl({
  //       name: publishedContractName,
  //       description: contract.description,
  //       version: contract.version || "latest",
  //       publisher: publisherEnsOrAddress,
  //       extension: extensionNames,
  //       license: licenses,
  //       publishDate,
  //       publisherAvatar: publisherProfile.data?.avatar || undefined,
  //       logo: contract.logo,
  //     }),
  //   [
  //     extensionNames,
  //     licenses,
  //     contract.description,
  //     contract.logo,
  //     publishedContractName,
  //     contract.version,
  //     publishDate,
  //     publisherEnsOrAddress,
  //     publisherProfile.data?.avatar,
  //   ],
  // );

  //   const twitterIntentUrl = useMemo(() => {
  //     const url = new URL("https://twitter.com/intent/tweet");
  //     url.searchParams.append(
  //       "text",
  //       `Check out this ${publishedContractName} contract on @thirdweb

  // Deploy it in one click`,
  //     );
  //     url.searchParams.append("url", currentRoute);
  //     return url.href;
  //   }, [publishedContractName, currentRoute]);

  const sources = useQuery({
    queryKey: ["sources", publishedContract.publishMetadataUri],
    queryFn: async () => {
      invariant(
        publishedContract.metadata.sources,
        "no compilerMetadata sources available",
      );
      return (await fetchSourceFilesFromMetadata(publishedContract))
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        })
        .slice()
        .reverse();
    },
    enabled: !!publishedContract.metadata.sources,
  });

  // const title = useMemo(() => {
  //   let clearType = "";
  //   if (extensionNames.includes("ERC721")) {
  //     clearType = "ERC721";
  //   } else if (extensionNames.includes("ERC20")) {
  //     clearType = "ERC20";
  //   } else if (extensionNames.includes("ERC1155")) {
  //     clearType = "ERC1155";
  //   }
  //   if (clearType) {
  //     return `${publishedContractName} - ${clearType} | Published Smart Contract`;
  //   }

  //   return `${publishedContractName} | Published Smart Contract`;
  // }, [extensionNames, publishedContractName]);

  const implementationAddresses =
    publishedContract.factoryDeploymentData?.implementationAddresses;

  const factoryAddresses =
    publishedContract.factoryDeploymentData?.factoryAddresses;

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
      {/* <NextSeo
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
      /> */}

      {/* Farcaster frames headers */}
      {/* <Head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={ogImageUrl.toString()} />
        <meta
          property="fc:frame:post_url"
          content={`${getAbsoluteUrl()}/api/frame/redirect`}
        />
        <meta property="fc:frame:button:1" content="Deploy now" />
        <meta name="fc:frame:button:1:action" content="post_redirect" />
      </Head> */}

      <GridItem colSpan={{ base: 12, md: 9 }}>
        <Flex flexDir="column" gap={6}>
          {address === publishedContract.publisher && (
            <LinkButton
              ml="auto"
              size="sm"
              variant="outline"
              leftIcon={<Icon as={BiPencil} />}
              href={`/contracts/publish/${encodeURIComponent(
                publishedContract.publishMetadataUri.replace("ipfs://", ""),
              )}`}
            >
              Edit
            </LinkButton>
          )}
          {publishedContract?.readme && (
            <Card as={Flex} flexDir="column" gap={2} p={6} position="relative">
              <MarkdownRenderer markdownText={publishedContract?.readme} />
            </Card>
          )}

          {publishedContract?.changelog && (
            <Card as={Flex} flexDir="column" gap={2} p={0}>
              <Heading px={6} pt={5} pb={2} size="title.sm">
                {publishedContract?.version} Release Notes
              </Heading>
              <Divider />

              <MarkdownRenderer
                px={6}
                pt={2}
                pb={5}
                markdownText={publishedContract?.changelog}
              />
            </Card>
          )}
          {contractFunctions && (
            <Card p={0}>
              <ContractFunctionsOverview
                functions={contractFunctions}
                events={contractEvents}
                sources={sources.data}
                abi={publishedContract?.abi}
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
                {publishedContract.publishTimestamp && (
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
                {publishedContract?.audit && (
                  <ListItem>
                    <Flex gap={2} alignItems="flex-start">
                      <Icon as={BsShieldCheck} boxSize={5} color="green" />
                      <Flex direction="column" gap={1}>
                        <Heading as="h5" size="label.sm">
                          Audit Report
                        </Heading>
                        <Text size="body.md" lineHeight={1.2}>
                          <Link
                            href={replaceIpfsUrl(publishedContract.audit)}
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
                {(publishedContract?.isDeployableViaProxy &&
                  hasImplementationAddresses) ||
                (publishedContract?.isDeployableViaFactory &&
                  hasFactoryAddresses) ? (
                  <ListItem>
                    <Flex gap={2} alignItems="flex-start">
                      <Icon color="paragraph" as={VscServer} boxSize={5} />
                      <Flex direction="column" gap={1}>
                        <Heading as="h5" size="label.sm">
                          {publishedContract?.isDeployableViaFactory
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
                        publishedContract?.isDeployableViaFactory ? (
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
          <Flex flexDir="column" gap={4}>
            <Flex gap={2} alignItems="center">
              <LinkButton
                colorScheme="blue"
                href="https://portal.thirdweb.com/contracts/publish/overview"
                w="full"
                variant="ghost"
                isExternal
              >
                Learn more about Publish
              </LinkButton>
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
    </>
  );
};

// TODO: find a place to put this
export type ContractSource = {
  filename: string;
  source: string;
};
async function fetchSourceFilesFromMetadata(
  publishedMetadata: ExtendedPublishedContract,
): Promise<ContractSource[]> {
  return await Promise.all(
    Object.entries(publishedMetadata.metadata.sources).map(
      async ([path, info]) => {
        const urls = "urls" in info ? info.urls : undefined;
        const ipfsLink = urls
          ? urls.find((url) => url.includes("ipfs"))
          : undefined;
        if (ipfsLink) {
          const ipfsHash = ipfsLink.split("ipfs/")[1];
          // 3 sec timeout for sources that haven't been uploaded to ipfs
          const timeout = new Promise<string>((_resolve, reject) =>
            setTimeout(() => reject("timeout"), 3000),
          );
          const source = await Promise.race([
            (
              await download({
                uri: `ipfs://${ipfsHash}`,
                client: thirdwebClient,
              })
            ).text(),
            timeout,
          ]);
          return {
            filename: path,
            source,
          };
        }
        if ("content" in info) {
          return {
            filename: path,
            source: info.content || "Could not find source for this contract",
          };
        }
        return {
          filename: path,
          source: "Could not find source for this contract",
        };
      },
    ),
  );
}
