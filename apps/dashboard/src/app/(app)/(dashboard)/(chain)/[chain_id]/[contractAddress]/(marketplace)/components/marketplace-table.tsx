import type { UseQueryResult } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import type {
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { min } from "thirdweb/utils";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { MediaCell } from "@/components/contracts/media-cell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListingDrawer } from "./listing-drawer";
import { LISTING_STATUS } from "./types";

export function MarketplaceTable(props: {
  contract: ThirdwebContract;
  getAllQueryResult: UseQueryResult<DirectListing[] | EnglishAuction[]>;
  getValidQueryResult: UseQueryResult<DirectListing[] | EnglishAuction[]>;
  totalCountQuery: UseQueryResult<bigint>;
  queryParams: {
    count: number;
    start: number;
  };
  setQueryParams: Dispatch<
    SetStateAction<{
      count: number;
      start: number;
    }>
  >;
  isLoggedIn: boolean;
  title: string;
  cta: React.ReactNode;
}) {
  const {
    contract,
    getAllQueryResult,
    getValidQueryResult,
    totalCountQuery,
    queryParams,
    setQueryParams,
    isLoggedIn,
    cta,
    title,
  } = props;

  const [listingsToShow, setListingsToShow_] = useState<"all" | "valid">("all");

  const setListingsToShow = (value: "all" | "valid") => {
    setQueryParams({ count: 50, start: 0 });
    setListingsToShow_(value);
  };

  const renderData = useMemo(() => {
    if (listingsToShow === "all") {
      return getAllQueryResult?.data;
    }
    return getValidQueryResult?.data;
  }, [getAllQueryResult, getValidQueryResult, listingsToShow]);

  const pageSize = queryParams.count;
  const currentPage = Math.floor(queryParams.start / pageSize) + 1; // PaginationButtons uses 1-based indexing
  const totalCount = Number(
    min(totalCountQuery.data || 0n, BigInt(Number.MAX_SAFE_INTEGER)),
  );
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const showPagination = totalPages > 1;

  // Pagination handler for PaginationButtons
  const handlePageChange = (page: number) => {
    setQueryParams({ count: pageSize, start: (page - 1) * pageSize });
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedToken, setSelectedToken] = useState<
    DirectListing | EnglishAuction | null
  >(null);

  const isFetching =
    (listingsToShow === "all" && getAllQueryResult.isFetching) ||
    (listingsToShow === "valid" && getValidQueryResult.isFetching);

  return (
    <div>
      <div className="flex justify-between flex-col lg:flex-row gap-3 items-end">
        <h2 className="font-semibold text-2xl tracking-tight">{title}</h2>
        <div className="flex gap-4">
          <div className="flex flex-row">
            <Button
              size="sm"
              className="rounded-r-none"
              onClick={() => setListingsToShow("all")}
              variant={listingsToShow === "all" ? "default" : "outline"}
            >
              All
            </Button>
            <Button
              size="sm"
              className="rounded-l-none"
              onClick={() => setListingsToShow("valid")}
              variant={listingsToShow === "valid" ? "default" : "outline"}
            >
              Valid
            </Button>
          </div>
          {cta}
        </div>
      </div>

      <div className="h-4" />

      <TableContainer>
        {renderData?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">No listings found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <p className="text-muted-foreground">Listing Id</p>
                </TableHead>
                <TableHead>
                  <p className="text-muted-foreground">Media</p>
                </TableHead>
                <TableHead>
                  <p className="text-muted-foreground">Name</p>
                </TableHead>
                <TableHead>
                  <p className="text-muted-foreground">Creator</p>
                </TableHead>
                <TableHead>
                  <p className="text-muted-foreground">Price</p>
                </TableHead>
                <TableHead>
                  <p className="text-muted-foreground">Status</p>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching &&
                Array.from({ length: 5 }).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ok
                  <SkeletonRow key={index} />
                ))}

              {!isFetching &&
                renderData?.map((row, _rowIndex) => (
                  <TableRow
                    key={row.id.toString()}
                    className="hover:bg-accent/50 cursor-pointer"
                    onClick={() => {
                      setSelectedToken(row);
                      setIsDrawerOpen(true);
                    }}
                  >
                    <TableCell>{row.id.toString()}</TableCell>
                    <TableCell>
                      <MediaCell
                        cell={{ value: row.asset.metadata }}
                        client={contract.client}
                      />
                    </TableCell>
                    <TableCell>{row.asset.metadata.name ?? "N/A"}</TableCell>
                    <TableCell>
                      <WalletAddress
                        address={row.creatorAddress}
                        client={contract.client}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="whitespace-nowrap text-foreground">
                        {(row as DirectListing)?.currencyValuePerToken
                          ?.displayValue ||
                          (row as EnglishAuction)?.buyoutCurrencyValue
                            ?.displayValue ||
                          "N/A"}{" "}
                        {(row as DirectListing)?.currencyValuePerToken
                          ?.symbol ||
                          (row as EnglishAuction)?.buyoutCurrencyValue
                            ?.symbol ||
                          ""}
                      </p>
                    </TableCell>
                    <TableCell>{LISTING_STATUS[row.status]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {showPagination && (
        <PaginationButtons
          activePage={currentPage}
          totalPages={totalPages}
          onPageClick={handlePageChange}
        />
      )}

      {selectedToken && (
        <ListingDrawer
          contract={contract}
          data={selectedToken}
          isLoggedIn={isLoggedIn}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      {/* listing id */}
      <TableCell>
        <Skeleton className="h-6 w-10" />
      </TableCell>
      {/* media */}
      <TableCell>
        <Skeleton className="size-[120px]" />
      </TableCell>
      {/* name */}
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      {/* creator */}
      <TableCell>
        <Skeleton className="h-6 w-40" />
      </TableCell>
      {/* price */}
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      {/* status */}
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
    </TableRow>
  );
}
