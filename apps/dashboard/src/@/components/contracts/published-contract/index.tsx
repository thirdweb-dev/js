"use client";

import { Divider, Flex, GridItem, List, ListItem } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LinkButton } from "chakra/button";
import { Card } from "chakra/card";
import { Heading } from "chakra/heading";
import { Text } from "chakra/text";
import { format } from "date-fns";
import {
  BookOpenTextIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  PencilIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { download } from "thirdweb/storage";
import invariant from "tiny-invariant";
import { PublisherHeader } from "@/components//contract-components/publisher/publisher-header";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import type { PublishedContractWithVersion } from "@/components/contract-components/fetch-contracts-with-versions";
import { ContractFunctionsOverview } from "@/components/contracts/functions/contract-functions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  usePublishedContractEvents,
  usePublishedContractFunctions,
} from "@/hooks/contract-hooks";
import { correctAndUniqueLicenses } from "@/lib/licenses";
import { replaceIpfsUrl } from "@/lib/sdk";

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
  isLoggedIn: boolean;
  client: ThirdwebClient;
}

export const PublishedContract: React.FC<PublishedContractProps> = ({
  publishedContract,
  isLoggedIn,
  client,
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

  const sources = useQuery({
    enabled: !!publishedContract.metadata.sources,
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
    queryKey: ["sources", publishedContract.publishMetadataUri],
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
              href={`/contracts/publish/${encodeURIComponent(
                publishedContract.publishMetadataUri.replace("ipfs://", ""),
              )}`}
              leftIcon={<PencilIcon className="size-3" />}
              ml="auto"
              size="sm"
              variant="outline"
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
              <Heading pb={2} pt={5} px={6} size="title.sm">
                {publishedContract?.version} Release Notes
              </Heading>
              <Divider />

              <MarkdownRenderer
                className="px-6 pt-2 pb-5"
                markdownText={publishedContract?.changelog}
              />
            </Card>
          )}
          {contractFunctions && (
            <Card p={0}>
              <ContractFunctionsOverview
                abi={publishedContract?.abi}
                events={contractEvents}
                functions={contractFunctions}
                isLoggedIn={isLoggedIn}
                sources={sources.data}
              />
            </Card>
          )}
        </Flex>
      </GridItem>

      <GridItem colSpan={{ base: 12, md: 3 }}>
        <Flex flexDir="column" gap={6}>
          {publishedContract.publisher && (
            <PublisherHeader
              client={client}
              wallet={publishedContract.publisher}
            />
          )}

          <Separator />

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-xl tracking-tight">Details</h4>
            <List as={Flex} flexDir="column" gap={5}>
              {publishedContract.publishTimestamp && (
                <ListItem>
                  <Flex alignItems="flex-start" gap={3}>
                    <CalendarDaysIcon className="size-5 text-muted-foreground" />
                    <Flex direction="column" gap={1}>
                      <Heading as="h5" size="label.sm">
                        Publish Date
                      </Heading>
                      <Text lineHeight={1.2} size="body.md">
                        {publishDate}
                      </Text>
                    </Flex>
                  </Flex>
                </ListItem>
              )}
              {publishedContract?.audit && (
                <ListItem>
                  <Flex alignItems="flex-start" gap={3}>
                    <ShieldCheckIcon className="size-5 text-green-500" />
                    <Flex direction="column" gap={1}>
                      <Heading as="h5" size="label.sm">
                        Audit Report
                      </Heading>
                      <Text lineHeight={1.2} size="body.md">
                        <Link
                          className="text-link-foreground hover:text-foreground"
                          href={replaceIpfsUrl(publishedContract.audit, client)}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View Audit Report
                        </Link>
                      </Text>
                    </Flex>
                  </Flex>
                </ListItem>
              )}
              <ListItem>
                <Flex alignItems="flex-start" gap={3}>
                  <BookOpenTextIcon className="size-5 text-muted-foreground" />
                  <Flex direction="column" gap={1}>
                    <Heading as="h5" size="label.sm">
                      License
                      {licenses.length > 1 ? "s" : ""}
                    </Heading>
                    <Text lineHeight={1.2} size="body.md">
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
                  <Flex alignItems="flex-start" gap={2}>
                    <ServerIcon className="size-5 text-muted-foreground" />
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
            </List>
          </div>

          <Separator />

          <Button asChild className="w-full gap-2 bg-card" variant="outline">
            <Link
              href="https://portal.thirdweb.com/contracts/publish/overview"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn more about Publish{" "}
              <ExternalLinkIcon className="size-4 text-muted-foreground" />
            </Link>
          </Button>
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
                client,
                uri: `ipfs://${ipfsHash}`,
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
