/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: FIXME */

import { FilePreview } from "@app/team/[team_slug]/[project_slug]/(sidebar)/tokens/create/_common/file-preview";
import {
  Flex,
  IconButton,
  Portal,
  Select,
  Table,
  TableContainer,
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
import { useMemo } from "react";
import { type Column, usePagination, useTable } from "react-table";
import type { ThirdwebClient } from "thirdweb";
import type { NFTInput } from "thirdweb/utils";
import { CodeClient } from "@/components/ui/code/code.client";
import { ToolTipLabel } from "@/components/ui/tooltip";

interface BatchTableProps {
  data: NFTInput[];
  portalRef: React.RefObject<HTMLDivElement | null>;
  nextTokenIdToMint?: bigint;
  client: ThirdwebClient;
}

export const BatchTable: React.FC<BatchTableProps> = ({
  data,
  portalRef,
  nextTokenIdToMint,
  client,
}) => {
  const columns = useMemo(() => {
    let cols: Column<NFTInput>[] = [];
    if (nextTokenIdToMint !== undefined) {
      cols = cols.concat({
        accessor: (_row, index) => String(nextTokenIdToMint + BigInt(index)),
        Header: "Token ID",
      });
    }

    cols = cols.concat([
      {
        accessor: (row) => row.image,
        Cell: ({ cell: { value } }: { cell: { value?: string } }) => (
          <FilePreview
            className="size-24 shrink-0 rounded-lg object-contain"
            client={client}
            srcOrFile={value}
          />
        ),
        Header: "Image",
      },
      {
        accessor: (row) => row.animation_url,
        Cell: ({ cell: { value } }: { cell: { value?: string } }) => (
          <FilePreview
            className="size-24 shrink-0 rounded-lg"
            client={client}
            srcOrFile={value}
          />
        ),
        Header: "Animation Url",
      },
      { accessor: (row) => row.name, Header: "Name" },
      {
        accessor: (row) => (
          <ToolTipLabel label={row.description}>
            <p className="line-clamp-6 whitespace-pre-wrap">
              {row.description}
            </p>
          </ToolTipLabel>
        ),
        Header: "Description",
      },
      {
        accessor: (row) => row.attributes || row.properties,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: ({ cell }: { cell: any }) =>
          cell.value ? (
            <CodeClient
              code={JSON.stringify(cell.value || {}, null, 2)}
              lang="json"
              scrollableClassName="max-w-[300px]"
            />
          ) : null,
        Header: "Attributes",
      },
      { accessor: (row) => row.external_url, Header: "External URL" },
      { accessor: (row) => row.background_color, Header: "Background Color" },
    ]);
    return cols;
  }, [nextTokenIdToMint, client]);

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
        pageIndex: 0,
        pageSize: 50,
      },
    },
    // will be fixed with @tanstack/react-table v8
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );

  // Render the UI for your table
  return (
    <Flex flexGrow={1} overflow="auto">
      <TableContainer className="w-full" maxW="100%">
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  <Th {...column.getHeaderProps()} border="none" key={i}>
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
                <Tr
                  {...row.getRowProps()}
                  _last={{ borderBottomWidth: 0 }}
                  borderBottomWidth={1}
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  key={rowIndex}
                >
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        borderBottomWidth="inherit"
                        borderColor="borderColor"
                        // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                        key={cellIndex}
                      >
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Portal containerRef={portalRef}>
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-row items-center gap-2">
            <IconButton
              aria-label="first page"
              icon={<ChevronFirstIcon className="size-4" />}
              isDisabled={!canPreviousPage}
              onClick={() => gotoPage(0)}
            />
            <IconButton
              aria-label="previous page"
              icon={<ChevronLeftIcon className="size-4" />}
              isDisabled={!canPreviousPage}
              onClick={() => previousPage()}
            />
            <p className="whitespace-nowrap">
              Page <strong>{pageIndex + 1}</strong> of{" "}
              <strong>{pageOptions.length}</strong>
            </p>
            <IconButton
              aria-label="next page"
              icon={<ChevronRightIcon className="size-4" />}
              isDisabled={!canNextPage}
              onClick={() => nextPage()}
            />
            <IconButton
              aria-label="last page"
              icon={<ChevronLastIcon className="size-4" />}
              isDisabled={!canNextPage}
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
    </Flex>
  );
};
