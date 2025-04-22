import { TableContainer } from "@/components/ui/table";
import {
  IconButton,
  Portal,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { type Column, usePagination, useTable } from "react-table";

interface CsvDataTableProps<T extends object> {
  data: T[];
  portalRef: React.RefObject<HTMLDivElement | null>;
  columns: Column<T>[];
}
/**
 * Display the data uploaded from useCsvUpload, using react-table
 */
export function CsvDataTable<T extends object>({
  data,
  portalRef,
  columns,
}: CsvDataTableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // Instead of using 'rows', we'll use page,
    page,
    // which has only the rows for the active page
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 50,
        pageIndex: 0,
      },
    },
    // old package: this will be removed
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );
  return (
    <>
      <TableContainer>
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
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                <Tr {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => (
                    <Td
                      {...cell.getCellProps()}
                      borderColor="borderColor"
                      // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                      key={cellIndex}
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {/* Only need to show the Pagination components if we have more than 25 records */}
      {data.length > 0 && (
        <Portal containerRef={portalRef}>
          <div className="flex w-full items-center justify-center">
            <div className="flex flex-row gap-1">
              <IconButton
                isDisabled={!canPreviousPage}
                aria-label="first page"
                icon={<ChevronFirstIcon className="size-4" />}
                onClick={() => gotoPage(0)}
              />
              <IconButton
                isDisabled={!canPreviousPage}
                aria-label="previous page"
                icon={<ChevronLeftIcon className="size-4" />}
                onClick={() => previousPage()}
              />
              <p className="my-auto whitespace-nowrap">
                Page <strong>{pageIndex + 1}</strong> of{" "}
                <strong>{pageOptions.length}</strong>
              </p>
              <IconButton
                isDisabled={!canNextPage}
                aria-label="next page"
                icon={<ChevronRightIcon className="size-4" />}
                onClick={() => nextPage()}
              />
              <IconButton
                isDisabled={!canNextPage}
                aria-label="last page"
                icon={<ChevronLastIcon className="size-4" />}
                onClick={() => gotoPage(pageCount - 1)}
              />
              <Select
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
        </Portal>
      )}
    </>
  );
}
