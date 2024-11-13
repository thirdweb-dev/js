"use client";

import { UnexpectedValueErrorMessage } from "@/components/blocks/error-fallbacks/unexpect-value-error-message";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { CodeClient } from "@/components/ui/code/code.client";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import {
  Box,
  ButtonGroup,
  Divider,
  Flex,
  GridItem,
  IconButton,
  SimpleGrid,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useChainSlug } from "hooks/chains/chainSlug";
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { getNFT as getErc721NFT } from "thirdweb/extensions/erc721";
import { getNFT as getErc1155NFT } from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import {} from "tw-components";
import { Button, Card, Heading, Text } from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { shortenString } from "utils/usedapp-external";
import { NftProperty } from "../components/nft-property";
import { useNFTDrawerTabs } from "./useNftDrawerTabs";

function isValidUrl(possibleUrl?: string | null) {
  if (!possibleUrl) {
    return false;
  }
  try {
    new URL(possibleUrl);
  } catch (_) {
    if (possibleUrl.startsWith("ipfs://")) {
      return true;
    }
    return false;
  }

  return true;
}

interface TokenIdPageProps {
  tokenId: string;
  contract: ThirdwebContract;
  isErc721: boolean;
}

// TODO: verify the entire nft object with zod schema and display an error message

export const TokenIdPage: React.FC<TokenIdPageProps> = ({
  contract,
  tokenId,
  isErc721,
}) => {
  const [tab, setTab] = useState("Details");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useDashboardRouter();
  const chainId = contract.chain.id;
  const chainSlug = useChainSlug(chainId || 1);

  const tabs = useNFTDrawerTabs({
    contract,
    tokenId,
  });

  const client = useThirdwebClient();

  const { data: nft, isPending } = useReadContract(
    isErc721 ? getErc721NFT : getErc1155NFT,
    {
      contract,
      tokenId: BigInt(tokenId || 0),
      includeOwner: true,
    },
  );

  const tokenURIHttpLink = resolveSchemeWithErrorHandler({
    client,
    uri: nft?.tokenURI,
  });
  const nftImageLink = resolveSchemeWithErrorHandler({
    client,
    uri: nft?.metadata.image,
  });

  if (isPending) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!nft) {
    return (
      <Text>
        No NFT found with token ID {tokenId}. Please check the token ID and try
        again.
      </Text>
    );
  }

  // in the case we have an invalid url, we want to remove it
  const nftMetadata = {
    ...nft.metadata,
    animation_url: isValidUrl(nft.metadata.animation_url)
      ? nft.metadata.animation_url
      : undefined,
  };

  const properties = nft.metadata.attributes || nft.metadata.properties;

  return (
    <Flex flexDir={{ base: "column", lg: "row" }} gap={6}>
      <Card h="full" position="relative" minH="100px">
        <Box w="50px" position="absolute" zIndex={1000} top={6} left={6}>
          {/* TODO - replace this with breadcrumbs  */}
          <Card p={1} bgColor="backgroundCardHighlight">
            <IconButton
              w="inherit"
              variant="ghost"
              onClick={() =>
                router.push(`/${chainSlug}/${contract.address}/nfts`)
              }
              aria-label="Back"
              icon={<ChevronLeftIcon className="size-6" />}
            >
              Back
            </IconButton>
          </Card>
        </Box>
        <NFTMediaWithEmptyState
          metadata={nftMetadata}
          width={isMobile ? "100%" : "300px"}
          height={isMobile ? "100%" : "300px"}
        />
      </Card>
      <Flex flexDir="column" gap={6} w="full" px={2}>
        <Flex flexDir="column" gap={1.5}>
          <NFTName value={nft.metadata.name} />
          {nft.metadata?.description && (
            <NFTDescription value={nft.metadata.description} />
          )}
        </Flex>

        <Flex flexDir="column" gap={{ base: 0, md: 4 }}>
          <Box
            w="full"
            overflow={{ base: "auto", md: "hidden" }}
            pb={{ base: 4, md: 0 }}
          >
            <ButtonGroup size="sm" variant="ghost" spacing={2}>
              <Button
                type="button"
                isActive={tab === "Details"}
                _active={{
                  bg: "bgBlack",
                  color: "bgWhite",
                }}
                rounded="lg"
                onClick={() => setTab("Details")}
              >
                Details
              </Button>
              {tabs.map((tb) => (
                <Tooltip
                  key={tb.title}
                  p={0}
                  bg="transparent"
                  boxShadow="none"
                  label={
                    tb.isDisabled ? (
                      <Card py={2} px={4} bgColor="backgroundHighlight">
                        <Text size="label.sm">{tb.disabledText}</Text>
                      </Card>
                    ) : (
                      ""
                    )
                  }
                >
                  <Button
                    isDisabled={tb.isDisabled}
                    type="button"
                    isActive={tab === tb.title}
                    _active={{
                      bg: "bgBlack",
                      color: "bgWhite",
                    }}
                    rounded="lg"
                    onClick={() => setTab(tb.title)}
                  >
                    {tb.title}
                  </Button>
                </Tooltip>
              ))}
            </ButtonGroup>
          </Box>
          <Divider />
        </Flex>

        {tab === "Details" && (
          <Flex flexDir="column" gap={4}>
            <Card as={Flex} flexDir="column" gap={3}>
              <SimpleGrid rowGap={3} columns={12} placeItems="center left">
                <GridItem colSpan={4}>
                  <Heading size="label.md">Token ID</Heading>
                </GridItem>
                <GridItem colSpan={8}>
                  <CopyTextButton
                    textToCopy={nft.id?.toString()}
                    textToShow={nft.id?.toString()}
                    tooltip="Token ID"
                    copyIconPosition="right"
                  />
                </GridItem>

                {nft.owner && (
                  <>
                    <GridItem colSpan={4}>
                      <Heading size="label.md">Owner</Heading>
                    </GridItem>
                    <GridItem colSpan={8}>
                      <WalletAddress address={nft.owner} />
                    </GridItem>
                  </>
                )}
                <GridItem colSpan={4}>
                  <Heading size="label.md">Token Standard</Heading>
                </GridItem>
                <GridItem colSpan={8}>{nft.type}</GridItem>
                {nft.type !== "ERC721" && (
                  <>
                    <GridItem colSpan={4}>
                      <Heading size="label.md">Supply</Heading>
                    </GridItem>
                    <GridItem colSpan={8}>
                      <Text fontFamily="mono" size="body.md">
                        {nft.supply.toString()}
                      </Text>
                    </GridItem>
                  </>
                )}
                <GridItem colSpan={4}>
                  <Heading size="label.md">Token URI</Heading>
                </GridItem>
                <GridItem
                  colSpan={8}
                  className="flex flex-row items-center gap-1"
                >
                  <CopyTextButton
                    textToCopy={nft.tokenURI}
                    textToShow={shortenString(nft.tokenURI)}
                    tooltip="The URI of this NFT"
                    copyIconPosition="right"
                  />
                  {tokenURIHttpLink && (
                    <Button variant="ghost" size="sm">
                      <Link href={tokenURIHttpLink} target="_blank">
                        <ExternalLinkIcon className="size-4" />
                      </Link>
                    </Button>
                  )}
                </GridItem>
                {nft.metadata.image && (
                  <>
                    <GridItem colSpan={4}>
                      <Heading size="label.md">Media URI</Heading>
                    </GridItem>
                    <GridItem
                      colSpan={8}
                      className="flex flex-row items-center gap-1"
                    >
                      <CopyTextButton
                        textToCopy={nft.metadata.image}
                        textToShow={shortenString(nft.metadata.image)}
                        tooltip="The media URI of this NFT"
                        copyIconPosition="right"
                      />
                      {nftImageLink && (
                        <Button variant="ghost" size="sm">
                          <Link href={nftImageLink} target="_blank">
                            <ExternalLinkIcon className="size-4" />
                          </Link>
                        </Button>
                      )}
                    </GridItem>
                  </>
                )}
              </SimpleGrid>
            </Card>
            {properties ? (
              <Card as={Flex} flexDir="column" gap={4}>
                <Heading size="label.md">Attributes</Heading>
                {Array.isArray(properties) &&
                String(properties[0]?.value) !== "undefined" ? (
                  <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
                    {/* biome-ignore lint/suspicious/noExplicitAny: FIXME */}
                    {properties.map((property: any, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                      <NftProperty key={idx} property={property} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <CodeClient
                    code={JSON.stringify(properties, null, 2) || ""}
                    lang="json"
                  />
                )}
              </Card>
            ) : null}
          </Flex>
        )}
        {tabs.map((tb) => {
          return (
            tb.title === tab && (
              <Flex key={tb.title} px={0} w="full">
                {tb.children}
              </Flex>
            )
          );
        })}
      </Flex>
    </Flex>
  );
};

function NFTName(props: {
  value: unknown;
}) {
  if (typeof props.value === "string") {
    return (
      <h2 className="font-semibold text-lg tracking-tight"> {props.value}</h2>
    );
  }

  return (
    <UnexpectedValueErrorMessage
      title="Invalid Name"
      description="Name is not a string"
      value={props.value}
      className="mb-3 rounded-lg border border-border p-4"
    />
  );
}

function NFTDescription(props: {
  value: unknown;
}) {
  if (typeof props.value === "string") {
    return <p className="text-muted-foreground"> {props.value}</p>;
  }

  return (
    <UnexpectedValueErrorMessage
      title="Invalid Description"
      description="Description is not a string"
      value={props.value}
      className="mb-3 rounded-lg border border-border p-4"
    />
  );
}
