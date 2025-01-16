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
import { SkeletonContainer } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type useAllContractList,
  useRemoveContractMutation,
} from "@3rdweb-sdk/react/hooks/useRegistry";
import { ChainIcon } from "components/icons/ChainIcon";
import { NetworkSelectDropdown } from "components/selects/NetworkSelectDropdown";
import type { BasicContract } from "contract-ui/types/types";
import { EllipsisVerticalIcon, XIcon } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import {
  type Column,
  type ColumnInstance,
  type Row,
  useFilters,
  usePagination,
  useTable,
} from "react-table";
import { useAllChainsData } from "../../../hooks/chains/allChains";
import { AsyncContractNameCell, AsyncContractTypeCell } from "./cells";
import { ShowMoreButton } from "./show-more-button";

interface DeployedContractsProps {
  contractList: ReturnType<typeof useAllContractList>["data"];
  limit?: number;
  onContractRemoved?: () => void;
}

export const DeployedContracts: React.FC<DeployedContractsProps> = ({
  contractList,
  limit = 10,
  onContractRemoved,
}) => {
  const chainIdsWithDeployments = useMemo(() => {
    const set = new Set<number>();
    // biome-ignore lint/complexity/noForEach: FIXME
    contractList.forEach((contract) => {
      set.add(contract.chainId);
    });
    return [...set];
  }, [contractList]);

  return (
    <div className="flex flex-col gap-8">
      <ContractTable
        combinedList={contractList}
        limit={limit}
        chainIdsWithDeployments={chainIdsWithDeployments}
        onContractRemoved={onContractRemoved}
      />

      {contractList.length === 0 && (
        <div className="flex h-[100px] items-center justify-center text-muted-foreground">
          No contracts found
        </div>
      )}
    </div>
  );
};

type RemoveFromDashboardButtonProps = {
  chainId: number;
  contractAddress: string;
  onContractRemoved?: () => void;
};

const RemoveFromDashboardButton: React.FC<RemoveFromDashboardButtonProps> = ({
  chainId,
  contractAddress,
  onContractRemoved,
}) => {
  const mutation = useRemoveContractMutation();

  return (
    <Button
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        mutation.mutateAsync(
          { chainId, contractAddress },
          {
            onSuccess: () => {
              onContractRemoved?.();
            },
          },
        );
      }}
      disabled={mutation.isPending}
      className="!bg-background hover:!bg-accent gap-2"
    >
      {mutation.isPending ? (
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
  limit: number;
  chainIdsWithDeployments: number[];
  onContractRemoved?: () => void;
}

const ContractTable: React.FC<ContractTableProps> = ({
  combinedList,
  limit,
  chainIdsWithDeployments,
  onContractRemoved,
}) => {
  const { idToChain } = useAllChainsData();

  const columns: Column<(typeof combinedList)[number]>[] = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row) => row.address,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return <AsyncContractNameCell cell={cell.row.original} linkOverlay />;
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
          const data = idToChain.get(cell.row.original.chainId);
          const cleanedChainName =
            data?.name?.replace("Mainnet", "").trim() ||
            `Unknown Network (#${cell.row.original.chainId})`;
          return (
            <div className="flex items-center gap-2">
              <ChainIcon className="size-5" ipfsSrc={data?.icon?.url} />
              <SkeletonContainer
                loadedData={data ? cleanedChainName : undefined}
                skeletonData={`Chain ID ${cell.row.original.chainId}`}
                render={(v) => {
                  return <p className="text-muted-foreground text-sm">{v}</p>;
                }}
              />

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
              className="relative z-10"
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
                  className="relative z-10"
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
                  onContractRemoved={onContractRemoved}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [chainIdsWithDeployments, idToChain, onContractRemoved],
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
                  <p className="text-muted-foreground text-sm">
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
    </TableContainer>
  );
};

const ContractTableRow = memo(({ row }: { row: Row<BasicContract> }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key, ...rowProps } = row.getRowProps();

  return (
    <TableRow
      {...rowProps}
      role="group"
      linkBox
      className="cursor-pointer hover:bg-accent/50"
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
