import { CancelTab } from "./cancel-tab";
import {
  Flex,
  GridItem,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  usePrevious,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import type {
  AuctionListing,
  DirectListing,
  Marketplace,
} from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { Badge, Card, CodeBlock, Drawer, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";

interface NFTDrawerProps {
  contract: Marketplace;
  isOpen: boolean;
  onClose: () => void;
  data: AuctionListing | DirectListing | null;
}
export const ListingDrawer: React.FC<NFTDrawerProps> = ({
  isOpen,
  onClose,
  data,
  contract,
}) => {
  const address = useAddress();
  const prevData = usePrevious(data);

  const renderData = data || prevData;
  const isOwner = address === renderData?.sellerAddress;

  const tokenId = renderData?.asset.id.toString() || "";

  const tabs = useMemo(() => {
    if (!renderData) {
      return [];
    }
    const t = [
      {
        title: "Details",
        isDisabled: false,
        children: () => (
          <Flex flexDir="column" gap={4}>
            <Card as={Flex} flexDir="column" gap={3}>
              <SimpleGrid rowGap={3} columns={12} placeItems="center left">
                <GridItem colSpan={3}>
                  <Heading size="label.md">Token ID</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <AddressCopyButton size="xs" address={tokenId} tokenId />
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Seller</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <AddressCopyButton
                    size="xs"
                    address={renderData.sellerAddress}
                  />
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Listing Type</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <Badge
                    size="label.sm"
                    variant="subtle"
                    textTransform="capitalize"
                  >
                    {renderData?.type === 0 ? "Direct Listing" : "Auction"}
                  </Badge>
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Quantity</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <Text fontFamily="mono" size="body.md">
                    {BigNumber.from(renderData.quantity || "0").toString()}
                  </Text>
                </GridItem>
              </SimpleGrid>
            </Card>
            {data?.asset.attributes || data?.asset.properties ? (
              <Card as={Flex} flexDir="column" gap={4}>
                <Heading size="label.md">Properties</Heading>
                <CodeBlock
                  code={
                    JSON.stringify(
                      data?.asset.attributes || data?.asset.properties,
                      null,
                      2,
                    ) || ""
                  }
                  language="json"
                  canCopy={false}
                  wrap={false}
                  overflow="auto"
                />
              </Card>
            ) : null}
          </Flex>
        ),
      },
      {
        title: "Cancel Listing",
        isDisabled: !isOwner,
        children: () => (
          <CancelTab
            contract={contract}
            listingId={renderData.id}
            listingType={renderData.type}
          />
        ),
      },
    ];

    return t;
  }, [contract, isOwner, renderData, tokenId, data?.asset]);

  if (!renderData) {
    return null;
  }

  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="xl"
      onClose={onClose}
      isOpen={isOpen}
    >
      <Flex py={6} px={2} flexDir="column" gap={6}>
        <Flex gap={6}>
          <NFTMediaWithEmptyState
            metadata={renderData.asset}
            requireInteraction
            width="150px"
            height="150px"
          />
          <Flex flexDir="column" gap={2} w="70%">
            <Heading size="title.lg">{renderData.asset.name}</Heading>
            <Text size="label.md" noOfLines={6}>
              {renderData.asset.description}
            </Text>
          </Flex>
        </Flex>

        <Tabs isLazy lazyBehavior="keepMounted" colorScheme="gray">
          <TabList
            px={0}
            borderBottomColor="borderColor"
            borderBottomWidth="1px"
            overflowX={{ base: "auto", md: "inherit" }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.title} gap={2} isDisabled={tab.isDisabled}>
                {tab.title}
              </Tab>
            ))}
          </TabList>
          <TabPanels px={0} py={2}>
            {tabs.map((tab) => {
              return (
                <TabPanel key={tab.title} px={0}>
                  {tab.children()}
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Flex>
    </Drawer>
  );
};
