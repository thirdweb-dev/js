import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Flex, GridItem, SimpleGrid, usePrevious } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import type {
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import { Badge, Card, CodeBlock, Heading, Text } from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { CancelTab } from "./cancel-tab";
import { LISTING_STATUS } from "./types";

interface NFTDrawerProps {
  contract: ThirdwebContract;
  isOpen: boolean;
  onClose: () => void;
  data: DirectListing | EnglishAuction | null;
}

export const ListingDrawer: React.FC<NFTDrawerProps> = ({
  contract,
  isOpen,
  onClose,
  data,
}) => {
  const address = useActiveAccount()?.address;
  const prevData = usePrevious(data);

  const renderData = data || prevData;
  const isOwner =
    address?.toLowerCase() === renderData?.creatorAddress.toLowerCase();

  const tokenId = renderData?.asset.id.toString() || "";

  if (!renderData) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col gap-6 py-6 md:min-w-[600px]">
        <div className="flex flex-row gap-6">
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
        </div>

        <Flex flexDir="column" gap={4}>
          <Card as={Flex} flexDir="column" gap={3}>
            <SimpleGrid rowGap={3} columns={12} placeItems="center left">
              <GridItem colSpan={3}>
                <Heading size="label.md">Asset contract address</Heading>
              </GridItem>
              <GridItem colSpan={9}>
                <CopyAddressButton
                  address={renderData.assetContractAddress}
                  copyIconPosition="right"
                />
              </GridItem>
              <GridItem colSpan={3}>
                <Heading size="label.md">Token ID</Heading>
              </GridItem>
              <GridItem colSpan={9}>
                <CopyTextButton
                  textToCopy={tokenId}
                  textToShow={tokenId}
                  copyIconPosition="right"
                  tooltip="Token ID"
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
                <CopyTextButton
                  textToCopy={renderData.id.toString()}
                  textToShow={renderData.id.toString()}
                  copyIconPosition="right"
                  tooltip="Listing ID"
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
                  JSON.stringify(data.asset.metadata.properties, null, 2) || ""
                }
                language="json"
                canCopy={false}
                wrap={false}
                overflow="auto"
              />
            </Card>
          ) : null}
        </Flex>
        {isOwner && (
          <CancelTab
            contract={contract}
            id={renderData.id.toString()}
            isAuction={renderData.type === "english-auction"}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
