"use client";

import { useMutation } from "@tanstack/react-query";
import { ChainIconClient } from "components/icons/ChainIcon";
import { NetworkSelectDropdown } from "components/selects/NetworkSelectDropdown";
import { useAllChainsData } from "hooks/chains/allChains";
import { EllipsisVerticalIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { PaginationButtons } from "@/components/pagination-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { cn } from "@/lib/utils";
import type { ProjectContract } from "../../../app/(app)/account/contracts/_components/getProjectContracts";
import { removeContractFromProject } from "../../../app/(app)/team/[team_slug]/[project_slug]/(sidebar)/hooks/project-contracts";
import {
  ContractNameCell,
  ContractTypeCell,
  ContractTypeCellUI,
} from "./cells";

type ContractTableFilters = {
  chainId: number | undefined;
};

export function ContractTable(props: {
  contracts: ProjectContract[];
  pageSize: number;
  teamId: string;
  projectId: string;
  client: ThirdwebClient;
  variant: "asset" | "contract";
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <ContractTableUI
      client={props.client}
      contracts={props.contracts}
      pageSize={props.pageSize}
      projectSlug={props.projectSlug}
      removeContractFromProject={async (contractId) => {
        await removeContractFromProject({
          contractId,
          projectId: props.projectId,
          teamId: props.teamId,
        });
      }}
      teamSlug={props.teamSlug}
      variant={props.variant}
    />
  );
}

export function ContractTableUI(props: {
  contracts: ProjectContract[];
  pageSize: number;
  removeContractFromProject: (contractId: string) => Promise<void>;
  client: ThirdwebClient;
  variant: "asset" | "contract";
  teamSlug: string;
  projectSlug: string;
}) {
  // instantly update the table without waiting for router refresh by adding deleted contract ids to the state
  const [deletedContractIds, setDeletedContractIds] = useState<string[]>([]);

  const contracts = useMemo(() => {
    return props.contracts.filter(
      (contract) => !deletedContractIds.includes(contract.id),
    );
  }, [props.contracts, deletedContractIds]);

  const uniqueChainIds = useMemo(() => {
    const set = new Set<number>();
    for (const contract of contracts) {
      set.add(Number(contract.chainId));
    }
    return [...set];
  }, [contracts]);

  const [page, setPage] = useState(1);
  const [filters, _setFilters] = useState<ContractTableFilters>({
    chainId: undefined,
  });

  const setFilters = useCallback((filters: ContractTableFilters) => {
    setPage(1);
    _setFilters(filters);
  }, []);

  const filteredContracts = useMemo(() => {
    if (filters.chainId) {
      return contracts.filter(
        (contract) => Number(contract.chainId) === filters.chainId,
      );
    }
    return contracts;
  }, [contracts, filters.chainId]);

  const totalCount = filteredContracts.length;
  const showPagination = totalCount > props.pageSize;
  const totalPages = Math.ceil(totalCount / props.pageSize);

  const paginatedContracts = filteredContracts.slice(
    (page - 1) * props.pageSize,
    page * props.pageSize,
  );

  // when user deletes the last contract for a chain and that chain is set as filter - remove chain filter
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (filters.chainId && filteredContracts.length === 0) {
      setFilters({
        ...filters,
        chainId: undefined,
      });
    }
  }, [filters, filteredContracts, setFilters]);

  return (
    <div>
      <TableContainer className={cn(showPagination && "rounded-b-none")}>
        <Table>
          <TableHeader className="z-0">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="tracking-normal">
                <NetworkFilterCell
                  chainId={
                    filters.chainId ? filters.chainId.toString() : undefined
                  }
                  chainIds={uniqueChainIds}
                  client={props.client}
                  setChainId={(chainId) => {
                    setFilters({
                      ...filters,
                      chainId: chainId ? Number(chainId) : undefined,
                    });
                  }}
                />
              </TableHead>
              {props.variant === "contract" && (
                <TableHead>Contract Address</TableHead>
              )}

              {props.variant === "asset" && <TableHead> Token Page</TableHead>}

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedContracts.map((contract) => {
              return (
                <TableRow
                  className="cursor-pointer hover:bg-accent/50"
                  key={contract.id}
                  linkBox
                >
                  <TableCell>
                    <ContractNameCell
                      chainId={contract.chainId}
                      client={props.client}
                      contractAddress={contract.contractAddress}
                      linkOverlay
                      projectSlug={props.projectSlug}
                      teamSlug={props.teamSlug}
                    />
                  </TableCell>

                  <TableCell>
                    {contract.contractType &&
                    props.variant === "asset" &&
                    contractTypeToAssetTypeRecord[contract.contractType] ? (
                      <ContractTypeCellUI
                        name={
                          contractTypeToAssetTypeRecord[contract.contractType]
                        }
                      />
                    ) : (
                      <ContractTypeCell
                        chainId={contract.chainId}
                        client={props.client}
                        contractAddress={contract.contractAddress}
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <ChainNameCell
                      chainId={contract.chainId}
                      client={props.client}
                    />
                  </TableCell>

                  {props.variant === "contract" && (
                    <TableCell>
                      <CopyAddressButton
                        address={contract.contractAddress}
                        className="-translate-x-2 relative z-10"
                        copyIconPosition="left"
                        variant="ghost"
                      />
                    </TableCell>
                  )}

                  {props.variant === "asset" && (
                    <TableCell>
                      <Button asChild size="sm" variant="ghost">
                        <Link
                          className="-translate-x-2 relative z-10 flex items-center gap-1.5 text-muted-foreground"
                          href={`/${contract.chainId}/${contract.contractAddress}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View <ExternalLinkIcon className="size-3" />
                        </Link>
                      </Button>
                    </TableCell>
                  )}

                  <TableCell>
                    <ContractActionsCell
                      contractId={contract.id}
                      onContractRemoved={() => {
                        setDeletedContractIds((v) => {
                          return [...v, contract.id];
                        });
                      }}
                      removeContractFromProject={
                        props.removeContractFromProject
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {contracts.length === 0 && (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              {props.variant === "asset" ? (
                <p className="mb-3">No tokens found</p>
              ) : (
                <p className="mb-3">No contracts found</p>
              )}
              {props.variant === "contract" && (
                <Button asChild className="bg-background" variant="outline">
                  <Link
                    href="/explore"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Discover Contracts
                    <ExternalLinkIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </TableContainer>

      {showPagination && (
        <div className="rounded-b-lg border-x border-b bg-card py-6">
          <PaginationButtons
            activePage={page}
            onPageClick={setPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

const contractTypeToAssetTypeRecord: Record<string, string | undefined> = {
  DropERC20: "Coin",
  DropERC721: "NFT Collection",
  DropERC1155: "NFT Collection",
};

const NetworkFilterCell = React.memo(function NetworkFilterCell({
  chainId: selectedChain,
  setChainId: setSelectedChain,
  chainIds,
  client,
}: {
  chainId: string | undefined;
  setChainId: (chainId: string | undefined) => void;
  chainIds: number[];
  client: ThirdwebClient;
}) {
  if (chainIds.length < 2) {
    return <> NETWORK </>;
  }

  return (
    <NetworkSelectDropdown
      client={client}
      enabledChainIds={chainIds}
      onSelect={(chain) => setSelectedChain(chain)}
      selectedChain={selectedChain}
      useCleanChainName={true}
    />
  );
});

const ChainNameCell = React.memo(function ChainNameCell(props: {
  chainId: string;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const data = idToChain.get(Number(props.chainId));
  const cleanedChainName =
    data?.name?.replace("Mainnet", "").trim() ||
    `Unknown Network (#${props.chainId})`;
  return (
    <div className="flex items-center gap-2">
      <ChainIconClient
        className="size-5"
        client={props.client}
        src={data?.icon?.url}
      />
      <SkeletonContainer
        loadedData={data ? cleanedChainName : undefined}
        render={(v) => {
          return <p className="text-muted-foreground text-sm">{v}</p>;
        }}
        skeletonData={`Chain ID ${props.chainId}`}
      />

      {data?.testnet && (
        <Badge className="text-muted-foreground" variant="outline">
          Testnet
        </Badge>
      )}
    </div>
  );
});

const ContractActionsCell = React.memo(function ContractActionsCell(props: {
  contractId: string;
  removeContractFromProject: (contractId: string) => Promise<void>;
  onContractRemoved: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative z-10"
          onClick={(e) => e.stopPropagation()}
          size="icon"
          variant="ghost"
        >
          <EllipsisVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <RemoveContractButton
          contractId={props.contractId}
          onContractRemoved={props.onContractRemoved}
          removeContractFromProject={props.removeContractFromProject}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

function RemoveContractButton(props: {
  removeContractFromProject: (contractId: string) => Promise<void>;
  onContractRemoved?: () => void;
  contractId: string;
}) {
  const removeMutation = useMutation({
    mutationFn: props.removeContractFromProject,
  });

  return (
    <Button
      className="justify-start gap-2"
      disabled={removeMutation.isPending}
      onClick={(e) => {
        e.stopPropagation();
        removeMutation.mutateAsync(props.contractId, {
          onError: () => {
            toast.error("Failed to remove contract");
          },
          onSuccess: () => {
            props.onContractRemoved?.();
            toast.success("Contract removed successfully");
          },
        });
      }}
      variant="ghost"
    >
      {removeMutation.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <XIcon className="size-4 text-destructive-text" />
      )}
      Remove from project
    </Button>
  );
}
