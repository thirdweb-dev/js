import {
  Box,
  type BoxProps,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  type ImageProps,
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
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { replaceIpfsUrl } from "lib/sdk";
import { useMemo } from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { type Column, usePagination, useTable } from "react-table";
import type { NFTInput } from "thirdweb/utils";
import { CodeBlock, Text } from "tw-components";
import { parseDescription } from "utils/parseDescription";

const FileImage: React.FC<ImageProps> = ({ src, ...props }) => {
  const img = useImageFileOrUrl(
    typeof src === "string" && src.startsWith("ipfs://")
      ? replaceIpfsUrl(src)
      : src,
  );
  return <Image alt="" {...props} src={img} />;
};

const FileVideo: React.FC<
  BoxProps & Omit<React.ComponentProps<"video">, "ref">
> = ({ src, ...props }) => {
  const video = useImageFileOrUrl(
    typeof src === "string" && src.startsWith("ipfs://")
      ? replaceIpfsUrl(src)
      : src,
  );
  return <Box as="video" {...props} src={video} />;
};
interface BatchTableProps {
  data: NFTInput[];
  portalRef: React.RefObject<HTMLDivElement>;
  nextTokenIdToMint?: bigint;
}

export const BatchTable: React.FC<BatchTableProps> = ({
  data,
  portalRef,
  nextTokenIdToMint,
}) => {
  const columns = useMemo(() => {
    let cols: Column<NFTInput>[] = [];
    if (nextTokenIdToMint !== undefined) {
      cols = cols.concat({
        Header: "Token ID",
        accessor: (_row, index) => String(nextTokenIdToMint + BigInt(index)),
      });
    }

    cols = cols.concat([
      {
        Header: "Image",
        accessor: (row) => row.image,
        Cell: ({ cell: { value } }: { cell: { value?: string } }) => (
          <FileImage
            flexShrink={0}
            boxSize={24}
            objectFit="contain"
            src={value}
            alt=""
          />
        ),
      },
      {
        Header: "Animation Url",
        accessor: (row) => row.animation_url,
        Cell: ({ cell: { value } }: { cell: { value?: string } }) => (
          <FileVideo
            flexShrink={0}
            boxSize={24}
            objectFit="contain"
            src={value}
            autoPlay
            playsInline
            muted
            loop
          />
        ),
      },
      { Header: "Name", accessor: (row) => row.name },
      {
        Header: "Description",
        accessor: (row) => parseDescription(row.description),
      },
      {
        Header: "Attributes",
        accessor: (row) => row.attributes || row.properties,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: ({ cell }: { cell: any }) =>
          cell.value ? (
            <CodeBlock
              canCopy={false}
              code={JSON.stringify(cell.value || {}, null, 2)}
              language="json"
              width={300}
            />
          ) : null,
      },
      { Header: "External URL", accessor: (row) => row.external_url },
      { Header: "Background Color", accessor: (row) => row.background_color },
    ]);
    return cols;
  }, [nextTokenIdToMint]);

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
    // will be fixed with @tanstack/react-table v8
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );

  // Render the UI for your table
  return (
    <Flex flexGrow={1} overflow="auto">
      <TableContainer maxW="100%">
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  <Th {...column.getHeaderProps()} border="none" key={i}>
                    <Text as="label" size="label.sm" color="faded">
                      {column.render("Header")}
                    </Text>
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
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
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
        <Center w="100%">
          <HStack>
            <IconButton
              isDisabled={!canPreviousPage}
              aria-label="first page"
              icon={<Icon as={MdFirstPage} />}
              onClick={() => gotoPage(0)}
            />
            <IconButton
              isDisabled={!canPreviousPage}
              aria-label="previous page"
              icon={<Icon as={MdNavigateBefore} />}
              onClick={() => previousPage()}
            />
            <Text whiteSpace="nowrap">
              Page <strong>{pageIndex + 1}</strong> of{" "}
              <strong>{pageOptions.length}</strong>
            </Text>
            <IconButton
              isDisabled={!canNextPage}
              aria-label="next page"
              icon={<Icon as={MdNavigateNext} />}
              onClick={() => nextPage()}
            />
            <IconButton
              isDisabled={!canNextPage}
              aria-label="last page"
              icon={<Icon as={MdLastPage} />}
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
          </HStack>
        </Center>
      </Portal>
    </Flex>
  );
};
