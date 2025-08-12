import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import type {
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { BuyDirectListingButton, useActiveAccount } from "thirdweb/react";
import { NFTMediaWithEmptyState } from "@/components/blocks/nft-media";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { CodeClient } from "@/components/ui/code/code.client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { CancelTab } from "./cancel-tab";
import { LISTING_STATUS } from "./types";

export function ListingDrawer(props: {
  contract: ThirdwebContract;
  isOpen: boolean;
  onClose: () => void;
  data: DirectListing | EnglishAuction;
  isLoggedIn: boolean;
}) {
  const { contract, isOpen, onClose, data, isLoggedIn } = props;
  const address = useActiveAccount()?.address;
  const isOwner = address?.toLowerCase() === data.creatorAddress.toLowerCase();
  const tokenId = data.asset.id.toString();

  return (
    <Sheet onOpenChange={onClose} open={isOpen}>
      <SheetContent className="!w-full !max-w-lg gap-0">
        <div className="space-y-4">
          <NFTMediaWithEmptyState
            client={contract.client}
            height="120px"
            metadata={data.asset.metadata}
            requireInteraction
            width="120px"
            className="border rounded-xl"
          />
          <div className="space-y-1">
            <p className="font-semibold text-2xl leading-tight">
              {data.asset.metadata.name}
            </p>
            {data.asset.metadata.description && (
              <p className="line-clamp-6 truncate text-sm text-muted-foreground">
                {data.asset.metadata.description}
              </p>
            )}
          </div>
        </div>

        <Table className="my-6 border-y border-dashed">
          <TableBody>
            {/* NFT contract address */}
            <TableRow className="border-dashed">
              <StyledTableHead>NFT contract address</StyledTableHead>
              <StyledTableCell>
                <CopyAddressButton
                  address={data.assetContractAddress}
                  copyIconPosition="right"
                />
              </StyledTableCell>
            </TableRow>

            {/* Token ID */}
            <TableRow className="border-dashed">
              <StyledTableHead>Token ID</StyledTableHead>
              <StyledTableCell>
                <CopyTextButton
                  copyIconPosition="right"
                  className="gap-4"
                  textToCopy={tokenId}
                  textToShow={tokenId}
                  tooltip="Token ID"
                />
              </StyledTableCell>
            </TableRow>

            {/* Seller */}
            <TableRow className="border-dashed">
              <StyledTableHead>Seller</StyledTableHead>
              <StyledTableCell>
                <WalletAddress
                  address={data.creatorAddress}
                  client={contract.client}
                  className="py-1 h-auto"
                />
              </StyledTableCell>
            </TableRow>

            {/* Listing ID */}
            <TableRow className="border-dashed">
              <StyledTableHead>Listing ID</StyledTableHead>
              <StyledTableCell>
                <CopyTextButton
                  className="gap-4"
                  copyIconPosition="right"
                  textToCopy={data.id.toString()}
                  textToShow={data.id.toString()}
                  tooltip="Listing ID"
                />
              </StyledTableCell>
            </TableRow>

            {/* Type */}
            <TableRow className="border-dashed">
              <StyledTableHead>Type</StyledTableHead>
              <StyledTableCell>{data.asset.type}</StyledTableCell>
            </TableRow>

            {/* Status */}
            <TableRow className="border-dashed">
              <StyledTableHead>Status</StyledTableHead>
              <StyledTableCell>
                <Badge className="uppercase">
                  {LISTING_STATUS[data.status]}
                </Badge>
              </StyledTableCell>
            </TableRow>

            {/* Quantity */}
            <TableRow className="border-dashed">
              <StyledTableHead>Quantity</StyledTableHead>
              <StyledTableCell>
                {(data.quantity || 0n).toString()}{" "}
                {/* For listings that are completed, the `quantity` would be `0`
                        So we show this text to make it clear */}
                {LISTING_STATUS[data.status] === "Completed"
                  ? "(Sold out)"
                  : ""}
              </StyledTableCell>
            </TableRow>

            {/* Price */}
            {data.type === "direct-listing" && (
              <TableRow className="border-dashed">
                <StyledTableHead>Price</StyledTableHead>
                <StyledTableCell>
                  {data.currencyValuePerToken.displayValue}{" "}
                  {data.currencyValuePerToken.symbol}
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {data?.asset.metadata.properties ? (
          <div className="space-y-1">
            <p className="font-bold">Attributes</p>
            <CodeClient
              code={
                JSON.stringify(data.asset.metadata.properties, null, 2) || ""
              }
              lang="json"
            />
          </div>
        ) : null}

        {isOwner && (
          <CancelTab
            contract={contract}
            id={data.id.toString()}
            isAuction={data.type === "english-auction"}
            isLoggedIn={isLoggedIn}
          />
        )}

        {!isOwner && data.status === "ACTIVE" && (
          <BuyDirectListingButton
            chain={contract.chain}
            className="w-full"
            client={contract.client}
            contractAddress={data.assetContractAddress}
            listingId={data.id}
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
            Buy NFT
          </BuyDirectListingButton>
        )}
      </SheetContent>
    </Sheet>
  );
}

function StyledTableHead({ children }: { children: React.ReactNode }) {
  return <TableHead className="px-0 py-3.5">{children}</TableHead>;
}

function StyledTableCell({ children }: { children: React.ReactNode }) {
  return <TableCell className="px-0 py-3.5">{children}</TableCell>;
}
