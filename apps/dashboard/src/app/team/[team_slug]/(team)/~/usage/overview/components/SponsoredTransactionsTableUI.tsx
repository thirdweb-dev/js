"use client";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { PaginationButtons } from "@/components/pagination-buttons";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChainIcon } from "components/icons/ChainIcon";
import { format, formatDistance } from "date-fns";
import { useAllChainsData } from "hooks/chains/allChains";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";

export type SponsoredTransaction = {
  timestamp: string;
  teamId: string;
  projectId: string;
  chainId: string;
  transactionFee: number;
  transactionFeeUsd: number;
  walletAddress: string;
  transactionHash: string;
  userOpHash: string;
};

export function SponsoredTransactionsTableUI(
  props: {
    sponsoredTransactions: SponsoredTransaction[];
    isPending: boolean;
    isError: boolean;
    teamSlug: string;
    client: ThirdwebClient;
    pageSize: number;
    setPageNumber: (pageNumber: number) => void;
    pageNumber: number;
    totalPages: number;
    filters: { chainId?: string; projectId?: string };
    setFilters: (filters: { chainId?: string; projectId?: string }) => void;
  } & (
    | {
        variant: "team";
        projects: {
          id: string;
          name: string;
          image: string | null;
          slug: string;
        }[];
        getCSV: () => Promise<string>;
      }
    | {
        variant: "project";
      }
  ),
) {
  const showPagination = props.totalPages > 1;

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* header */}
      <div className="flex flex-col justify-between gap-3 border-b px-4 py-4 lg:flex-row lg:items-center lg:px-6">
        <h2 className="font-semibold text-xl">Sponsored Transactions</h2>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Filters */}
          <div className="flex gap-2">
            {props.variant === "team" && (
              <ProjectFilter
                projectId={props.filters.projectId}
                setProjectId={(projectId) =>
                  props.setFilters({ ...props.filters, projectId })
                }
                projects={props.projects}
                client={props.client}
              />
            )}

            <ChainFilter
              chainId={props.filters.chainId}
              setChainId={(chainId) =>
                props.setFilters({ ...props.filters, chainId })
              }
            />
          </div>

          {props.variant === "team" && (
            <>
              <div className="hidden h-4 w-[1px] border bg-border lg:block" />
              <ExportToCSVButton
                className="bg-background"
                getData={props.getCSV}
                fileName="sponsored-transactions"
              />
            </>
          )}
        </div>
      </div>

      <TableContainer className={"rounded-none border-none"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              {props.variant === "team" && <TableHead>Project</TableHead>}
              <TableHead>Chain</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!props.isPending
              ? props.sponsoredTransactions.map((transaction) => (
                  <TableRow key={transaction.transactionHash}>
                    {/* Tx Hash */}
                    <TableCell>
                      <TransactionHashCell
                        hash={transaction.transactionHash}
                        chainId={transaction.chainId}
                      />
                    </TableCell>

                    {/* Project */}
                    {props.variant === "team" && (
                      <TableCell>
                        <ProjectCell
                          teamSlug={props.teamSlug}
                          project={props.projects.find(
                            (p) => p.id === transaction.projectId,
                          )}
                          client={props.client}
                        />
                      </TableCell>
                    )}

                    {/* Chain */}
                    <TableCell>
                      <ChainCell chainId={transaction.chainId} />
                    </TableCell>

                    {/* Wallet */}
                    <TableCell>
                      <WalletAddress address={transaction.walletAddress} />
                    </TableCell>

                    {/* Time */}
                    <TableCell>
                      <ToolTipLabel
                        hoverable
                        label={format(new Date(transaction.timestamp), "PPpp")}
                      >
                        <span>
                          {formatDistance(
                            new Date(transaction.timestamp),
                            new Date(),
                            {
                              addSuffix: true,
                            },
                          )}
                        </span>
                      </ToolTipLabel>
                    </TableCell>

                    {/* Fee */}
                    <TableCell>
                      <TransactionFeeCell
                        usdValue={transaction.transactionFeeUsd}
                      />
                    </TableCell>
                  </TableRow>
                ))
              : Array.from({ length: props.pageSize }).map((_, index) => (
                  <SkeletonRow
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={`skeleton-${index}`}
                    variant={props.variant}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!props.isPending && (
        // biome-ignore lint/complexity/noUselessFragments: better readability
        <>
          {props.isError ? (
            <div className="px-6 py-24">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full border p-2">
                  <XIcon className="size-5" />
                </div>
              </div>
              <p className="text-center text-destructive-text text-sm">
                Failed to load sponsored transactions
              </p>
            </div>
          ) : props.sponsoredTransactions.length === 0 ? (
            <div className="px-6 py-24">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full border p-2">
                  <XIcon className="size-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-center text-muted-foreground text-sm">
                No sponsored transactions
              </p>
            </div>
          ) : null}
        </>
      )}

      {showPagination && (
        <div className="flex justify-end gap-3 rounded-b-lg border-t p-4">
          <PaginationButtons
            activePage={props.pageNumber}
            totalPages={props.totalPages}
            onPageClick={(page) => props.setPageNumber(page)}
          />
        </div>
      )}
    </div>
  );
}

function SkeletonRow(props: { variant: "team" | "project" }) {
  return (
    <TableRow className="h-[72.5px]">
      {/* Tx Hash */}
      <TableCell>
        <Skeleton className="h-7 w-[160px]" />
      </TableCell>

      {/* Project */}
      {props.variant === "team" && (
        <TableCell>
          <Skeleton className="h-7 w-[145px]" />
        </TableCell>
      )}

      {/* Chain */}
      <TableCell>
        <Skeleton className="h-7 w-[130px]" />
      </TableCell>

      {/* Wallet */}
      <TableCell>
        <Skeleton className="h-7 w-[130px]" />
      </TableCell>

      {/* Time */}
      <TableCell>
        <Skeleton className="h-7 w-[80px]" />
      </TableCell>

      {/* Fee */}
      <TableCell>
        <Skeleton className="h-7 w-[40px]" />
      </TableCell>
    </TableRow>
  );
}

function TransactionHashCell(props: { hash: string; chainId: string }) {
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(Number(props.chainId));

  const explorerUrl = chain?.explorers?.[0]?.url;
  const txHashToShow = `${props.hash.slice(0, 6)}...${props.hash.slice(-4)}`;

  if (explorerUrl) {
    return (
      <Button size="sm" variant="ghost" asChild>
        <Link
          href={`${explorerUrl}/tx/${props.hash}`}
          target="_blank"
          className="-translate-x-2 gap-2 font-mono"
        >
          {txHashToShow}
          <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
        </Link>
      </Button>
    );
  }

  return (
    <CopyTextButton
      textToCopy={props.hash}
      textToShow={txHashToShow}
      tooltip="Transaction Hash"
      copyIconPosition="right"
      className="-translate-x-2 font-mono"
      variant="ghost"
    />
  );
}

function ChainCell(props: { chainId: string }) {
  const { idToChain, allChains } = useAllChainsData();
  const chain = idToChain.get(Number(props.chainId));

  if (allChains.length === 0) {
    return <Skeleton className="w-[100px]" />;
  }

  return (
    <div className="relative flex w-max items-center gap-2">
      <ChainIcon ipfsSrc={chain?.icon?.url} className="size-6" />
      <Link
        target="_blank"
        href={`/${chain ? chain.slug : props.chainId}`}
        className="before:absolute before:inset-0 hover:underline hover:underline-offset-4"
      >
        {chain ? chain.name : `Chain #${props.chainId}`}
      </Link>
    </div>
  );
}

function ProjectCell(props: {
  teamSlug: string;
  project:
    | {
        id: string;
        name: string;
        image: string | null;
        slug: string;
      }
    | undefined;
  client: ThirdwebClient;
}) {
  // just typeguard - never actually happens
  if (!props.project) {
    return <Skeleton className="h-6 w-[130px]" />;
  }

  return (
    <div className="relative flex w-max items-center gap-2">
      <ProjectAvatar
        src={props.project.image || ""}
        className="size-6 shrink-0"
        client={props.client}
      />
      <Link
        href={`/team/${props.teamSlug}/${props.project.slug}`}
        className="before:absolute before:inset-0 hover:underline hover:underline-offset-4"
        target="_blank"
      >
        {props.project.name}
      </Link>
    </div>
  );
}

function ChainFilter(props: {
  chainId: string | undefined;
  setChainId: (chainId: string | undefined) => void;
}) {
  const isChainFilterActive = props.chainId !== undefined;

  return (
    <div className="flex bg-background">
      {isChainFilterActive && (
        <ToolTipLabel label="Remove chain filter">
          <Button
            variant="outline"
            size="icon"
            className="rounded-r-none border-r-0 px-3 text-muted-foreground"
            onClick={() => props.setChainId(undefined)}
          >
            <XIcon className="size-4" />
          </Button>
        </ToolTipLabel>
      )}

      <SingleNetworkSelector
        className={cn(isChainFilterActive && "rounded-l-none")}
        chainId={props.chainId ? Number(props.chainId) : undefined}
        onChange={(chainId) => props.setChainId(chainId.toString())}
        popoverContentClassName="!w-[80vw] md:!w-[350px]"
        align="end"
        placeholder="All Chains"
        disableChainId
      />
    </div>
  );
}

function ProjectFilter(props: {
  projectId: string | undefined;
  setProjectId: (projectId: string | undefined) => void;
  projects: { id: string; name: string; image: string | null }[];
  client: ThirdwebClient;
}) {
  const isProjectFilterActive = props.projectId !== undefined;

  return (
    <div className="flex bg-background">
      {isProjectFilterActive && (
        <ToolTipLabel label="Remove project filter">
          <Button
            variant="outline"
            size="icon"
            className="rounded-r-none border-r-0 px-3 text-muted-foreground"
            onClick={() => props.setProjectId(undefined)}
          >
            <XIcon className="size-4" />
          </Button>
        </ToolTipLabel>
      )}

      <SelectWithSearch
        onValueChange={(value) => props.setProjectId(value)}
        options={props.projects.map((project) => ({
          label: project.name,
          value: project.id,
        }))}
        value={props.projectId}
        placeholder="All Projects"
        popoverContentClassName="!w-[80vw] md:!w-[350px]"
        align="end"
        className={cn(
          "min-w-[160px]",
          isProjectFilterActive && "rounded-l-none",
        )}
        renderOption={(option) => {
          const project = props.projects.find((p) => p.id === option.value);
          if (!project) {
            return <></>;
          }
          return (
            <div className="flex items-center gap-2">
              <ProjectAvatar
                src={project.image || ""}
                className="size-6 shrink-0"
                client={props.client}
              />
              <span>{project.name}</span>
            </div>
          );
        }}
      />
    </div>
  );
}

// for values >= 0.01, show 2 decimal places
const normalValueUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "standard",
  maximumFractionDigits: 2,
});

function formatTransactionFee(usdValue: number) {
  if (usdValue >= 0.01 || usdValue === 0) {
    return normalValueUSDFormatter.format(usdValue);
  }

  return "< $0.01";
}

function TransactionFeeCell(props: { usdValue: number }) {
  return (
    <ToolTipLabel label={`$${props.usdValue}`}>
      <span>{formatTransactionFee(props.usdValue)}</span>
    </ToolTipLabel>
  );
}
