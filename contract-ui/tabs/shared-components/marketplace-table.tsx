import { LISTING_STATUS } from "./types";
import {
  ButtonGroup,
  Center,
  Flex,
  Icon,
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
import { UseQueryResult } from "@tanstack/react-query";
import type {
  DirectListingV3,
  EnglishAuction,
  MarketplaceV3,
} from "@thirdweb-dev/sdk";
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import { ListingDrawer } from "contract-ui/tabs/shared-components/listing-drawer";
import { BigNumber } from "ethers";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { Cell, Column, usePagination, useTable } from "react-table";
import { Button, Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

const tableColumns: Column<DirectListingV3 | EnglishAuction>[] = [
  {
    Header: "Listing Id",
    accessor: (row) => row.id.toString(),
  },
  {
    Header: "Media",
    accessor: (row) => row.asset,
    Cell: (cell: any) => <MediaCell cell={cell} />,
  },
  {
    Header: "Name",
    accessor: (row) => row.asset?.name,
  },
  {
    Header: "Creator",
    accessor: (row) => row.creatorAddress,
    Cell: ({ cell }: { cell: Cell<any, string> }) => (
      <AddressCopyButton variant="outline" address={cell.value} />
    ),
  },
  {
    Header: "Price",
    accessor: (row) =>
      (row as DirectListingV3)?.currencyValuePerToken ||
      (row as EnglishAuction)?.buyoutCurrencyValue,
    Cell: ({ cell }: { cell: Cell<any, any> }) => {
      return (
        <Text size="label.md" whiteSpace="nowrap">
          {cell.value.displayValue} {cell.value.symbol}
        </Text>
      );
    },
  },
  {
    Header: "Status",
    accessor: (row) => LISTING_STATUS[row.status],
  },
];

interface MarketplaceTableProps {
  contract: MarketplaceV3;
  getAllQueryResult: UseQueryResult<
    DirectListingV3[] | EnglishAuction[],
    unknown
  >;
  getValidQueryResult: UseQueryResult<
    DirectListingV3[] | EnglishAuction[],
    unknown
  >;
  totalCountQuery: UseQueryResult<BigNumber, unknown>;
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
  type: "direct-listings" | "english-auctions";
}

const DEFAULT_QUERY_STATE = { count: 50, start: 0 };

export const MarketplaceTable: React.FC<MarketplaceTableProps> = ({
  contract,
  getAllQueryResult,
  getValidQueryResult,
  totalCountQuery,
  queryParams,
  setQueryParams,
  type,
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
    } else {
      return getValidQueryResult?.data || prevData;
    }
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
      data: (renderData as any) || [],
      initialState: {
        pageSize: queryParams.count,
        pageIndex: 0,
      },
      manualPagination: true,
      pageCount: Math.max(
        Math.ceil(
          BigNumber.from(totalCountQuery.data || 0).toNumber() /
            queryParams.count,
        ),
        1,
      ),
    },
    usePagination,
  );

  useEffect(() => {
    setQueryParams({ start: pageIndex * pageSize, count: pageSize });
  }, [pageIndex, pageSize, setQueryParams]);

  const [tokenRow, setTokenRow] = useState<
    DirectListingV3 | EnglishAuction | null
  >(null);

  return (
    <Flex gap={4} direction="column">
      <ButtonGroup size="sm" variant="outline" isAttached>
        <Button
          onClick={() => setListingsToShow("all")}
          variant={listingsToShow === "all" ? "solid" : "outline"}
        >
          All
        </Button>
        <Button
          onClick={() => setListingsToShow("valid")}
          variant={listingsToShow === "valid" ? "solid" : "outline"}
        >
          Valid
        </Button>
      </ButtonGroup>

      <TableContainer maxW="100%">
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
          type={type}
        />
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <Th
                    {...column.getHeaderProps()}
                    border="none"
                    key={columnIndex}
                  >
                    <Text as="label" size="label.sm" color="faded">
                      {column.render("Header")}
                    </Text>
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
                  _hover={{ bg: "accent.100" }}
                  style={{ cursor: "pointer" }}
                  onClick={() => setTokenRow(row.original)}
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                  borderColor="borderColor"
                  key={rowIndex}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <Td
                      {...cell.getCellProps()}
                      borderBottomWidth="inherit"
                      borderColor="borderColor"
                      key={cellIndex}
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                  <Td borderBottomWidth="inherit" borderColor="borderColor">
                    <Icon as={FiArrowRight} />
                  </Td>
                </Tr>
              );
            })}
            {((listingsToShow === "all" && getAllQueryResult.isPreviousData) ||
              (listingsToShow === "valid" &&
                getValidQueryResult.isPreviousData)) && (
              <Flex
                zIndex="above"
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                backdropFilter="blur(5px)"
                bg="blackAlpha.100"
                _dark={{ bg: "whiteAlpha.50" }}
                borderRadius="md"
                align="flex-end"
                justify="center"
                p={8}
              >
                <Flex align="center" gap={4}>
                  <Spinner size="sm" />
                  <Heading size="label.lg">Fetching new page</Heading>
                </Flex>
              </Flex>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Center w="100%">
        <Flex gap={2} direction="row" align="center">
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isLoading}
            aria-label="first page"
            icon={<Icon as={MdFirstPage} />}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            isDisabled={!canPreviousPage || totalCountQuery.isLoading}
            aria-label="previous page"
            icon={<Icon as={MdNavigateBefore} />}
            onClick={() => previousPage()}
          />
          <Text whiteSpace="nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton
              as="span"
              display="inline"
              isLoaded={totalCountQuery.isSuccess}
            >
              <strong>{pageCount}</strong>
            </Skeleton>
          </Text>
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isLoading}
            aria-label="next page"
            icon={<Icon as={MdNavigateNext} />}
            onClick={() => nextPage()}
          />
          <IconButton
            isDisabled={!canNextPage || totalCountQuery.isLoading}
            aria-label="last page"
            icon={<Icon as={MdLastPage} />}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            onChange={(e) => {
              setPageSize(parseInt(e.target.value as string, 10));
            }}
            value={pageSize}
            isDisabled={totalCountQuery.isLoading}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </Select>
        </Flex>
      </Center>
    </Flex>
  );
};
