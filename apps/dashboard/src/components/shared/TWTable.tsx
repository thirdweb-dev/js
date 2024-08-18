import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  type ColumnDef,
  type PaginationState,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import pluralize from "pluralize";
import { type SetStateAction, useMemo, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import type { IconType } from "react-icons/lib";
import { TableContainer, Text } from "tw-components";

type CtaMenuItem<TRowData> = {
  icon?: IconType;
  text: string;
  onClick: (row: TRowData) => void;
  isDestructive?: boolean;
};

type TWTableProps<TRowData> = {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  columns: ColumnDef<TRowData, any>[];
  data: TRowData[];
  isLoading: boolean;
  isFetched: boolean;
  onRowClick?: (row: TRowData) => void;
  onMenuClick?: CtaMenuItem<TRowData>[];
  pagination?: {
    pageSize: number;
  };
  showMore?: {
    pageSize: number;
    showLess?: boolean;
  };
  title: string;
  bodyRowClassName?: string;
};

export function TWTable<TRowData>(tableProps: TWTableProps<TRowData>) {
  const [showMoreLimit, setShowMoreLimit] = useState(
    tableProps.showMore?.pageSize || Number.POSITIVE_INFINITY,
  );
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: tableProps.pagination?.pageSize || 25,
  });

  const slicedData = useMemo(() => {
    if (tableProps.showMore) {
      return tableProps.data.slice(
        0,
        showMoreLimit || Number.POSITIVE_INFINITY,
      );
    }
    if (tableProps.pagination) {
      return tableProps.data.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize,
      );
    }
    return tableProps.data;
  }, [
    tableProps.showMore,
    tableProps.pagination,
    tableProps.data,
    showMoreLimit,
    pageIndex,
    pageSize,
  ]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const paginationOptions: Pick<
    TableOptions<TRowData>,
    "state" | "onPaginationChange" | "manualPagination" | "pageCount"
  > = useMemo(
    () =>
      tableProps.pagination
        ? {
            pageCount: Math.ceil(slicedData.length / pageSize),
            state: { pagination },
            onPaginationChange: setPagination,
            manualPagination: true,
          }
        : {},
    [pageSize, pagination, slicedData.length, tableProps.pagination],
  );

  const table = useReactTable({
    data: slicedData,
    columns: tableProps.columns,
    ...paginationOptions,
    getCoreRowModel: getCoreRowModel(),
    // TODO - add filtering?
    // getFilteredRowModel: getFilteredRowModel(),
  });

  return (
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
                      {/* TODO add fitlering? */}
                      {/* {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null} */}
                    </Flex>
                  )}
                </Th>
              ))}
              {(tableProps.onRowClick || tableProps.onMenuClick) && (
                <Th border="none" className="w-0" />
              )}
            </Tr>
          ))}
        </Thead>

        <Tbody className="!bg-background">
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
                className={tableProps.bodyRowClassName}
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

                {/* Show a ... menu or individual CTA buttons. */}
                {tableProps.onRowClick ? (
                  <Td
                    isNumeric
                    borderBottomWidth="inherit"
                    borderBottomColor="accent.100"
                  >
                    <Icon as={FiArrowRight} />
                  </Td>
                ) : tableProps.onMenuClick ? (
                  <Td
                    isNumeric
                    borderBottomWidth="inherit"
                    borderBottomColor="accent.100"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          aria-label="Actions"
                          className="relative z-10 p-2.5 !h-auto"
                        >
                          <FaEllipsisVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {tableProps.onMenuClick.map(
                          ({ icon, text, onClick, isDestructive }) => {
                            return (
                              <DropdownMenuItem
                                key={text}
                                onClick={() => onClick(row.original)}
                                className={cn(
                                  "gap-3 px-3 py-3 min-w-[170px] cursor-pointer",
                                  isDestructive &&
                                    "!text-destructive-text hover:!bg-destructive",
                                )}
                              >
                                {icon && <Icon as={icon} boxSize={4} />}
                                {text}
                              </DropdownMenuItem>
                            );
                          },
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Td>
                ) : null}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {tableProps.isLoading && (
        <Center>
          <Flex py={4} direction="row" gap={4} align="center">
            <Spinner size="sm" />
            <Text>Loading {pluralize(tableProps.title, 0, false)}</Text>
          </Flex>
        </Center>
      )}
      {!tableProps.isLoading &&
        tableProps.data.length === 0 &&
        tableProps.isFetched && (
          <Center>
            <Flex py={4} direction="column" gap={4} align="center">
              <Text>No {pluralize(tableProps.title, 0, false)} found.</Text>
            </Flex>
          </Center>
        )}
      <ShowMoreButton
        shouldShowMore={slicedData.length < tableProps.data.length}
        shouldShowLess={
          !!tableProps.showMore?.showLess &&
          slicedData.length > tableProps.showMore.pageSize
        }
        pageSize={tableProps.showMore?.pageSize || -1}
        showMoreLimit={showMoreLimit}
        setShowMoreLimit={setShowMoreLimit}
      />
    </TableContainer>
  );
}

interface ShowMoreButtonProps {
  pageSize: number;
  showMoreLimit: number;
  setShowMoreLimit: (value: SetStateAction<number>) => void;
  shouldShowMore: boolean;
  shouldShowLess: boolean;
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  pageSize,
  showMoreLimit,
  setShowMoreLimit,
  shouldShowLess,
  shouldShowMore,
}) => {
  if (!shouldShowMore && !shouldShowLess) {
    return null;
  }
  let newShowLess = showMoreLimit - pageSize;
  if (newShowLess < pageSize) {
    newShowLess = pageSize;
  }

  return (
    <Flex flexDir="column">
      <Divider color="borderColor" />
      <Center>
        <ButtonGroup variant="ghost" size="sm" py={2}>
          {shouldShowMore && (
            <Button onClick={() => setShowMoreLimit(showMoreLimit + pageSize)}>
              Show more
            </Button>
          )}
          {shouldShowLess && (
            <Button onClick={() => setShowMoreLimit(newShowLess)}>
              Show Less
            </Button>
          )}
        </ButtonGroup>
      </Center>
    </Flex>
  );
};
