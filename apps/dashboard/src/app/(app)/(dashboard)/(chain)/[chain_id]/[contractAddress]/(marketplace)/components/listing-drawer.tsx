import { Flex, GridItem, SimpleGrid, usePrevious } from "@chakra-ui/react";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import type {
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { BuyDirectListingButton, useActiveAccount } from "thirdweb/react";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card } from "@/components/ui/card";
import { CodeClient } from "@/components/ui/code/code.client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CancelTab } from "./cancel-tab";
import { LISTING_STATUS } from "./types";

interface NFTDrawerProps {
  contract: ThirdwebContract;
  isOpen: boolean;
  onClose: () => void;
  data: DirectListing | EnglishAuction | null;
  isLoggedIn: boolean;
}

export const ListingDrawer: React.FC<NFTDrawerProps> = ({
  contract,
  isOpen,
  onClose,
  data,
  isLoggedIn,
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
    <Sheet onOpenChange={onClose} open={isOpen}>
      <SheetContent className="flex w-full flex-col gap-6 py-6 md:min-w-[600px]">
        <div className="flex flex-row gap-6">
          <NFTMediaWithEmptyState
            client={contract.client}
            height="150px"
            metadata={renderData.asset.metadata}
            requireInteraction
            width="150px"
          />
          <Flex flexDir="column" gap={2} w="70%">
            <p className="font-bold text-lg">
              {renderData.asset.metadata.name}
            </p>
            <p className="line-clamp-6 truncate text-base leading-normal">
              {renderData.asset.metadata.name}
            </p>
          </Flex>
        </div>

        <Flex flexDir="column" gap={4}>
          <Card className="flex flex-col gap-3 p-4">
            <SimpleGrid columns={12} placeItems="center left" rowGap={3}>
              <GridItem colSpan={3}>
                <p className="font-bold">Asset contract address</p>
              </GridItem>
              <GridItem colSpan={9}>
                <CopyAddressButton
                  address={renderData.assetContractAddress}
                  copyIconPosition="right"
                />
              </GridItem>
              <GridItem colSpan={3}>
                <p className="font-bold">Token ID</p>
              </GridItem>
              <GridItem colSpan={9}>
                <CopyTextButton
                  copyIconPosition="right"
                  textToCopy={tokenId}
                  textToShow={tokenId}
                  tooltip="Token ID"
                />
              </GridItem>
              <GridItem colSpan={3}>
                <p className="font-bold">Seller</p>
              </GridItem>
              <GridItem colSpan={9}>
                <WalletAddress
                  address={renderData.creatorAddress}
                  client={contract.client}
                />
              </GridItem>
              <GridItem colSpan={3}>
                <p className="font-bold">Listing ID</p>
              </GridItem>
              <GridItem colSpan={9}>
                <CopyTextButton
                  copyIconPosition="right"
                  textToCopy={renderData.id.toString()}
                  textToShow={renderData.id.toString()}
                  tooltip="Listing ID"
                />
              </GridItem>
              <GridItem colSpan={3}>
                <p className="font-bold">Type</p>
              </GridItem>
              <GridItem colSpan={9}>{renderData.asset.type}</GridItem>
              <GridItem colSpan={3}>
                <p className="font-bold">Status</p>
              </GridItem>
              <GridItem colSpan={9}>
                <Badge className="uppercase">
                  {LISTING_STATUS[renderData.status]}
                </Badge>
              </GridItem>
              <GridItem colSpan={3}>
                <p className="font-bold">Quantity</p>
              </GridItem>
              <GridItem colSpan={9}>
                {(renderData.quantity || 0n).toString()}{" "}
                {/* For listings that are completed, the `quantity` would be `0`
                    So we show this text to make it clear */}
                {LISTING_STATUS[renderData.status] === "Completed"
                  ? "(Sold out)"
                  : ""}
              </GridItem>

              {renderData.type === "direct-listing" && (
                <>
                  <GridItem colSpan={3}>
                    <p className="font-bold">Price</p>
                  </GridItem>
                  <GridItem colSpan={9}>
                    {renderData.currencyValuePerToken.displayValue}{" "}
                    {renderData.currencyValuePerToken.symbol}
                  </GridItem>
                </>
              )}
            </SimpleGrid>
          </Card>
          {data?.asset.metadata.properties ? (
            <Card className="flex flex-col gap-3 p-4">
              <p className="font-bold">Attributes</p>
              <CodeClient
                code={
                  JSON.stringify(data.asset.metadata.properties, null, 2) || ""
                }
                lang="json"
              />
            </Card>
          ) : null}
        </Flex>
        {isOwner && (
          <CancelTab
            contract={contract}
            id={renderData.id.toString()}
            isAuction={renderData.type === "english-auction"}
            isLoggedIn={isLoggedIn}
          />
        )}

        {!isOwner && renderData.status === "ACTIVE" && (
          <BuyDirectListingButton
            chain={contract.chain}
            className="w-full"
            client={contract.client}
            contractAddress={renderData.assetContractAddress}
            listingId={renderData.id}
            onError={(error) => {
              toast.error("Failed to buy listing", {
                description: error.message,
              });
            }}
            onTransactionConfirmed={() => {
              toast.success("Listing bought successfully");
            }}
            quantity={1n}
          >
            Buy Listing
          </BuyDirectListingButton>
        )}
      </SheetContent>
    </Sheet>
  );
};
