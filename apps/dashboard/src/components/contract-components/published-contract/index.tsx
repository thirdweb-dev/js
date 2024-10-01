"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
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
import type { ThirdwebClient } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { download } from "thirdweb/storage";
import invariant from "tiny-invariant";
import { Card, Heading, Link, LinkButton, Text } from "tw-components";
import type { PublishedContractWithVersion } from "../fetch-contracts-with-versions";
import {
  usePublishedContractEvents,
  usePublishedContractFunctions,
} from "../hooks";
import { PublisherHeader } from "../publisher/publisher-header";
import { MarkdownRenderer } from "./markdown-renderer";

interface ExtendedPublishedContract extends PublishedContractWithVersion {
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
  const client = useThirdwebClient();

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

  const sources = useQuery({
    queryKey: ["sources", publishedContract.publishMetadataUri],
    queryFn: async () => {
      invariant(
        publishedContract.metadata.sources,
        "no compilerMetadata sources available",
      );
      return (await fetchSourceFilesFromMetadata(publishedContract, client))
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
type ContractSource = {
  filename: string;
  source: string;
};
async function fetchSourceFilesFromMetadata(
  publishedMetadata: ExtendedPublishedContract,
  client: ThirdwebClient,
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
                client,
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
