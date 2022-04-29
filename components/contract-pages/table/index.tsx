import {
  ContractEmptyState,
  IContractEmptyState,
} from "../contract-emptystate";
import { useExpandedRow } from "./expansions/useExpandedRow";
import { useTableColumns } from "./table-columns/useTableColumns";
import { TableProvider, useTableContext } from "./table-context";
import { TTableType } from "./types";
import {
  ContractWithGetAll,
  useGetAll,
  useGetTotalCount,
} from "@3rdweb-sdk/react/hooks/useGetAll";
import {
  Box,
  Center,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { Row, usePagination, useTable } from "react-table";
import { Card, Heading, Text } from "tw-components";

interface IRawContractItemsTable<TContract extends ContractWithGetAll> {
  // items: TTableType<TContract>[];
  contract?: TContract;
  emptyState?: IContractEmptyState;
  lazyMint?: true;
}

const RawContractItemsTable = <TContract extends ContractWithGetAll>({
  contract,
  emptyState,
  lazyMint,
}: PropsWithChildren<IRawContractItemsTable<TContract>>) => {
  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });
  const items = useGetAll(contract, queryParams, lazyMint);
  const totalCount = useGetTotalCount(contract, lazyMint);

  const columns = useTableColumns(contract);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    visibleColumns,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: (items.data || []) as TTableType<TContract>[],
      initialState: {
        pageSize: queryParams.count,
        pageIndex: 0,
      },

      manualPagination: true,
      pageCount: Math.max(
        Math.ceil(
          BigNumber.from(totalCount.data || "0").toNumber() / queryParams.count,
        ),
        1,
      ),
    },
    usePagination,
  );
  const { closeAllRows } = useTableContext();
  const { renderExpandedRow, title } = useExpandedRow(contract);

  useEffect(() => {
    setQueryParams({ start: pageIndex * pageSize, count: pageSize });
  }, [pageIndex, pageSize]);

  if (totalCount.isLoading) {
    return (
      <Center position="absolute" w="full" h="full" top={0} left={0}>
        <HStack>
          <Spinner size="sm" />
          <Text>Loading Contract Data...</Text>
        </HStack>
      </Center>
    );
  } else if (BigNumber.from(totalCount.data || "0").eq(0)) {
    return (
      <Box w="full">
        <ContractEmptyState {...emptyState} contract={contract} />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <Card maxW="100%" as={Card} overflowX="auto" position="relative" p={0}>
        {items.isFetching && (
          <Spinner
            color="primary"
            size="xs"
            position="absolute"
            top={2}
            right={4}
          />
        )}
        <Table {...getTableProps()}>
          <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <Th {...column.getHeaderProps()} py={5}>
                    <Heading as="label" size="label.md" color="inherit">
                      {column.render("Header")}
                    </Heading>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} position="relative">
            {page.map((row: Row<TTableType<TContract>>) => {
              prepareRow(row);
              const expandedRow = renderExpandedRow(row.id);
              return (
                <React.Fragment key={`row_${row.id}`}>
                  <Tr
                    // shadow={expandedRow ? "md" : "none"}
                    bg={expandedRow ? "blackAlpha.50" : "transparent"}
                    _dark={{
                      bg: expandedRow ? "whiteAlpha.50" : "transparent",
                    }}
                    transition="all 0.1s"
                    borderBottomWidth={1}
                    _last={{ borderBottomWidth: 0 }}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => (
                      // eslint-disable-next-line react/jsx-key
                      <Td
                        {...cell.getCellProps()}
                        borderBottomWidth={"inherit"}
                      >
                        {cell.render("Cell")}
                      </Td>
                    ))}
                  </Tr>
                  {expandedRow && (
                    <Tr
                      bg="blackAlpha.50"
                      _dark={{ bg: "whiteAlpha.50" }}
                      key={`${row.id}_expansion`}
                      position="relative"
                    >
                      <Td
                        colSpan={visibleColumns.length}
                        borderBottom="none"
                        borderBottomRadius="md"
                        overflow="hidden"
                      >
                        <Stack w="100%">
                          <Flex justify="space-between" align="center">
                            <Heading size="label.xl" textTransform="uppercase">
                              {title}
                            </Heading>
                            <CloseButton onClick={closeAllRows} />
                          </Flex>
                          <Divider />
                          {expandedRow}
                        </Stack>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              );
            })}
            {items.isPreviousData && (
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
      </Card>
      <Center w="100%">
        <HStack>
          <IconButton
            isDisabled={!canPreviousPage || totalCount.isLoading}
            aria-label="first page"
            icon={<Icon as={MdFirstPage} />}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            isDisabled={!canPreviousPage || totalCount.isLoading}
            aria-label="previous page"
            icon={<Icon as={MdNavigateBefore} />}
            onClick={() => previousPage()}
          />
          <Text whiteSpace="nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton display="inline" isLoaded={totalCount.isSuccess}>
              <strong>{pageOptions.length}</strong>
            </Skeleton>
          </Text>
          <IconButton
            isDisabled={!canNextPage || totalCount.isLoading}
            aria-label="next page"
            icon={<Icon as={MdNavigateNext} />}
            onClick={() => nextPage()}
          />
          <IconButton
            isDisabled={!canNextPage || totalCount.isLoading}
            aria-label="last page"
            icon={<Icon as={MdLastPage} />}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            onChange={(e) => {
              setPageSize(parseInt(e.target.value as string, 10));
            }}
            value={pageSize}
            isDisabled={totalCount.isLoading}
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </Select>
        </HStack>
      </Center>
    </Stack>
  );
};
interface IContractItemsTableProps<TContract extends ContractWithGetAll> {
  contract?: TContract;
  emptyState?: IContractEmptyState;
  lazyMint?: true;
}

export const ContractItemsTable = <TContract extends ContractWithGetAll>(
  props: IContractItemsTableProps<TContract>,
) => {
  return (
    <TableProvider>
      <RawContractItemsTable {...props} />
    </TableProvider>
  );
};
