import {
  Flex,
  SimpleGrid,
  GridItem,
  useBreakpointValue,
  Icon,
  IconButton,
  Box,
  ButtonGroup,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { Heading, Badge, Card, CodeBlock, Text, Button } from "tw-components";
import { NFT } from "@thirdweb-dev/sdk";
import { NFTDrawerTab } from "core-ui/nft-drawer/types";
import { NftProperty } from "./nft-property";
import { useRouter } from "next/router";
import { IoChevronBack } from "react-icons/io5";
import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useState } from "react";

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
  nft: NFT | undefined;
  tabs: NFTDrawerTab[];
  contractAddress: string | undefined;
}

export const TokenIdPage: React.FC<TokenIdPageProps> = ({
  nft,
  tabs,
  contractAddress,
}) => {
  const [tab, setTab] = useState("Details");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const chainId = useDashboardEVMChainId();
  const url = `/${chainId}/${contractAddress}/nfts`;
  if (!nft) {
    return null;
  }

  // in the case we have an invalud url, we want to remove it
  if (!isValidUrl(nft.metadata.animation_url)) {
    nft.metadata.animation_url = undefined;
  }

  const properties = nft.metadata.attributes || nft.metadata.properties;

  return (
    <Flex flexDir={{ base: "column", md: "row" }} gap={6}>
      <Card h="full" position="relative" minH="100px">
        <Box w="50px" position="absolute" zIndex={1000} top={6} left={6}>
          <Card p={1} bgColor="backgroundCardHighlight">
            <IconButton
              w="inherit"
              variant="ghost"
              onClick={() =>
                router.asPath !== "/" ? router.push(url) : router.back()
              }
              aria-label="Back"
              icon={<Icon as={IoChevronBack} boxSize={6} />}
            >
              Back
            </IconButton>
          </Card>
        </Box>
        <NFTMediaWithEmptyState
          metadata={nft.metadata}
          width={isMobile ? "100%" : "350px"}
          height={isMobile ? "100%" : "350px"}
        />
      </Card>
      <Flex flexDir="column" gap={6} w="full" px={2}>
        <Flex flexDir="column" gap={2}>
          <Heading size="title.lg">{nft.metadata.name}</Heading>
          {nft.metadata?.description && (
            <Text size="label.md" noOfLines={6}>
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
                  boxShadow={"none"}
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
                    address={nft.metadata.id}
                    title="Token ID"
                  />
                </GridItem>

                {nft.type !== "ERC1155" && BigNumber.from(nft.supply).lt(2) && (
                  <>
                    <GridItem colSpan={4}>
                      <Heading size="label.md">Owner</Heading>
                    </GridItem>
                    <GridItem colSpan={8}>
                      <AddressCopyButton size="xs" address={nft.owner} />
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
                        {nft.supply}
                      </Text>
                    </GridItem>
                  </>
                )}
              </SimpleGrid>
            </Card>
            {properties ? (
              <Card as={Flex} flexDir="column" gap={4}>
                <Heading size="label.md">Properties</Heading>
                {Array.isArray(properties) &&
                String(properties[0]?.value) !== "undefined" ? (
                  <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
                    {properties.map((property: any, idx) => (
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
