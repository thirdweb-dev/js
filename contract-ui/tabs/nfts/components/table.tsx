import { NFTDrawer } from "./nft-drawer";
import {
  Center,
  Flex,
  Icon,
  IconButton,
  Select,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { NFT, NFTContract, useNFTs, useTotalCount } from "@thirdweb-dev/react";
import { Erc721, Erc1155, Json } from "@thirdweb-dev/sdk";
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import { BigNumber } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { Cell, Column, usePagination, useTable } from "react-table";
import {
  AddressCopyButton,
  Card,
  CodeBlock,
  Heading,
  Text,
} from "tw-components";

interface ContractOverviewNftGetAllProps {
  contract: NFTContract;
}
export const NftGetAllTable: React.FC<ContractOverviewNftGetAllProps> = ({
  contract,
}) => {
  const tableColumns = useMemo(() => {
    const cols: Column<NFT<NFTContract>>[] = [
      {
        Header: "Token Id",
        accessor: (row) => row.metadata.id.toString(),
      },
      {
        Header: "Media",
        accessor: (row) => row.metadata,
        Cell: (cell: any) => <MediaCell cell={cell} />,
      },
      {
        Header: "Name",
        accessor: (row) => row.metadata.name,
      },
      {
        Header: "Description",
        accessor: (row) => row.metadata.description,
      },
      {
        Header: "Properties",
        accessor: (row) => row.metadata.attributes || row.metadata.properties,
        Cell: ({ cell }: { cell: Cell<NFT<NFTContract>, Json> }) => (
          <CodeBlock
            code={JSON.stringify(cell.value, null, 2) || ""}
            language="json"
            canCopy={false}
            wrap={false}
          />
        ),
      },
    ];
    if (contract instanceof Erc721) {
      cols.push({
        Header: "Owned By",
        accessor: (row) => row.owner,
        Cell: ({ cell }: { cell: Cell<NFT<NFTContract>, string> }) => (
          <AddressCopyButton address={cell.value} />
        ),
      });
    }
    if (contract instanceof Erc1155) {
      cols.push({
        Header: "Supply",
        accessor: (row) => BigNumber.from(row.supply).toString(),
      });
    }
    return cols;
  }, [contract]);

  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });
  const getAllQueryResult = useNFTs(contract, queryParams);
  const totalCountQuery = useTotalCount(contract);

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
      data: getAllQueryResult.data || [],
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
  }, [pageIndex, pageSize]);

  const [tokenRow, setTokenRow] = useState<NFT<
    Erc721<any> | Erc1155<any>
  > | null>(null);

  return (
    <Flex gap={4} direction="column">
      <Card maxW="100%" overflowX="auto" position="relative" px={0} pt={0}>
        {getAllQueryResult.isFetching && (
          <Spinner
            color="primary"
            size="xs"
            position="absolute"
            top={2}
            right={4}
          />
        )}
        <NFTDrawer
          contract={contract}
          data={tokenRow}
          isOpen={!!tokenRow}
          onClose={() => setTokenRow(null)}
        />
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
          <Tbody {...getTableBodyProps()} position="relative">
            {page.map((row) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <Tr
                  {...row.getRowProps()}
                  role="group"
                  _hover={{ bg: "blackAlpha.50" }}
                  _dark={{
                    _hover: {
                      bg: "whiteAlpha.50",
                    },
                  }}
                  // this is a hack to get around the fact that safari does not handle position: relative on table rows
                  style={{ cursor: "pointer" }}
                  onClick={() => setTokenRow(row.original)}
                  // end hack
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                >
                  {row.cells.map((cell) => (
                    // eslint-disable-next-line react/jsx-key
                    <Td {...cell.getCellProps()} borderBottomWidth={"inherit"}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
            {getAllQueryResult.isPreviousData && (
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
