import {
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
} from "@chakra-ui/react";
import type { NFTContract } from "@thirdweb-dev/react";
import { detectFeatures } from "components/contract-components/utils";
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { CellProps, Column, usePagination, useTable } from "react-table";
import type { NFT, ThirdwebContract } from "thirdweb";
import {
  getNFTs as getErc721NFTs,
  totalSupply,
} from "thirdweb/extensions/erc721";
import { getNFTs as getErc1155NFTs } from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface ContractOverviewNFTGetAllProps {
  oldContract: NFTContract;
  contract: ThirdwebContract;
}
export const NFTGetAllTable: React.FC<ContractOverviewNFTGetAllProps> = ({
  oldContract,
  contract,
}) => {
  const isErc721 = detectFeatures(oldContract, ["ERC721"]);
  const isErc1155 = detectFeatures(oldContract, ["ERC1155"]);
  const router = useRouter();

  const tableColumns = useMemo(() => {
    const cols: Column<NFT<"ERC721" | "ERC1155">>[] = [
      {
        Header: "Token Id",
        accessor: (row) => row.id?.toString(),
        Cell: (cell: CellProps<NFT<"ERC721" | "ERC1155">, string>) => (
          <Text size="body.md" fontFamily="mono">
            {cell.value}
          </Text>
        ),
      },
      {
        Header: "Media",
        accessor: (row) => row.metadata,
        Cell: (
          cell: CellProps<
            NFT<"ERC721" | "ERC1155">,
            NFT<"ERC721" | "ERC1155">["metadata"]
          >,
          // @ts-expect-error - types are not compatible yet until we have NFTRenderer in v5
        ) => <MediaCell cell={cell} />,
      },
      {
        Header: "Name",
        accessor: (row) => row.metadata.name,
        Cell: (cell: CellProps<NFT<"ERC721" | "ERC1155">, string>) => (
          <Text noOfLines={1} size="label.md">
            {cell.value}
          </Text>
        ),
      },
      {
        Header: "Description",
        accessor: (row) => row.metadata.description,
        Cell: (cell: CellProps<NFT<"ERC721" | "ERC1155">, string>) => (
          <Text
            noOfLines={4}
            size="body.md"
            fontStyle={!cell.value ? "italic" : "normal"}
          >
            {cell.value || "No description"}
          </Text>
        ),
      },
    ];
    if (isErc721) {
      cols.push({
        Header: "Owner",
        accessor: (row) => row.owner,
        Cell: (cell: CellProps<NFT<"ERC721" | "ERC1155">, string>) => (
          <AddressCopyButton size="xs" address={cell.value} />
        ),
      });
    }
    if (isErc1155) {
      cols.push({
        Header: "Supply",
        accessor: (row) => row.supply,
        Cell: (cell: CellProps<NFT<"ERC721" | "ERC1155">, number>) => (
          <Text noOfLines={4} size="body.md" fontFamily="mono">
            {cell.value}
          </Text>
        ),
      });
    }
    return cols;
  }, [isErc721, isErc1155]);

  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });

  const getNFTsQuery = useReadContract(
    // @ts-expect-error - this is a hack to get around the fact that the types are not compatible
    isErc1155 ? getErc1155NFTs : getErc721NFTs,
    {
      contract,
      queryParams,
      includeOwners: true,
    },
  );

  const totalCountQuery = useReadContract(totalSupply, {
    contract,
  });

  // Anything bigger and the table breaks
  const safeTotalCount = useMemo(
    () =>
      totalCountQuery?.data
        ? totalCountQuery?.data > 1_000_000n
          ? 1_000_000
          : Number(totalCountQuery.data)
        : 0,
    [totalCountQuery?.data],
  );

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
      data: getNFTsQuery.data || [],
      initialState: {
        pageSize: queryParams.count,
        pageIndex: 0,
      },
      manualPagination: true,
      pageCount: Math.max(
        Math.ceil(safeTotalCount / (queryParams.count || 1)),
        1,
      ),
    },
    usePagination,
  );

  useEffect(() => {
    setQueryParams({ start: pageIndex * pageSize, count: pageSize });
  }, [pageIndex, pageSize]);

  return (
    <Flex gap={4} direction="column">
      <TableContainer maxW="100%">
        {getNFTsQuery.isFetching && (
          <Spinner
            color="primary"
            size="xs"
            position="absolute"
            top={2}
            right={4}
          />
        )}
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <Th {...column.getHeaderProps()} border="none">
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
            {page.map((row) => {
              const failedToLoad = !row.original.tokenURI;
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <Tr
                  {...row.getRowProps()}
                  role="group"
                  _hover={{ bg: "accent.100" }}
                  // this is a hack to get around the fact that safari does not handle position: relative on table rows
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push(
                      `${router.asPath}/${row.original.id.toString()}`,
                      undefined,
                      {
                        scroll: true,
                      },
                    );
                  }}
                  // end hack
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                  pointerEvents={failedToLoad ? "none" : "auto"}
                  opacity={failedToLoad ? 0.3 : 1}
                  cursor={failedToLoad ? "not-allowed" : "pointer"}
                  borderColor="borderColor"
                >
                  {row.cells.map((cell) => (
                    // eslint-disable-next-line react/jsx-key
                    <Td
                      {...cell.getCellProps()}
                      borderBottomWidth="inherit"
                      borderColor="borderColor"
                      maxW="sm"
                    >
                      {cell.render("Cell")}
                    </Td>
                  ))}
                  <Td borderBottomWidth="inherit" borderColor="borderColor">
                    {!failedToLoad && <Icon as={FiArrowRight} />}
                  </Td>
                </Tr>
              );
            })}
            {/*             {getNFTsQuery.isPlaceholderData && (
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
            )} */}
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
