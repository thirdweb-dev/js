"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import {
  type useAllContractList,
  useRemoveContractMutation,
} from "@3rdweb-sdk/react/hooks/useRegistry";
import { ChainIcon } from "components/icons/ChainIcon";
import { NetworkSelectDropdown } from "components/selects/NetworkSelectDropdown";
import type { BasicContract } from "contract-ui/types/types";
import { useAllChainsData } from "hooks/chains/allChains";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import {
  DownloadIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import {
  type Column,
  type ColumnInstance,
  type Row,
  useFilters,
  usePagination,
  useTable,
} from "react-table";
import { ImportModal } from "../import-contract/modal";
import { AsyncContractNameCell, AsyncContractTypeCell } from "./cells";
import { ShowMoreButton } from "./show-more-button";

interface DeployedContractsProps {
  noHeader?: boolean;
  contractListQuery: ReturnType<typeof useAllContractList>;
  limit?: number;
}

export const DeployedContracts: React.FC<DeployedContractsProps> = ({
  noHeader,
  contractListQuery,
  limit = 10,
}) => {
  const [importModalOpen, setImportModalOpen] = useState(false);

  const chainIdsWithDeployments = useMemo(() => {
    const set = new Set<number>();
    // biome-ignore lint/complexity/noForEach: FIXME
    contractListQuery.data.forEach((contract) => {
      set.add(contract.chainId);
    });
    return [...set];
  }, [contractListQuery.data]);

  return (
    <div className="flex flex-col gap-8">
      {!noHeader && (
        <>
          <ImportModal
            isOpen={importModalOpen}
            onClose={() => {
              setImportModalOpen(false);
            }}
          />
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4 md:py-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-1.5">
                Your contracts
              </h1>
              <p className="text-muted-foreground text-sm">
                The list of contract instances that you have deployed or
                imported with thirdweb across all networks
              </p>
            </div>
            <div className="flex gap-2 [&>*]:grow">
              <Button
                className="gap-2"
                variant="outline"
                onClick={() => setImportModalOpen(true)}
              >
                <DownloadIcon className="size-4" />
                Import contract
              </Button>
              <Button asChild className="gap-2">
                <Link href="/explore">
                  <PlusIcon className="size-4" />
                  Deploy contract
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}

      <ContractTable
        combinedList={contractListQuery.data}
        limit={limit}
        chainIdsWithDeployments={chainIdsWithDeployments}
        loading={contractListQuery.isLoading}
      />

      {contractListQuery.data.length === 0 && contractListQuery.isFetched && (
        <div className="flex items-center h-[100px] justify-center text-muted-foreground">
          No contracts found
        </div>
      )}
    </div>
  );
};

type RemoveFromDashboardButtonProps = {
  chainId: number;
  contractAddress: string;
};

const RemoveFromDashboardButton: React.FC<RemoveFromDashboardButtonProps> = ({
  chainId,
  contractAddress,
}) => {
  const mutation = useRemoveContractMutation();

  return (
    <Button
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        mutation.mutate({ chainId, contractAddress });
      }}
      disabled={mutation.isLoading}
      className="!bg-background hover:!bg-accent gap-2"
    >
      {mutation.isLoading ? (
        <Spinner className="size-4" />
      ) : (
        <XIcon className="size-4 text-destructive-text" />
      )}
      Remove from dashboard
    </Button>
  );
};

type SelectNetworkFilterProps = {
  column: ColumnInstance<BasicContract>;
  chainIdsWithDeployments: number[];
};

// This is a custom filter UI for selecting from a list of chains that the user deployed to
function SelectNetworkFilter({
  column: { setFilter, filterValue },
  chainIdsWithDeployments,
}: SelectNetworkFilterProps) {
  if (chainIdsWithDeployments.length < 2) {
    return <> NETWORK </>;
  }
  return (
    <NetworkSelectDropdown
      useCleanChainName={true}
      enabledChainIds={chainIdsWithDeployments}
      onSelect={(selectedChain) => {
        setFilter(selectedChain);
      }}
      selectedChain={filterValue as undefined | string}
    />
  );
}

interface ContractTableProps {
  combinedList: BasicContract[];
  isFetching?: boolean;
  limit: number;
  chainIdsWithDeployments: number[];
  loading: boolean;
}

const ContractTable: React.FC<ContractTableProps> = ({
  combinedList,
  isFetching,
  limit,
  chainIdsWithDeployments,
  loading,
}) => {
  const { chainIdToChainRecord } = useAllChainsData();
  const configuredChains = useSupportedChainsRecord();

  const columns: Column<(typeof combinedList)[number]>[] = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row) => row.address,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return <AsyncContractNameCell cell={cell.row.original} />;
        },
      },
      {
        Header: "Type",
        accessor: (row) => row.address,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => <AsyncContractTypeCell cell={cell.row.original} />,
      },
      {
        // No header, show filter instead
        Header: () => null,
        id: "Network",
        accessor: (row) => row.chainId,
        Filter: (props) => (
          <SelectNetworkFilter
            {...props}
            chainIdsWithDeployments={chainIdsWithDeployments}
          />
        ),
        filter: "equals",
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          const data =
            configuredChains[cell.row.original.chainId] ||
            chainIdToChainRecord[cell.row.original.chainId];
          const cleanedChainName =
            data?.name?.replace("Mainnet", "").trim() ||
            `Unknown Network (#${cell.row.original.chainId})`;
          return (
            <div className="flex items-center gap-2">
              <ChainIcon size={24} ipfsSrc={data?.icon?.url} />
              <p className="text-sm text-muted-foreground">
                {cleanedChainName}
              </p>
              {data?.testnet && (
                <Badge variant="outline" className="text-muted-foreground">
                  Testnet
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        Header: "Contract Address",
        accessor: (row) => row.address,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return (
            <CopyAddressButton
              copyIconPosition="left"
              address={cell.row.original.address}
              variant="ghost"
            />
          );
        },
      },
      {
        id: "actions",
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                onClick={(e) => e.stopPropagation()}
                className="bg-background"
              >
                <RemoveFromDashboardButton
                  contractAddress={cell.cell.row.original.address}
                  chainId={cell.cell.row.original.chainId}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [configuredChains, chainIdsWithDeployments, chainIdToChainRecord],
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: "",
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    setPageSize,
    state: { pageSize },
  } = useTable(
    {
      columns,
      data: combinedList,
      defaultColumn,
    },
    // these will be removed with the @tanstack/react-table v8 version
    // eslint-disable-next-line react-compiler/react-compiler
    useFilters,
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );

  // the ShowMoreButton component callback sets this state variable
  const [numRowsOnPage, setNumRowsOnPage] = useState(limit);
  // when the state variable is updated, update the page size

  // FIXME: re-work tables and pagination with @tanstack/table@latest - which (I believe) does not need this workaround anymore
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setPageSize(numRowsOnPage);
  }, [numRowsOnPage, setPageSize]);

  return (
    <TableContainer>
      {isFetching && <Spinner className="size-3 absolute top-2 right-4" />}

      <Table {...getTableProps()}>
        <TableHeader>
          {headerGroups.map((headerGroup, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, i) => (
                <TableHead
                  {...column.getHeaderProps()}
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  key={i}
                  className="py-3"
                >
                  <p className="text-sm text-muted-foreground">
                    {column.render("Header")}
                    <span>
                      {column.canFilter ? column.render("Filter") : null}
                    </span>
                  </p>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <ContractTableRow
                row={row}
                key={row.original.address + row.original.chainId}
              />
            );
          })}
        </TableBody>
      </Table>

      {canNextPage && (
        <ShowMoreButton
          limit={limit}
          showMoreLimit={pageSize}
          setShowMoreLimit={setNumRowsOnPage}
        />
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="flex gap-2 items-center text-muted-foreground">
            <Spinner className="size-3" />
            Loading contracts
          </div>
        </div>
      )}
    </TableContainer>
  );
};

const ContractTableRow = memo(({ row }: { row: Row<BasicContract> }) => {
  const chainSlug = useChainSlug(row.original.chainId);
  const router = useDashboardRouter();

  return (
    <TableRow
      {...row.getRowProps()}
      role="group"
      className="cursor-pointer hover:bg-muted/50"
      // TODO - replace this with before:absolute thing
      onClick={() => {
        router.push(`/${chainSlug}/${row.original.address}`);
      }}
    >
      {row.cells.map((cell, cellIndex) => {
        return (
          <TableCell
            className="py-3"
            {...cell.getCellProps()}
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            key={cellIndex}
          >
            {cell.render("Cell")}
          </TableCell>
        );
      })}
    </TableRow>
  );
});

ContractTableRow.displayName = "ContractTableRow";
