"use client";

import { UnexpectedValueErrorMessage } from "@/components/blocks/error-fallbacks/unexpect-value-error-message";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import {
  Flex,
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
import * as Sentry from "@sentry/nextjs";
import { MediaCell } from "components/contract-pages/table/table-columns/cells/media-cell";
import { useChainSlug } from "hooks/chains/chainSlug";
import {
  ArrowRightIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import {
  type CellProps,
  type Column,
  usePagination,
  useTable,
} from "react-table";
import type { NFT, ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";

interface ContractOverviewNFTGetAllProps {
  contract: ThirdwebContract;
  isErc721: boolean;
}
export const NFTGetAllTable: React.FC<ContractOverviewNFTGetAllProps> = ({
  contract,
  isErc721,
}) => {
  // if it's not erc721, it's erc1155
  const isErc1155 = !isErc721;

  const router = useDashboardRouter();

  const tableColumns = useMemo(() => {
    const cols: Column<NFT>[] = [
      {
        Header: "Token Id",
        accessor: (row) => row.id?.toString(),
        Cell: (cell: CellProps<NFT, string>) => <p>{cell.value}</p>,
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
        Cell: (cell: CellProps<NFT, string>) => {
          if (typeof cell.value !== "string") {
            return (
              <UnexpectedValueErrorMessage
                title="Invalid Name"
                description="Name is not a string"
                value={cell.value}
                className="w-[300px] py-3"
              />
            );
          }

          return (
            <p className="line-clamp-1 text-muted-foreground text-sm">
              {cell.value}
            </p>
          );
        },
      },
      {
        Header: "Description",
        accessor: (row) => row.metadata.description,
        Cell: (cell: CellProps<NFT, string>) => {
          if (cell.value && typeof cell.value !== "string") {
            return (
              <UnexpectedValueErrorMessage
                title="Invalid description"
                description="Description is not a string"
                value={cell.value}
                className="w-[300px] py-3"
              />
            );
          }

          return (
            <p
              className={cn(
                "line-clamp-4 max-w-[200px] whitespace-normal text-muted-foreground text-sm",
                { italic: !cell.value },
              )}
            >
              {cell.value || "No description"}
            </p>
          );
        },
      },
    ];
    if (isErc721) {
      cols.push({
        Header: "Owner",
        accessor: (row) => row.owner,
        Cell: (cell: CellProps<NFT, string>) => (
          <WalletAddress address={cell.value} />
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
              <p className="line-clamp-4 font-mono text-base">
                {cell.row.original.supply.toString()}
              </p>
            );
          }
        },
      });
    }
    return cols;
  }, [isErc721, isErc1155]);

  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });

  const getNFTsQuery = useReadContract(
    isErc1155 ? ERC1155Ext.getNFTs : ERC721Ext.getNFTs,
    {
      contract,
      start: queryParams.start,
      count: queryParams.count,
      includeOwners: true,
    },
  );

  // TODO: Add support for ERC1155 total circulating supply
  const nextTokenIdToMintQuery = useReadContract(
    isErc1155 ? ERC1155Ext.nextTokenIdToMint : ERC721Ext.nextTokenIdToMint,
    {
      contract,
    },
  );
  const totalSupplyQuery = useReadContract(ERC721Ext.totalSupply, {
    contract,
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
    nextTokenIdToMintQuery.isPending || totalSupplyQuery.isPending;

  const chainSlug = useChainSlug(contract.chain.id);

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
      <TableContainer
        maxW="100%"
        className="relative rounded-lg border border-border bg-card"
      >
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
          <Thead className="!bg-background">
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
                {/* Need to add an empty header for the drawer button */}
                <Th border="none" />
              </Tr>
            ))}
          </Thead>
          <Tbody
            {...getTableBodyProps()}
            position="relative"
            className="!bg-card"
          >
            {page.map((row, rowIndex) => {
              const failedToLoad = !row.original.tokenURI;
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  role="group"
                  className="bg-card hover:bg-accent/50"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const tokenId = row.original.id;
                    if (!tokenId && tokenId !== 0n) {
                      return;
                    }
                    router.push(
                      `/${chainSlug}/${contract.address}/nfts/${tokenId.toString()}`,
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
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        borderBottomWidth="inherit"
                        borderColor="borderColor"
                        maxW="sm"
                        // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                        key={cellIndex}
                      >
                        <ErrorBoundary FallbackComponent={NFTCellErrorBoundary}>
                          {cell.render("Cell")}
                        </ErrorBoundary>
                      </Td>
                    );
                  })}
                  <Td borderBottomWidth="inherit" borderColor="borderColor">
                    {!failedToLoad && <ArrowRightIcon className="size-4" />}
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
                  <p className="text-lg">Fetching new page</p>
                </Flex>
              </Flex>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-row items-center gap-1">
          <IconButton
            isDisabled={!canPreviousPage || queryLoading}
            aria-label="first page"
            icon={<ChevronFirstIcon className="size-4" />}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            isDisabled={!canPreviousPage || queryLoading}
            aria-label="previous page"
            icon={<ChevronLeftIcon className="size-4" />}
            onClick={() => previousPage()}
          />
          <p className="whitespace-nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton as="span" display="inline" isLoaded={querySuccess}>
              <strong>{pageCount}</strong>
            </Skeleton>
          </p>
          <IconButton
            isDisabled={!canNextPage || queryLoading}
            aria-label="next page"
            icon={<ChevronRightIcon className="size-4" />}
            onClick={() => nextPage()}
          />
          <IconButton
            isDisabled={!canNextPage || queryLoading}
            aria-label="last page"
            icon={<ChevronLastIcon className="size-4" />}
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
        </div>
      </div>
    </Flex>
  );
};

function NFTCellErrorBoundary(errorProps: FallbackProps) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    Sentry.withScope((scope) => {
      scope.setTag("component-crashed", "true");
      scope.setTag("component-crashed-boundary", "NFTCellErrorBoundary");
      scope.setLevel("fatal");
      Sentry.captureException(errorProps.error);
    });
  }, [errorProps.error]);

  return (
    <CopyTextButton
      textToShow={errorProps.error.message}
      textToCopy={errorProps.error.message}
      copyIconPosition="left"
      tooltip={errorProps.error.message}
      className="max-w-[250px] truncate text-destructive-text"
    />
  );
}
