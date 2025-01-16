import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import {
  IconButton,
  Select,
  Skeleton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  usePrevious,
} from "@chakra-ui/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoveRightIcon,
} from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Cell, type Column, usePagination, useTable } from "react-table";
import type { ThirdwebContract } from "thirdweb";
import type {
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { min } from "thirdweb/utils";
import { ListingDrawer } from "./listing-drawer";
import { LISTING_STATUS } from "./types";

const tableColumns: Column<DirectListing | EnglishAuction>[] = [
  {
    Header: "Listing Id",
    accessor: (row) => row.id.toString(),
  },
  {
    Header: "Media",
    accessor: (row) => row.asset.metadata,
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    Cell: (cell: any) => <MediaCell cell={cell} />,
  },
  {
    Header: "Name",
    accessor: (row) => row.asset.metadata.name ?? "N/A",
  },
  {
    Header: "Creator",
    accessor: (row) => row.creatorAddress,
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    Cell: ({ cell }: { cell: Cell<any, string> }) => (
      <WalletAddress address={cell.value} />
    ),
  },
  {
    Header: "Price",
    accessor: (row) =>
      (row as DirectListing)?.currencyValuePerToken ||
      (row as EnglishAuction)?.buyoutCurrencyValue,
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    Cell: ({ cell }: { cell: Cell<any, any> }) => {
      return (
        <p className="whitespace-nowrap text-muted-foreground">
          {cell.value.displayValue} {cell.value.symbol}
        </p>
      );
    },
  },
  {
    Header: "Status",
    accessor: (row) => LISTING_STATUS[row.status],
  },
];

interface MarketplaceTableProps {
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
  twAccount: Account | undefined;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const MarketplaceTable: React.FC<MarketplaceTableProps> = ({
  contract,
  getAllQueryResult,
  getValidQueryResult,
  totalCountQuery,
  queryParams,
  setQueryParams,
  twAccount,
}) => {
  const [listingsToShow, setListingsToShow_] = useState<"all" | "valid">("all");

  const setListingsToShow = (value: "all" | "valid") => {
    setQueryParams(DEFAULT_QUERY_STATE);
    setListingsToShow_(value);
  };

  const prevData = usePrevious(
    listingsToShow === "all"
      ? getAllQueryResult?.data
      : getValidQueryResult?.data,
  );

  const renderData = useMemo(() => {
    if (listingsToShow === "all") {
      return getAllQueryResult?.data || prevData;
    }
    return getValidQueryResult?.data || prevData;
  }, [getAllQueryResult, getValidQueryResult, listingsToShow, prevData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      data: (renderData as any) || [],
      initialState: {
        pageSize: queryParams.count,
        pageIndex: 0,
      },
      manualPagination: true,
      pageCount: Math.max(
        Math.ceil(
          Number(
            // To avoid overflow issue
            min(totalCountQuery.data || 0n, BigInt(Number.MAX_SAFE_INTEGER)),
          ) / queryParams.count,
        ),
        1,
      ),
    },
    // FIXME: re-work tables and pagination with @tanstack/table@latest - which (I believe) does not need this workaround anymore
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );

  // FIXME: re-work tables and pagination with @tanstack/table@latest - which (I believe) does not need this workaround anymore
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setQueryParams({ start: pageIndex * pageSize, count: pageSize });
  }, [pageIndex, pageSize, setQueryParams]);

  const [tokenRow, setTokenRow] = useState<
    DirectListing | EnglishAuction | null
  >(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row">
        <Button
          onClick={() => setListingsToShow("all")}
          variant={listingsToShow === "all" ? "default" : "outline"}
          className="w-18 rounded-r-none"
        >
          All
        </Button>
        <Button
          onClick={() => setListingsToShow("valid")}
          variant={listingsToShow === "valid" ? "default" : "outline"}
          className="rounded-l-none"
        >
          Valid
        </Button>
      </div>
      <TableContainer maxW="100%" className="relative">
        {((listingsToShow === "all" && getAllQueryResult.isFetching) ||
          (listingsToShow === "valid" && getValidQueryResult.isFetching)) && (
          <Spinner
            color="primary"
            size="xs"
            position="absolute"
            top={2}
            right={4}
          />
        )}
        <ListingDrawer
          contract={contract}
          data={tokenRow}
          isOpen={!!tokenRow}
          onClose={() => setTokenRow(null)}
          twAccount={twAccount}
        />
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <Th
                    {...column.getHeaderProps()}
                    border="none"
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    key={columnIndex}
                  >
                    <p className="text-muted-foreground">
                      {column.render("Header")}
                    </p>
                  </Th>
                ))}
                {/* // Need to add an empty header for the drawer button */}
                <Th border="none" />
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} position="relative">
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  role="group"
                  className="hover:bg-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => setTokenRow(row.original)}
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                  borderColor="borderColor"
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  key={rowIndex}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <Td
                      {...cell.getCellProps()}
                      borderBottomWidth="inherit"
                      borderColor="borderColor"
                      // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                      key={cellIndex}
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                  <Td borderBottomWidth="inherit" borderColor="borderColor">
                    <MoveRightIcon className="size-3" />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-row items-center gap-2">
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isPending}
            aria-label="first page"
            icon={<ChevronFirstIcon className="size-4" />}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isPending}
            aria-label="previous page"
            icon={<ChevronLeftIcon className="size-4" />}
            onClick={() => previousPage()}
          />
          <p className="whitespace-nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton
              as="span"
              display="inline"
              isLoaded={totalCountQuery.isSuccess}
            >
              <strong>{pageCount}</strong>
            </Skeleton>
          </p>
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isPending}
            aria-label="next page"
            icon={<ChevronRightIcon className="size-4" />}
            onClick={() => nextPage()}
          />
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isPending}
            aria-label="last page"
            icon={<ChevronLastIcon className="size-4" />}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            onChange={(e) => {
              setPageSize(Number.parseInt(e.target.value as string, 10));
            }}
            value={pageSize}
            isDisabled={totalCountQuery.isPending}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </Select>
        </div>
      </div>
    </div>
  );
};
