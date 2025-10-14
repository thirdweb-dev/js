"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  CheckIcon,
  MoreVerticalIcon,
  RefreshCcwIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { cn } from "@/lib/utils";
import { CreateSolanaWallet } from "../components/create-solana-wallet.client";
import { updateDefaultProjectSolanaWallet } from "../lib/vault.client";
import type { SolanaWallet } from "./types";

export function SolanaWalletsTableUI({
  wallets,
  project,
  teamSlug,
  managementAccessToken,
  totalRecords,
  currentPage,
  totalPages,
  client,
}: {
  wallets: SolanaWallet[];
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  client: ThirdwebClient;
}) {
  const queryClient = useQueryClient();

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col lg:flex-row lg:justify-between p-4 lg:px-6 py-5 lg:items-center gap-5">
          <div>
            <div className="flex mb-3">
              <div className="p-2 rounded-full bg-background border border-border">
                <WalletProductIcon className="size-5 text-muted-foreground" />
              </div>
            </div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Solana Server Wallets
            </h2>
            <p className="text-muted-foreground text-sm">
              Create and manage Solana server wallets for your project
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-5 border-t lg:border-t-0 pt-5 lg:pt-0 border-dashed">
            <div className="flex flex-row gap-2.5">
              <CreateSolanaWallet
                managementAccessToken={managementAccessToken}
                project={project}
                teamSlug={teamSlug}
              />
            </div>
          </div>
        </div>

        <TableContainer className="rounded-none border-x-0 border-b-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead className="w-[280px]">Public Key</TableHead>
                <TableHead className="min-w-[80px]">
                  <div className="flex w-[180px] items-center gap-1.5">
                    Balance
                    {wallets.length > 0 && (
                      <ToolTipLabel
                        contentClassName="capitalize font-normal tracking-normal leading-normal"
                        label="Refresh Balance"
                      >
                        <Button
                          className="z-20 h-auto p-1.5 [&[data-pending='true']_svg]:animate-spin"
                          onClick={async (e) => {
                            const buttonEl = e.currentTarget;
                            buttonEl.setAttribute("data-pending", "true");
                            await queryClient.invalidateQueries({
                              queryKey: ["solanaWalletBalance"],
                            });

                            buttonEl.setAttribute("data-pending", "false");
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <RefreshCcwIcon className="size-4" />
                        </Button>
                      </ToolTipLabel>
                    )}
                  </div>
                </TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets.map((wallet) => (
                <SolanaWalletTableRow
                  key={wallet.id}
                  wallet={wallet}
                  project={project}
                  teamSlug={teamSlug}
                  client={client}
                />
              ))}
            </TableBody>
          </Table>

          {wallets.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center px-4 text-center gap-4">
              <div className="p-2 rounded-full bg-background border border-border">
                <XIcon className="size-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No Solana wallets found</p>
            </div>
          )}
        </TableContainer>

        {totalPages > 1 && (
          <div className="flex flex-col items-center border-t p-6">
            <div className="mb-4 text-muted-foreground text-sm">
              Found {totalRecords} Solana wallets
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Link
                    href={`/team/${teamSlug}/${project.slug}/transactions?solana_page=${
                      currentPage > 1 ? currentPage - 1 : 1
                    }`}
                    legacyBehavior
                    passHref
                  >
                    <PaginationPrevious
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </Link>
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <PaginationItem key={`page-${pageNumber}`}>
                      <Link
                        href={`/team/${teamSlug}/${project.slug}/transactions?solana_page=${pageNumber}`}
                        passHref
                      >
                        <PaginationLink isActive={currentPage === pageNumber}>
                          {pageNumber}
                        </PaginationLink>
                      </Link>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <Link
                    href={`/team/${teamSlug}/${project.slug}/transactions?solana_page=${
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    }`}
                    passHref
                  >
                    <PaginationNext
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </Link>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

function SolanaWalletTableRow(props: {
  wallet: SolanaWallet;
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
}) {
  const { wallet, project, teamSlug, client } = props;

  // Get the project Solana wallet public key
  const engineCloudService = project.services.find(
    (service: { name: string }) => service.name === "engineCloud",
  );
  const defaultWalletPublicKey =
    engineCloudService?.projectSolanaWalletPublicKey;
  const isDefaultWallet =
    defaultWalletPublicKey &&
    wallet.publicKey.toLowerCase() === defaultWalletPublicKey.toLowerCase();

  return (
    <TableRow key={wallet.id}>
      {/* Label */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm text-foreground",
              !wallet.metadata.label && "text-muted-foreground",
            )}
          >
            {wallet.metadata.label || "N/A"}
          </span>
          {isDefaultWallet && (
            <Badge variant="success" className="text-xs">
              default
            </Badge>
          )}
        </div>
      </TableCell>

      {/* Public Key */}
      <TableCell>
        <WalletAddress address={wallet.publicKey} client={client} />
      </TableCell>

      {/* Balance */}
      <TableCell>
        <SolanaWalletBalanceCell publicKey={wallet.publicKey} client={client} />
      </TableCell>

      <TableCell>
        <WalletDateCell date={wallet.createdAt} />
      </TableCell>

      <TableCell>
        <WalletActionsDropdown
          project={project}
          teamSlug={teamSlug}
          wallet={wallet}
          client={client}
        />
      </TableCell>
    </TableRow>
  );
}

function WalletDateCell({ date }: { date: string }) {
  if (!date) {
    return "N/A";
  }

  const dateObj = new Date(date);
  return (
    <ToolTipLabel label={format(dateObj, "PP pp z")}>
      <p>{formatDistanceToNowStrict(dateObj, { addSuffix: true })}</p>
    </ToolTipLabel>
  );
}

function WalletActionsDropdown(props: {
  wallet: SolanaWallet;
  teamSlug: string;
  project: Project;
  client: ThirdwebClient;
}) {
  const setAsDefaultMutation = useMutation({
    mutationFn: async () => {
      await updateDefaultProjectSolanaWallet({
        project: props.project,
        publicKey: props.wallet.publicKey,
      });
    },
    onSuccess: () => {
      toast.success("Solana wallet set as default");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to set default Solana wallet",
      );
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVerticalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuItem asChild>
          <Link
            href={`/team/${props.teamSlug}/${props.project.slug}/transactions?testSolanaTxWithWallet=${props.wallet.id}`}
            className="flex items-center gap-2 h-9 rounded-lg"
          >
            <SendIcon className="size-4 text-muted-foreground" />
            Send test transaction
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setAsDefaultMutation.mutate()}
          disabled={setAsDefaultMutation.isPending}
          className="flex items-center gap-2 h-9 rounded-lg"
        >
          <CheckIcon className="size-4 text-muted-foreground" />
          Set as default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SolanaWalletBalanceCell(props: {
  publicKey: string;
  client: ThirdwebClient;
}) {
  const balance = useQuery({
    queryFn: async () => {
      // This is a placeholder - you would need to implement actual Solana balance fetching
      // For now, we'll return a placeholder
      return {
        displayValue: "0",
        symbol: "SOL",
      };
    },
    queryKey: ["solanaWalletBalance", props.publicKey],
  });

  if (balance.isFetching) {
    return <Skeleton className="h-5 w-16" />;
  }

  if (!balance.data) {
    return <span className="text-muted-foreground">N/A</span>;
  }

  return (
    <span className="text-sm text-foreground">
      {balance.data.displayValue} {balance.data.symbol}
    </span>
  );
}
