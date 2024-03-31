import {
  Box,
  ButtonGroup,
  Center,
  Flex,
  GridItem,
  Icon,
  Select,
  SimpleGrid,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { UseQueryResult } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import pluralize from "pluralize";
import { SetStateAction, useMemo } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Button, TableContainer, Text } from "tw-components";

type TWQueryTableProps<TRowData, TInputData> = {
  columns: ColumnDef<TRowData, any>[];
  query: UseQueryResult<TInputData, unknown>;
  selectData: (data?: TInputData) => TRowData[];
  onRowClick?: (row: TRowData) => void;
  pagination?: Omit<PaginationProps<TInputData>, "data" | "isLoading">;
  title: string;
};

export function TWQueryTable<TRowData, TInputData>(
  tableProps: TWQueryTableProps<TRowData, TInputData>,
) {
  const data = tableProps.selectData(tableProps.query.data);
  const isLoading = tableProps.query.isLoading;
  const isFetching = tableProps.query.isFetching;
  const isFetched = tableProps.query.isFetched;

  const table = useReactTable({
    data,
    columns: tableProps.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Flex direction="column" gap={2}>
      <TableContainer>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan} border="none">
                    {header.isPlaceholder ? null : (
                      <Flex align="center" gap={2}>
                        <Text as="label" size="label.sm" color="faded">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Text>
                      </Flex>
                    )}
                  </Th>
                ))}
                {/* if the row is clickable we want an arrow to show */}
                {tableProps.onRowClick && <Th border="none" />}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr
                  key={row.id}
                  role="group"
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                  {...(tableProps.onRowClick
                    ? {
                        style: {
                          cursor: "pointer",
                        },
                        onClick: () => tableProps.onRowClick?.(row.original),
                        _hover: { bg: "blackAlpha.50" },
                        _dark: {
                          _hover: {
                            bg: "whiteAlpha.50",
                          },
                        },
                      }
                    : {})}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        borderBottomWidth="inherit"
                        borderBottomColor="accent.100"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    );
                  })}
                  {/* if the row is clickable we want an arrow to show */}
                  {tableProps.onRowClick && (
                    <Td
                      isNumeric
                      borderBottomWidth="inherit"
                      borderBottomColor="accent.100"
                    >
                      <Icon as={FiArrowRight} />
                    </Td>
                  )}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {isLoading && (
          <Center>
            <Flex py={4} direction="row" gap={4} align="center">
              <Spinner size="sm" />
              <Text>Loading {pluralize(tableProps.title, 0, false)}</Text>
            </Flex>
          </Center>
        )}

        {!isLoading && !isFetching && data.length === 0 && isFetched && (
          <Center>
            <Flex py={4} direction="column" gap={4} align="center">
              <Text>No {pluralize(tableProps.title, 0, false)} found.</Text>
            </Flex>
          </Center>
        )}
      </TableContainer>
      {/* render pagination if pagination is enabled */}
      {tableProps.pagination && (
        <Pagination
          {...tableProps.pagination}
          isLoading={isLoading}
          data={tableProps.query.data}
        />
      )}
    </Flex>
  );
}

type PaginationProps<TInputData> = {
  data?: TInputData;
  isLoading: boolean;
  pageSize: number;
  setPageSize?: (value: SetStateAction<number>) => void;
  pageSizeOptions?: number[];
  page: number;
  setPage: (value: SetStateAction<number>) => void;
  selectTotalCount: (data?: TInputData) => number;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 250];

const MAX_PAGE_BUTTONS = 7;

type PageButton =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: string };

function Pagination<TInputData>(paginationProps: PaginationProps<TInputData>) {
  const totalCount = paginationProps.selectTotalCount(paginationProps.data);
  const totalPages = Math.ceil(totalCount / paginationProps.pageSize);

  const pageSizeOptions =
    paginationProps.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS;

  const pagesToRender: PageButton[] = useMemo(() => {
    // if there is only one page we don't need to render anything
    if (totalPages <= 1) {
      return [];
    }
    // if we have less than the max number of pages then we can just render all of them
    if (totalPages <= MAX_PAGE_BUTTONS) {
      return new Array(totalPages).fill(0).map((_, i) => ({
        type: "page",
        page: i,
      }));
    }

    // otherwise compute the buttons to render
    const pages = Array(MAX_PAGE_BUTTONS);

    const currentPage = paginationProps.page;
    let startPage = Math.max(0, currentPage - 3);
    let endPage = startPage + MAX_PAGE_BUTTONS - 1;
    if (endPage > totalPages - 1) {
      endPage = totalPages - 1;
      startPage = Math.max(0, endPage - MAX_PAGE_BUTTONS + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages[i - startPage] = { type: "page", page: i };
    }
    // if the the second index is bigger than 2 then we need to show the first page and an ellipsis
    if (pages[1].page > 2) {
      pages[0] = { type: "page", page: 0 };
      pages[1] = { type: "ellipsis", key: "ellipsis_pre" };
    }
    // if the second to last index is less than the total pages - 2 then we need to show an ellipsis and the last page
    if (pages[pages.length - 2].page < totalPages - 2) {
      pages[pages.length - 1] = { type: "page", page: totalPages - 1 };
      pages[pages.length - 2] = { type: "ellipsis", key: "ellipsis_post" };
    }
    return pages;
  }, [totalPages, paginationProps.page]);

  const buttonStringTemplate = useMemo(() => {
    const maxPage = `${totalPages}`.length;
    return new Array(maxPage).fill("0").join("");
  }, [totalPages]);

  return (
    <SimpleGrid columns={12} alignItems="center">
      {/* filler box on left side for spacing */}
      <GridItem colSpan={2} />
      <GridItem colSpan={8}>
        <Center>
          <ButtonGroup fontFamily="mono" variant="outline" size="sm">
            {paginationProps.isLoading
              ? new Array(MAX_PAGE_BUTTONS).fill("0").map((val, i) => {
                  return (
                    <Skeleton key={`placeholder_${i}`}>
                      <Button position="relative" isDisabled>
                        {val}
                      </Button>
                    </Skeleton>
                  );
                })
              : pagesToRender.map((page) =>
                  page.type === "page" ? (
                    <Button
                      position="relative"
                      key={`page_${page.page}`}
                      onClick={() => paginationProps.setPage(page.page)}
                      isActive={page.page === paginationProps.page}
                    >
                      {/* make all buttons as wide as the widest button could be based on the total pages */}
                      <Box as="span" visibility="hidden">
                        {buttonStringTemplate}
                      </Box>
                      <Center
                        position="absolute"
                        top={0}
                        right={0}
                        left={0}
                        bottom={0}
                      >
                        {page.page + 1}
                      </Center>
                    </Button>
                  ) : (
                    <Button
                      border="none"
                      cursor="default!important"
                      isDisabled
                      key={page.key}
                    >
                      ...
                    </Button>
                  ),
                )}
          </ButtonGroup>
        </Center>
      </GridItem>

      {/* if we let the users set the page size then show a select to do that */}
      <GridItem colSpan={2}>
        {paginationProps.setPageSize ? (
          <Select
            onChange={(e) => {
              // reset the page to 0
              paginationProps.setPage(0);
              const value = parseInt(e.target.value as string, 10);
              paginationProps.setPageSize?.(value);
            }}
            value={paginationProps.pageSize}
          >
            {pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </Select>
        ) : (
          <Box />
        )}
      </GridItem>
    </SimpleGrid>
  );
}
