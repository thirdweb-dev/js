import { MarketplaceActionsCell } from "./actions/MarketplaceActionsCell";
import { Image, Text } from "@chakra-ui/react";
import { AuctionListing, DirectListing, ListingType } from "@thirdweb-dev/sdk";
import { AddressCopyButton } from "components/web3/AddressCopyButton";
import React from "react";
import { Cell, Column } from "react-table";

type ListingMetadata = AuctionListing | DirectListing;

export function generateMarketplaceTableColumns() {
  return [
    {
      Header: "ID",
      accessor: (row) => row.id,
    },
    {
      Header: "Image",
      accessor: (row) =>
        row.asset?.image?.replace(
          "ipfs://",
          "https://cloudflare-ipfs.com/ipfs/",
        ),
      Cell: ({ cell: { value } }: { cell: { value?: string } }) =>
        value ? (
          <Image
            flexShrink={0}
            boxSize={24}
            objectFit="contain"
            src={value}
            alt=""
          />
        ) : null,
    },
    { Header: "Name", accessor: (row) => row.asset?.name },
    {
      Header: "Seller",
      accessor: (row) => row.sellerAddress,
      Cell: ({ cell }: { cell: Cell<ListingMetadata, string> }) => (
        <AddressCopyButton variant="outline" address={cell.value} />
      ),
    },
    {
      Header: "Price",
      accessor: (row) => row.buyoutCurrencyValuePerToken,
      Cell: ({ cell }: { cell: Cell<ListingMetadata, any> }) => {
        return (
          <Text size="label.md" whiteSpace="nowrap">
            {cell.value.displayValue} {cell.value.symbol}
          </Text>
        );
      },
    },
    {
      Header: "Type",
      accessor: (row) =>
        row.type === ListingType.Direct ? "Direct Listing" : "Auction",
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: MarketplaceActionsCell,
    },
  ] as Column<DirectListing | AuctionListing>[];
}
