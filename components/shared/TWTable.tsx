import {
  ButtonGroup,
  Center,
  Divider,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  ColumnDef,
  PaginationState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import pluralize from "pluralize";
import { SetStateAction, useMemo, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { FiArrowRight, FiTrash } from "react-icons/fi";
import { Button, TableContainer, Text } from "tw-components";

type TWTableProps<TRowData> = {
  columns: ColumnDef<TRowData, any>[];
  data: TRowData[];
  isLoading: boolean;
  isFetched: boolean;
  onRowClick?: (row: TRowData) => void;
  onEdit?: (row: TRowData) => void;
  onDelete?: (row: TRowData) => void;
  pagination?: {
    pageSize: number;
  };
  showMore?: {
    pageSize: number;
    showLess?: boolean;
  };
  title: string;
};

export function TWTable<TRowData>(tableProps: TWTableProps<TRowData>) {
  const [showMoreLimit, setShowMoreLimit] = useState(
    tableProps.showMore?.pageSize || Infinity,
  );
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: tableProps.pagination?.pageSize || 25,
  });

  const slicedData = useMemo(() => {
    if (tableProps.showMore) {
      return tableProps.data.slice(0, showMoreLimit || Infinity);
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
              {/* if the row is clickable we want an arrow to show */}
              {tableProps.onRowClick && <Th border="none" />}
              {(tableProps.onEdit || tableProps.onDelete) && (
                <Th border="none" />
              )}
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
                {(tableProps.onEdit || tableProps.onDelete) && (
                  <Td
                    isNumeric
                    borderBottomWidth="inherit"
                    borderBottomColor="accent.100"
                  >
                    <ButtonGroup variant="ghost" gap={2}>
                      {tableProps.onEdit && (
                        <IconButton
                          onClick={() => tableProps.onEdit?.(row.original)}
                          icon={<Icon as={BiPencil} boxSize={4} />}
                          aria-label="Edit"
                        />
                      )}
                      {tableProps.onDelete && (
                        <IconButton
                          onClick={() => tableProps.onDelete?.(row.original)}
                          icon={<Icon as={FiTrash} boxSize={4} />}
                          aria-label="Remove"
                        />
                      )}
                    </ButtonGroup>
                  </Td>
                )}
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
