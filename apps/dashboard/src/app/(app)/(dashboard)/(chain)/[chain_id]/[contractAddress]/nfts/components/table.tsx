/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: FIXME */
"use client";

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
import { UnexpectedValueErrorMessage } from "@/components/blocks/error-fallbacks/unexpect-value-error-message";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

interface ContractOverviewNFTGetAllProps {
  contract: ThirdwebContract;
  isErc721: boolean;
  tokenByIndex: boolean;
  projectMeta: ProjectMeta | undefined;
}
export const NFTGetAllTable: React.FC<ContractOverviewNFTGetAllProps> = ({
  contract,
  isErc721,
  tokenByIndex,
  projectMeta,
}) => {
  // if it's not erc721, it's erc1155
  const isErc1155 = !isErc721;

  const router = useDashboardRouter();

  const tableColumns = useMemo(() => {
    const cols: Column<NFT>[] = [
      {
        accessor: (row) =>
          row.id?.toString().length > 8
            ? `${row.id.toString().slice(0, 4)}...${row.id.toString().slice(-4)}`
            : row.id?.toString(),
        Cell: (cell: CellProps<NFT, string>) => <p>{cell.value}</p>,
        Header: "Token Id",
      },
      {
        accessor: (row) => row.metadata,
        Cell: (cell: CellProps<NFT, NFT["metadata"]>) => (
          <MediaCell cell={cell} client={contract.client} />
        ),
        Header: "Media",
      },
      {
        accessor: (row) => row.metadata.name,
        Cell: (cell: CellProps<NFT, string>) => {
          if (typeof cell.value !== "string") {
            return (
              <UnexpectedValueErrorMessage
                className="w-[300px] py-3"
                description="Name is not a string"
                title="Invalid Name"
                value={cell.value}
              />
            );
          }

          return (
            <p className="line-clamp-1 text-muted-foreground text-sm">
              {cell.value}
            </p>
          );
        },
        Header: "Name",
      },
      {
        accessor: (row) => row.metadata.description,
        Cell: (cell: CellProps<NFT, string>) => {
          if (cell.value && typeof cell.value !== "string") {
            return (
              <UnexpectedValueErrorMessage
                className="w-[300px] py-3"
                description="Description is not a string"
                title="Invalid description"
                value={cell.value}
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
        Header: "Description",
      },
    ];
    if (isErc721) {
      cols.push({
        accessor: (row) => row.owner,
        Cell: (cell: CellProps<NFT, string>) => (
          <WalletAddress address={cell.value} client={contract.client} />
        ),
        Header: "Owner",
      });
    }
    if (isErc1155) {
      cols.push({
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
        Header: "Circulating Supply",
      });
    }
    return cols;
  }, [isErc721, isErc1155, contract.client]);

  const [queryParams, setQueryParams] = useState({ count: 50, start: 0 });

  const getNFTsQuery = useReadContract(
    isErc1155 ? ERC1155Ext.getNFTs : ERC721Ext.getNFTs,
    {
      contract,
      count: queryParams.count,
      includeOwners: true,
      start: queryParams.start,
      tokenByIndex,
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
        pageIndex: 0,
        pageSize: queryParams.count,
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
    setQueryParams({ count: pageSize, start: pageIndex * pageSize });
  }, [pageIndex, pageSize]);

  return (
    <Flex direction="column" gap={4}>
      <TableContainer
        className="relative rounded-lg border border-border bg-card"
        maxW="100%"
      >
        {getNFTsQuery.isFetching && (
          <Spinner
            color="primary"
            position="absolute"
            right={4}
            size="xs"
            top={2}
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
                <Th border="none" key="drawer" />
              </Tr>
            ))}
          </Thead>
          <Tbody
            {...getTableBodyProps()}
            className="!bg-card"
            position="relative"
          >
            {page.map((row, rowIndex) => {
              const failedToLoad = !row.original.tokenURI;
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  _last={{ borderBottomWidth: 0 }}
                  borderBottomWidth={1}
                  borderColor="borderColor"
                  className="bg-card hover:bg-accent/50"
                  cursor={failedToLoad ? "not-allowed" : "pointer"}
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  key={rowIndex}
                  onClick={() => {
                    const tokenId = row.original.id;
                    if (!tokenId && tokenId !== 0n) {
                      return;
                    }

                    const path = buildContractPagePath({
                      chainIdOrSlug: chainSlug.toString(),
                      contractAddress: contract.address,
                      projectMeta,
                      subpath: `/nfts/${tokenId.toString()}`,
                    });

                    router.push(path, {
                      scroll: true,
                    });
                  }}
                  opacity={failedToLoad ? 0.3 : 1}
                  pointerEvents={failedToLoad ? "none" : "auto"}
                  // biome-ignore lint/a11y/useSemanticElements: FIXME
                  role="group"
                  style={{ cursor: "pointer" }}
                >
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        borderBottomWidth="inherit"
                        borderColor="borderColor"
                        // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                        key={cellIndex}
                        maxW="sm"
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
                _dark={{ bg: "whiteAlpha.50" }}
                align="flex-end"
                backdropFilter="blur(5px)"
                bg="blackAlpha.100"
                borderRadius="md"
                bottom={0}
                justify="center"
                left={0}
                p={8}
                position="absolute"
                right={0}
                top={0}
                zIndex="above"
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
            aria-label="first page"
            icon={<ChevronFirstIcon className="size-4" />}
            isDisabled={!canPreviousPage || queryLoading}
            onClick={() => gotoPage(0)}
          />
          <IconButton
            aria-label="previous page"
            icon={<ChevronLeftIcon className="size-4" />}
            isDisabled={!canPreviousPage || queryLoading}
            onClick={() => previousPage()}
          />
          <p className="whitespace-nowrap">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <Skeleton as="span" display="inline" isLoaded={querySuccess}>
              <strong>{pageCount}</strong>
            </Skeleton>
          </p>
          <IconButton
            aria-label="next page"
            icon={<ChevronRightIcon className="size-4" />}
            isDisabled={!canNextPage || queryLoading}
            onClick={() => nextPage()}
          />
          <IconButton
            aria-label="last page"
            icon={<ChevronLastIcon className="size-4" />}
            isDisabled={!canNextPage || queryLoading}
            onClick={() => gotoPage(pageCount - 1)}
          />

          <Select
            isDisabled={queryLoading}
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
      className="max-w-[250px] truncate text-destructive-text"
      copyIconPosition="left"
      textToCopy={errorProps.error.message}
      textToShow={errorProps.error.message}
      tooltip={errorProps.error.message}
    />
  );
}
