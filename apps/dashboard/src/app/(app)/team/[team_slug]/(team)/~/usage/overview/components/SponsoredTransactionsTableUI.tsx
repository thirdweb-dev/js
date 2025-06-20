"use client";
import { ChainIconClient } from "components/icons/ChainIcon";
import { format, formatDistance } from "date-fns";
import { useAllChainsData } from "hooks/chains/allChains";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import { ProjectAvatar } from "@/components/blocks/Avatars/ProjectAvatar";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { PaginationButtons } from "@/components/pagination-buttons";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
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
                client={props.client}
                projectId={props.filters.projectId}
                projects={props.projects}
                setProjectId={(projectId) =>
                  props.setFilters({ ...props.filters, projectId })
                }
              />
            )}

            <ChainFilter
              chainId={props.filters.chainId}
              client={props.client}
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
                fileName="sponsored-transactions"
                getData={props.getCSV}
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
              ? props.sponsoredTransactions.map((transaction) => {
                  const utcTimestamp = transaction.timestamp.endsWith("Z")
                    ? transaction.timestamp
                    : `${transaction.timestamp}Z`;

                  return (
                    <TableRow key={transaction.transactionHash}>
                      {/* Tx Hash */}
                      <TableCell>
                        <TransactionHashCell
                          chainId={transaction.chainId}
                          hash={transaction.transactionHash}
                        />
                      </TableCell>

                      {/* Project */}
                      {props.variant === "team" && (
                        <TableCell>
                          <ProjectCell
                            client={props.client}
                            project={props.projects.find(
                              (p) => p.id === transaction.projectId,
                            )}
                            teamSlug={props.teamSlug}
                          />
                        </TableCell>
                      )}

                      {/* Chain */}
                      <TableCell>
                        <ChainCell
                          chainId={transaction.chainId}
                          client={props.client}
                        />
                      </TableCell>

                      {/* Wallet */}
                      <TableCell>
                        <WalletAddress
                          address={transaction.walletAddress}
                          client={props.client}
                        />
                      </TableCell>

                      {/* Time */}
                      <TableCell>
                        <ToolTipLabel
                          hoverable
                          label={format(new Date(utcTimestamp), "PPpp")}
                        >
                          <span>
                            {formatDistance(
                              new Date(utcTimestamp),
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
                  );
                })
              : Array.from({ length: props.pageSize }).map((_, index) => (
                  <SkeletonRow
                    // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
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
            onPageClick={(page) => props.setPageNumber(page)}
            totalPages={props.totalPages}
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
      <Button asChild size="sm" variant="ghost">
        <Link
          className="-translate-x-2 gap-2 font-mono"
          href={`${explorerUrl}/tx/${props.hash}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {txHashToShow}
          <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
        </Link>
      </Button>
    );
  }

  return (
    <CopyTextButton
      className="-translate-x-2 font-mono"
      copyIconPosition="right"
      textToCopy={props.hash}
      textToShow={txHashToShow}
      tooltip="Transaction Hash"
      variant="ghost"
    />
  );
}

function ChainCell(props: { chainId: string; client: ThirdwebClient }) {
  const { idToChain, allChains } = useAllChainsData();
  const chain = idToChain.get(Number(props.chainId));

  if (allChains.length === 0) {
    return <Skeleton className="w-[100px]" />;
  }

  return (
    <div className="relative flex w-max items-center gap-2">
      <ChainIconClient
        className="size-6"
        client={props.client}
        src={chain?.icon?.url}
      />
      <Link
        className="before:absolute before:inset-0 hover:underline hover:underline-offset-4"
        href={`/${chain ? chain.slug : props.chainId}`}
        rel="noopener noreferrer"
        target="_blank"
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
        className="size-6 shrink-0"
        client={props.client}
        src={props.project.image || ""}
      />
      <Link
        className="before:absolute before:inset-0 hover:underline hover:underline-offset-4"
        href={`/team/${props.teamSlug}/${props.project.slug}`}
        rel="noopener noreferrer"
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
  client: ThirdwebClient;
}) {
  const isChainFilterActive = props.chainId !== undefined;

  return (
    <div className="flex bg-background">
      {isChainFilterActive && (
        <ToolTipLabel label="Remove chain filter">
          <Button
            className="rounded-r-none border-r-0 px-3 text-muted-foreground"
            onClick={() => props.setChainId(undefined)}
            size="icon"
            variant="outline"
          >
            <XIcon className="size-4" />
          </Button>
        </ToolTipLabel>
      )}

      <SingleNetworkSelector
        align="end"
        chainId={props.chainId ? Number(props.chainId) : undefined}
        className={cn(isChainFilterActive && "rounded-l-none")}
        client={props.client}
        disableChainId
        onChange={(chainId) => props.setChainId(chainId.toString())}
        placeholder="All Chains"
        popoverContentClassName="!w-[80vw] md:!w-[350px]"
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
            className="rounded-r-none border-r-0 px-3 text-muted-foreground"
            onClick={() => props.setProjectId(undefined)}
            size="icon"
            variant="outline"
          >
            <XIcon className="size-4" />
          </Button>
        </ToolTipLabel>
      )}

      <SelectWithSearch
        align="end"
        className={cn(
          "min-w-[160px]",
          isProjectFilterActive && "rounded-l-none",
        )}
        onValueChange={(value) => props.setProjectId(value)}
        options={props.projects.map((project) => ({
          label: project.name,
          value: project.id,
        }))}
        placeholder="All Projects"
        popoverContentClassName="!w-[80vw] md:!w-[350px]"
        renderOption={(option) => {
          const project = props.projects.find((p) => p.id === option.value);
          if (!project) {
            return <></>;
          }
          return (
            <div className="flex items-center gap-2">
              <ProjectAvatar
                className="size-6 shrink-0"
                client={props.client}
                src={project.image || ""}
              />
              <span>{project.name}</span>
            </div>
          );
        }}
        value={props.projectId}
      />
    </div>
  );
}

// for values >= 0.01, show 2 decimal places
const normalValueUSDFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 2,
  notation: "standard",
  style: "currency",
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
