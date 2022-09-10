import { MarketplaceActionsCell } from "./actions/MarketplaceActionsCell";
import { MediaCell } from "./cells/media-cell";
import { AuctionListing, DirectListing, ListingType } from "@thirdweb-dev/sdk";
import { Cell, Column } from "react-table";
import { AddressCopyButton, Text } from "tw-components";

type ListingMetadata = AuctionListing | DirectListing;

export function generateMarketplaceTableColumns() {
  return [
    {
      Header: "ID",
      accessor: (row) => row.id,
    },
    {
      Header: "Media",
      accessor: (row) => row.asset,
      Cell: MediaCell,
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
