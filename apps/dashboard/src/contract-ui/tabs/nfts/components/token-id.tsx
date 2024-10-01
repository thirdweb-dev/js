"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import {
  Box,
  ButtonGroup,
  Divider,
  Flex,
  GridItem,
  Icon,
  IconButton,
  SimpleGrid,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNFTDrawerTabs } from "core-ui/nft-drawer/useNftDrawerTabs";
import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import type { ThirdwebContract } from "thirdweb";
import { getNFT as getErc721NFT } from "thirdweb/extensions/erc721";
import { getNFT as getErc1155NFT } from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { Badge, Button, Card, CodeBlock, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { useChainSlug } from "../../../../hooks/chains/chainSlug";
import { NftProperty } from "./nft-property";

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

  const { data: nft, isPending } = useReadContract(
    isErc721 ? getErc721NFT : getErc1155NFT,
    {
      contract,
      tokenId: BigInt(tokenId || 0),
      includeOwner: true,
    },
  );

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
              icon={<Icon as={IoChevronBack} boxSize={6} />}
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
        <Flex flexDir="column" gap={2}>
          <Heading size="title.lg">{nft.metadata.name}</Heading>
          {nft.metadata?.description && (
            <Text size="label.md" noOfLines={50} whiteSpace="pre-wrap">
              {nft.metadata.description}
            </Text>
          )}
        </Flex>
        <Flex flexDir="column" gap={{ base: 0, md: 4 }}>
          <Box
            w="full"
            overflow={{ base: "auto", md: "hidden" }}
            pb={{ base: 4, md: 0 }}
          >
            <ButtonGroup
              size="sm"
              variant="ghost"
              spacing={2}
              w={(tabs.length + 1) * 95}
            >
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
                  <AddressCopyButton
                    size="xs"
                    address={nft.id?.toString()}
                    title="Token ID"
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
                <GridItem colSpan={8}>
                  <Badge size="label.sm" variant="subtle">
                    {nft.type}
                  </Badge>
                </GridItem>
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
                  <CodeBlock
                    code={JSON.stringify(properties, null, 2) || ""}
                    language="json"
                    canCopy={false}
                    wrap={false}
                    overflow="auto"
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
