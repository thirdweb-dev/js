"use client";

import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  CheckCircle2Icon,
  CircleAlertIcon,
  ClockIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getSolscanUrl } from "../../lib/solana-utils";
import type { SolanaWallet } from "../../solana-wallets/wallet-table/types";
import type {
  SolanaTransaction,
  SolanaTransactionStatus,
  SolanaTransactionsResponse,
} from "./types";

export function SolanaTransactionsTableUI(props: {
  project: Project;
  wallets?: SolanaWallet[];
  teamSlug: string;
  client: ThirdwebClient;
  getData: (params: {
    page: number;
    status?: SolanaTransactionStatus;
    id?: string;
    from?: string;
  }) => Promise<SolanaTransactionsResponse>;
}) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    SolanaTransactionStatus | "all"
  >("all");

  const transactionsQuery = useQuery({
    queryKey: ["solana-transactions", page, statusFilter],
    queryFn: async () => {
      return await props.getData({
        page,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
    },
  });

  const totalPages = transactionsQuery.data
    ? Math.ceil(transactionsQuery.data.pagination.totalCount / 20)
    : 1;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col lg:flex-row lg:justify-between p-4 lg:px-6 py-5 lg:items-center gap-5">
          <div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Solana Transactions
            </h2>
            <p className="text-muted-foreground text-sm">
              Monitor and manage your Solana transactions
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-5 border-t lg:border-t-0 pt-5 lg:pt-0 border-dashed">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as SolanaTransactionStatus | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TableContainer className="rounded-none border-x-0 border-b-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Signer</TableHead>
                <TableHead>Chain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Queued At</TableHead>
                <TableHead>Signature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsQuery.isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-36" />
                    </TableCell>
                  </TableRow>
                ))
              ) : transactionsQuery.data?.transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="py-24 flex flex-col items-center justify-center px-4 text-center gap-4">
                      <div className="p-2 rounded-full bg-background border border-border">
                        <XIcon className="size-5 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        No Solana transactions found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactionsQuery.data?.transactions.map((transaction) => (
                  <SolanaTransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    project={props.project}
                    teamSlug={props.teamSlug}
                    client={props.client}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <div className="flex flex-col items-center border-t p-6">
            <div className="mb-4 text-muted-foreground text-sm">
              Found {transactionsQuery.data?.pagination.totalCount ?? 0} Solana
              transactions
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    asChild
                  >
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={`page-${pageNumber}`}>
                      <Button
                        variant="ghost"
                        onClick={() => setPage(pageNumber)}
                        asChild
                      >
                        <PaginationLink isActive={page === pageNumber}>
                          {pageNumber}
                        </PaginationLink>
                      </Button>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    asChild
                  >
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

function SolanaTransactionRow(props: {
  transaction: SolanaTransaction;
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
}) {
  const { transaction, client } = props;

  return (
    <TableRow>
      {/* Transaction ID */}
      <TableCell>
        <code className="text-xs">{transaction.id.slice(0, 12)}...</code>
      </TableCell>

      {/* Signer */}
      <TableCell>
        <WalletAddress address={transaction.signerAddress} client={client} />
      </TableCell>

      {/* Chain */}
      <TableCell>
        <span className="text-sm">{transaction.chainId}</span>
      </TableCell>

      {/* Status */}
      <TableCell>
        <TransactionStatusBadge status={transaction.status ?? "QUEUED"} />
      </TableCell>

      {/* Queued At */}
      <TableCell>
        <TransactionDateCell date={transaction.createdAt} />
      </TableCell>

      {/* Signature */}
      <TableCell>
        {transaction.signature ? (
          <Link
            href={getSolscanUrl(transaction.signature, transaction.chainId)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-link-foreground hover:underline"
          >
            {transaction.signature.slice(0, 12)}...
          </Link>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function TransactionStatusBadge({
  status,
}: {
  status: SolanaTransactionStatus;
}) {
  const variants: Record<
    SolanaTransactionStatus,
    {
      variant: "default" | "success" | "destructive" | "warning";
      icon: React.ReactNode;
    }
  > = {
    QUEUED: {
      variant: "default",
      icon: <ClockIcon className="size-3" />,
    },
    SUBMITTED: {
      variant: "warning",
      icon: <ClockIcon className="size-3" />,
    },
    CONFIRMED: {
      variant: "success",
      icon: <CheckCircle2Icon className="size-3" />,
    },
    FAILED: {
      variant: "destructive",
      icon: <CircleAlertIcon className="size-3" />,
    },
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} className="gap-1.5 text-xs">
      {config.icon}
      {status}
    </Badge>
  );
}

function TransactionDateCell({ date }: { date: string | Date }) {
  if (!date) {
    return <span className="text-muted-foreground">-</span>;
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  return (
    <ToolTipLabel label={format(dateObj, "PP pp z")}>
      <p className="text-sm">
        {formatDistanceToNowStrict(dateObj, { addSuffix: true })}
      </p>
    </ToolTipLabel>
  );
}
