import { WalletAddress } from "@/components/blocks/wallet-address";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import type {
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import { Badge, Card, CodeBlock, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { CancelDirectListing } from "../direct-listings/components/cancel";
import { CancelEnglishAuction } from "../english-auctions/components/cancel";
import { LISTING_STATUS } from "./types";

interface NFTDrawerProps {
  contract: ThirdwebContract;
  isOpen: boolean;
  onClose: () => void;
  data: DirectListing | EnglishAuction | null;
  type: "direct-listings" | "english-auctions";
}

export const ListingDrawer: React.FC<NFTDrawerProps> = ({
  contract,
  isOpen,
  onClose,
  data,
  type,
}) => {
  const address = useActiveAccount()?.address;
  const prevData = usePrevious(data);

  const renderData = data || prevData;
  const isOwner = address === renderData?.creatorAddress;

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
                  <Heading size="label.md">Asset contract address</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <AddressCopyButton
                    size="xs"
                    address={renderData.assetContractAddress}
                    title="contract address"
                  />
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Token ID</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <AddressCopyButton
                    size="xs"
                    address={tokenId}
                    title="Token ID"
                  />
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Seller</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <WalletAddress address={renderData.creatorAddress} />
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Listing ID</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <AddressCopyButton
                    size="xs"
                    title="listing ID"
                    address={renderData.id.toString()}
                  />
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Type</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <Text fontFamily="mono" size="body.md">
                    {renderData.asset.type}
                  </Text>
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Status</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <Badge
                    size="label.sm"
                    variant="subtle"
                    textTransform="capitalize"
                  >
                    {LISTING_STATUS[renderData.status]}
                  </Badge>
                </GridItem>
                <GridItem colSpan={3}>
                  <Heading size="label.md">Quantity</Heading>
                </GridItem>
                <GridItem colSpan={9}>
                  <Text fontFamily="mono" size="body.md">
                    {(renderData.quantity || 0n).toString()}{" "}
                    {/* For listings that are completed, the `quantity` would be `0`
                    So we show this text to make it clear */}
                    {LISTING_STATUS[renderData.status] === "Completed"
                      ? "(Sold out)"
                      : ""}
                  </Text>
                </GridItem>

                {renderData.type === "direct-listing" && (
                  <>
                    <GridItem colSpan={3}>
                      <Heading size="label.md">Price</Heading>
                    </GridItem>
                    <GridItem colSpan={9}>
                      <Text fontFamily="mono" size="body.md">
                        {renderData.currencyValuePerToken.displayValue}{" "}
                        {renderData.currencyValuePerToken.symbol}
                      </Text>
                    </GridItem>
                  </>
                )}

                {/*
                  Todo: Add a Buy button somewhere in this section once the Dashboard is fully migrated to v5 (?)
                  Kien already shipped a prebuilt component for the Marketplace Buy Button in SDK v5
                */}
              </SimpleGrid>
            </Card>
            {data?.asset.metadata.properties ? (
              <Card as={Flex} flexDir="column" gap={4}>
                <Heading size="label.md">Attributes</Heading>
                <CodeBlock
                  code={
                    JSON.stringify(data.asset.metadata.properties, null, 2) ||
                    ""
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
        children: () =>
          type === "direct-listings" ? (
            <CancelDirectListing
              contract={contract}
              listingId={renderData.id.toString()}
            />
          ) : (
            <CancelEnglishAuction
              contract={contract}
              auctionId={renderData.id.toString()}
            />
          ),
      },
    ];

    return t;
  }, [
    renderData,
    isOwner,
    tokenId,
    data?.asset.metadata.properties,
    type,
    contract,
  ]);

  if (!renderData) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col gap-6 py-6 md:min-w-[600px]">
        <Flex gap={6}>
          <NFTMediaWithEmptyState
            metadata={renderData.asset.metadata}
            requireInteraction
            width="150px"
            height="150px"
          />
          <Flex flexDir="column" gap={2} w="70%">
            <Heading size="title.lg">{renderData.asset.metadata.name}</Heading>
            <Text size="label.md" noOfLines={6}>
              {renderData.asset.metadata.name}
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
      </SheetContent>
    </Sheet>
  );
};
