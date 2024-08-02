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
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import {
  type CellProps,
  type Column,
  usePagination,
  useTable,
} from "react-table";
import type { NFT, ThirdwebContract } from "thirdweb";
import {
  nextTokenIdToMint as erc721NextTokenIdToMint,
  totalSupply as erc721TotalSupply,
  getNFTs as getErc721NFTs,
  isERC721,
} from "thirdweb/extensions/erc721";
import {
  nextTokenIdToMint as erc1155NextTokenIdToMint,
  getNFTs as getErc1155NFTs,
  isERC1155,
} from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { Heading, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface ContractOverviewNFTGetAllProps {
  contract: ThirdwebContract;
}
export const NFTGetAllTable: React.FC<ContractOverviewNFTGetAllProps> = ({
  contract,
}) => {
  const { data: isErc721, isLoading: checking721 } = useReadContract(isERC721, {
    contract,
  });
  const { data: isErc1155, isLoading: checking1155 } = useReadContract(
    isERC1155,
    { contract },
  );
  const router = useRouter();

  const tableColumns = useMemo(() => {
    const cols: Column<NFT>[] = [
      {
        Header: "Token Id",
        accessor: (row) => row.id?.toString(),
        Cell: (cell: CellProps<NFT, string>) => (
          <Text size="body.md" fontFamily="mono">
            {cell.value}
          </Text>
        ),
      },
      {
        Header: "Media",
        accessor: (row) => row.metadata,
        Cell: (cell: CellProps<NFT, NFT["metadata"]>) => (
          <MediaCell cell={cell} />
        ),
      },
      {
        Header: "Name",
        accessor: (row) => row.metadata.name,
        Cell: (cell: CellProps<NFT, string>) => (
          <Text noOfLines={1} size="label.md">
            {cell.value}
          </Text>
        ),
      },
      {
        Header: "Description",
        accessor: (row) => row.metadata.description,
        Cell: (cell: CellProps<NFT, string>) => (
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
        Cell: (cell: CellProps<NFT, string>) => (
          <AddressCopyButton size="xs" address={cell.value} />
        ),
      });
    }
    if (isErc1155) {
      cols.push({
        Header: "Supply",
        accessor: (row) => row,
        Cell: (cell: CellProps<NFT, number>) => {
          if (cell.row.original.type === "ERC1155") {
            return (
              <Text noOfLines={4} size="body.md" fontFamily="mono">
                {cell.row.original.supply.toString()}
              </Text>
            );
          }
        },
      });
    }
    return cols;
  }, [isErc721, isErc1155]);

  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });

  const getNFTsQuery = useReadContract(
    isErc1155 ? getErc1155NFTs : getErc721NFTs,
    {
      contract,
      start: queryParams.start,
      count: queryParams.count,
      includeOwners: true,
      queryOptions: {
        // Only load once finishing checking if the contract is either 721 or 1155
        enabled: !checking1155 && !checking721,
      },
    },
  );

  // TODO: Add support for ERC1155 total circulating supply
  const nextTokenIdToMintQuery = useReadContract(
    isErc1155 ? erc1155NextTokenIdToMint : erc721NextTokenIdToMint,
    {
      contract,
      queryOptions: {
        // Only load once finishing checking if the contract is either 721 or 1155
        enabled: !checking1155 && !checking721,
      },
    },
  );
  const totalSupplyQuery = useReadContract(erc721TotalSupply, {
    contract,
    queryOptions: {
      // Only load once finishing checking if the contract is either 721 or 1155
      enabled: !checking1155 && !checking721,
    },
  });

  // Anything bigger and the table breaks
  const safeTotalCount = useMemo(() => {
    const computedSupply = (() => {
      const nextTokenIdToMint = nextTokenIdToMintQuery.data;
      const totalSupply = totalSupplyQuery.data;
      if (nextTokenIdToMint === undefined && totalSupply === undefined) {
        return 0n;
      }
      if ((nextTokenIdToMint || 0n) > (totalSupply || 0n)) {
        return nextTokenIdToMint || 0n;
      }

      return totalSupply || 0n;
    })();

    if (computedSupply > 1_000_000n) {
      return 1_000_000;
    }
    return Number(computedSupply);
  }, [totalSupplyQuery?.data, nextTokenIdToMintQuery?.data]);

  const querySuccess =
    nextTokenIdToMintQuery.isSuccess || totalSupplyQuery.isSuccess;
  const queryLoading =
    nextTokenIdToMintQuery.isLoading || totalSupplyQuery.isLoading;

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

  // FIXME: re-work tables and pagination with @tanstack/table@latest - which (I believe) does not need this workaround anymore
  // eslint-disable-next-line no-restricted-syntax
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
                    <Text as="label" size="label.sm" color="faded">
                      {column.render("Header")}
                    </Text>
                  </Th>
                ))}
                {/* Need to add an empty header for the drawer button */}
                <Th border="none" />
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} position="relative">
            {page.map((row, rowIndex) => {
              const failedToLoad = !row.original.tokenURI;
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  role="group"
                  _hover={{ bg: "accent.100" }}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const tokenId = row.original.id;
                    if (!tokenId && tokenId !== 0n) {
                      return;
                    }
                    router.push(
                      `${router.asPath}/${tokenId.toString()}`,
                      undefined,
                      {
                        scroll: true,
                      },
                    );
                  }}
                  borderBottomWidth={1}
                  _last={{ borderBottomWidth: 0 }}
                  pointerEvents={failedToLoad ? "none" : "auto"}
                  opacity={failedToLoad ? 0.3 : 1}
                  cursor={failedToLoad ? "not-allowed" : "pointer"}
                  borderColor="borderColor"
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  key={rowIndex}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <Td
                      {...cell.getCellProps()}
                      borderBottomWidth="inherit"
                      borderColor="borderColor"
                      maxW="sm"
                      // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                      key={cellIndex}
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
            {getNFTsQuery.isPlaceholderData && (
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
      </TableContainer>
      <Center w="100%">
        <Flex gap={2} direction="row" align="center">
          <IconButton
            isDisabled={!canPreviousPage || queryLoading}
            aria-label="first page"
            icon={<Icon as={MdFirstPage} />}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            isDisabled={!canPreviousPage || queryLoading}
            aria-label="previous page"
            icon={<Icon as={MdNavigateBefore} />}
            onClick={() => previousPage()}
          />
          <Text whiteSpace="nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton as="span" display="inline" isLoaded={querySuccess}>
              <strong>{pageCount}</strong>
            </Skeleton>
          </Text>
          <IconButton
            isDisabled={!canNextPage || queryLoading}
            aria-label="next page"
            icon={<Icon as={MdNavigateNext} />}
            onClick={() => nextPage()}
          />
          <IconButton
            isDisabled={!canNextPage || queryLoading}
            aria-label="last page"
            icon={<Icon as={MdLastPage} />}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            onChange={(e) => {
              setPageSize(Number.parseInt(e.target.value as string, 10));
            }}
            value={pageSize}
            isDisabled={queryLoading}
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
