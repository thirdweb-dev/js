import {
  Box,
  BoxProps,
  Center,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  ImageProps,
  Portal,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { NFTMetadataInput } from "@thirdweb-dev/sdk";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { replaceIpfsUrl } from "lib/sdk";
import { useMemo } from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { Column, usePagination, useTable } from "react-table";
import { Card, CodeBlock, Text } from "tw-components";
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
  data: NFTMetadataInput[];
  portalRef: React.RefObject<HTMLDivElement>;
  nextTokenIdToMint?: number;
}

export const BatchTable: React.FC<BatchTableProps> = ({
  data,
  portalRef,
  nextTokenIdToMint,
}) => {
  const columns = useMemo(() => {
    let cols: Column<NFTMetadataInput>[] = [];
    if (nextTokenIdToMint !== undefined) {
      cols = cols.concat({
        Header: "Token ID",
        accessor: (_row, index) => nextTokenIdToMint + index,
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
        Header: "Properties",
        accessor: (row) => row.attributes || row.properties,
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
    usePagination,
  );

  // Render the UI for your table
  return (
    <Flex flexGrow={1} overflow="auto">
      <Card maxW="100%" overflowX="auto" position="relative" px={0} py={0}>
        <Table {...getTableProps()}>
          <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <Th {...column.getHeaderProps()} py={5}>
                    <Text as="label" size="label.md">
                      {column.render("Header")}
                    </Text>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <Tr
                  {...row.getRowProps()}
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                >
                  {row.cells.map((cell) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <Td {...cell.getCellProps()} borderBottomWidth="inherit">
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Card>

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
                setPageSize(parseInt(e.target.value as string, 10));
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
