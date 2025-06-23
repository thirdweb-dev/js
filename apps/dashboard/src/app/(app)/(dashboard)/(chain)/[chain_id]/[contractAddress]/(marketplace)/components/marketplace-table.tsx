// biome-ignore-all lint/nursery/noNestedComponentDefinitions: TODO

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
import { WalletAddress } from "@/components/blocks/wallet-address";
import { MediaCell } from "@/components/contracts/media-cell";
import { Button } from "@/components/ui/button";
import { ListingDrawer } from "./listing-drawer";
import { LISTING_STATUS } from "./types";

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
  isLoggedIn: boolean;
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const MarketplaceTable: React.FC<MarketplaceTableProps> = ({
  contract,
  getAllQueryResult,
  getValidQueryResult,
  totalCountQuery,
  queryParams,
  setQueryParams,
  isLoggedIn,
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

  const tableColumns: Column<DirectListing | EnglishAuction>[] = useMemo(() => {
    return [
      {
        accessor: (row) => row.id.toString(),
        Header: "Listing Id",
      },
      {
        accessor: (row) => row.asset.metadata,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => <MediaCell cell={cell} client={contract.client} />,
        Header: "Media",
      },
      {
        accessor: (row) => row.asset.metadata.name ?? "N/A",
        Header: "Name",
      },
      {
        accessor: (row) => row.creatorAddress,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: ({ cell }: { cell: Cell<any, string> }) => (
          <WalletAddress address={cell.value} client={contract.client} />
        ),
        Header: "Creator",
      },
      {
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
        Header: "Price",
      },
      {
        accessor: (row) => LISTING_STATUS[row.status],
        Header: "Status",
      },
    ];
  }, [contract.client]);

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
        pageIndex: 0,
        pageSize: queryParams.count,
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
    setQueryParams({ count: pageSize, start: pageIndex * pageSize });
  }, [pageIndex, pageSize, setQueryParams]);

  const [tokenRow, setTokenRow] = useState<
    DirectListing | EnglishAuction | null
  >(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row">
        <Button
          className="w-18 rounded-r-none"
          onClick={() => setListingsToShow("all")}
          variant={listingsToShow === "all" ? "default" : "outline"}
        >
          All
        </Button>
        <Button
          className="rounded-l-none"
          onClick={() => setListingsToShow("valid")}
          variant={listingsToShow === "valid" ? "default" : "outline"}
        >
          Valid
        </Button>
      </div>
      <TableContainer className="relative" maxW="100%">
        {((listingsToShow === "all" && getAllQueryResult.isFetching) ||
          (listingsToShow === "valid" && getValidQueryResult.isFetching)) && (
          <Spinner
            color="primary"
            position="absolute"
            right={4}
            size="xs"
            top={2}
          />
        )}
        <ListingDrawer
          contract={contract}
          data={tokenRow}
          isLoggedIn={isLoggedIn}
          isOpen={!!tokenRow}
          onClose={() => setTokenRow(null)}
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
                <Th border="none" key="drawer" />
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} position="relative">
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  _last={{ borderBottomWidth: 0 }}
                  borderBottomWidth={1}
                  borderColor="borderColor"
                  className="hover:bg-card"
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  key={rowIndex}
                  onClick={() => setTokenRow(row.original)}
                  // biome-ignore lint/a11y/useSemanticElements: FIXME
                  role="group"
                  style={{ cursor: "pointer" }}
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
            aria-label="first page"
            icon={<ChevronFirstIcon className="size-4" />}
            isDisabled={!canPreviousPage || totalCountQuery.isPending}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            aria-label="previous page"
            icon={<ChevronLeftIcon className="size-4" />}
            isDisabled={!canPreviousPage || totalCountQuery.isPending}
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
            aria-label="next page"
            icon={<ChevronRightIcon className="size-4" />}
            isDisabled={!canNextPage || totalCountQuery.isPending}
            onClick={() => nextPage()}
          />
          <IconButton
            aria-label="last page"
            icon={<ChevronLastIcon className="size-4" />}
            isDisabled={!canNextPage || totalCountQuery.isPending}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            isDisabled={totalCountQuery.isPending}
            onChange={(e) => {
              setPageSize(Number.parseInt(e.target.value as string, 10));
            }}
            value={pageSize}
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
