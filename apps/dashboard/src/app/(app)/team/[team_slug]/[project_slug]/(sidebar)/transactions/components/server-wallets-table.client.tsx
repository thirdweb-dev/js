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
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { useWalletBalance } from "thirdweb/react";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_7,
  predictSmartAccountAddress,
} from "thirdweb/wallets/smart";
import type { Project } from "@/api/project/projects";
import { FundWalletModal } from "@/components/blocks/fund-wallets-modal";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { SolanaAddress } from "@/components/blocks/solana-address";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { updateDefaultProjectWallet } from "../lib/vault.client";
import CreateServerWallet from "../server-wallets/components/create-server-wallet.client";
import type { Wallet as EVMWallet } from "../server-wallets/wallet-table/types";
import { CreateSolanaWallet } from "../solana-wallets/components/create-solana-wallet.client";
import type { SolanaWallet } from "../solana-wallets/wallet-table/types";

type WalletChain = "evm" | "solana";

interface ServerWalletsTableProps {
  evmWallets: EVMWallet[];
  evmTotalRecords: number;
  evmCurrentPage: number;
  evmTotalPages: number;
  solanaWallets: SolanaWallet[];
  solanaTotalRecords: number;
  solanaCurrentPage: number;
  solanaTotalPages: number;
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
  client: ThirdwebClient;
  solanaPermissionError?: boolean;
}

export function ServerWalletsTable(props: ServerWalletsTableProps) {
  const {
    evmWallets,
    solanaWallets,
    project,
    teamSlug,
    managementAccessToken,
    evmTotalRecords,
    evmCurrentPage,
    evmTotalPages,
    solanaTotalRecords,
    solanaCurrentPage,
    solanaTotalPages,
    client,
    solanaPermissionError,
  } = props;

  const [activeChain, setActiveChain] = useState<WalletChain>("evm");
  const [selectedChainId, setSelectedChainId] = useState<number>(1);
  const [showSmartAccount, setShowSmartAccount] = useState(false);
  const queryClient = useQueryClient();

  const wallets = activeChain === "evm" ? evmWallets : solanaWallets;
  const currentPage =
    activeChain === "evm" ? evmCurrentPage : solanaCurrentPage;
  const totalPages = activeChain === "evm" ? evmTotalPages : solanaTotalPages;
  const totalRecords =
    activeChain === "evm" ? evmTotalRecords : solanaTotalRecords;

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between p-4 lg:px-6 py-5 lg:items-center gap-5">
          <div>
            <div className="flex mb-3">
              <div className="p-2 rounded-full bg-background border border-border">
                <WalletProductIcon className="size-5 text-muted-foreground" />
              </div>
            </div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Server Wallets
            </h2>
            <p className="text-muted-foreground text-sm">
              Create and manage server wallets for your project
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-5 border-t lg:border-t-0 pt-5 lg:pt-0 border-dashed">
            <div className="flex flex-row gap-2.5">
              {activeChain === "evm" && (
                <>
                  <CreateServerWallet
                    managementAccessToken={managementAccessToken}
                    project={project}
                    teamSlug={teamSlug}
                  />
                  <SingleNetworkSelector
                    chainId={selectedChainId}
                    onChange={setSelectedChainId}
                    client={client}
                    disableChainId
                    className="w-fit min-w-[180px] rounded-full bg-background hover:bg-accent/50"
                    placeholder="Select network"
                    popoverContentClassName="!w-[320px] rounded-xl overflow-hidden"
                  />
                </>
              )}
              {activeChain === "solana" && (
                <CreateSolanaWallet
                  managementAccessToken={managementAccessToken}
                  project={project}
                  teamSlug={teamSlug}
                />
              )}
            </div>

            {activeChain === "evm" && (
              <div className="flex items-center gap-2.5">
                <Label
                  className="text-sm text-muted-foreground"
                  htmlFor="showSmartAccount"
                >
                  Show ERC4337 Smart Account
                </Label>
                <Switch
                  id="showSmartAccount"
                  checked={showSmartAccount}
                  onCheckedChange={setShowSmartAccount}
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chain Tabs */}
        <div className="px-6">
          <TabButtons
            tabs={[
              {
                name: (
                  <span className="flex items-center gap-2">
                    EVM Wallets
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {evmTotalRecords}
                    </Badge>
                  </span>
                ),
                onClick: () => setActiveChain("evm"),
                isActive: activeChain === "evm",
              },
              {
                name: (
                  <span className="flex items-center gap-2">
                    Solana Wallets
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {solanaTotalRecords}
                    </Badge>
                  </span>
                ),
                onClick: () => setActiveChain("solana"),
                isActive: activeChain === "solana",
              },
            ]}
          />
        </div>

        {/* Table Content */}
        {activeChain === "solana" && solanaPermissionError ? (
          <SolanaPermissionMessage teamSlug={teamSlug} />
        ) : (
          <>
            <TableContainer className="rounded-none border-x-0 border-b-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead className="w-[280px]">
                      {activeChain === "evm"
                        ? showSmartAccount
                          ? "Smart Account Address"
                          : "Wallet Address"
                        : "Public Key"}
                    </TableHead>
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
                                  queryKey:
                                    activeChain === "evm"
                                      ? ["walletBalance", selectedChainId]
                                      : ["solanaWalletBalance"],
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
                  {activeChain === "evm" &&
                    evmWallets.map((wallet) => (
                      <EVMWalletRow
                        key={wallet.id}
                        wallet={wallet}
                        project={project}
                        teamSlug={teamSlug}
                        client={client}
                        chainId={selectedChainId}
                        showSmartAccount={showSmartAccount}
                      />
                    ))}
                  {activeChain === "solana" &&
                    solanaWallets.map((wallet) => (
                      <SolanaWalletRow
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
                  <p className="text-muted-foreground">
                    No {activeChain === "evm" ? "EVM" : "Solana"} wallets found
                  </p>
                </div>
              )}
            </TableContainer>

            {totalPages > 1 && (
              <WalletsPagination
                activeChain={activeChain}
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                teamSlug={teamSlug}
                projectSlug={project.slug}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Solana Permission Error Message
function SolanaPermissionMessage({ teamSlug }: { teamSlug: string }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center gap-4 border-t">
      <div className="p-3 rounded-full bg-warning/10 border border-warning/50">
        <XIcon className="size-6 text-warning" />
      </div>
      <div className="max-w-md">
        <h3 className="font-semibold text-lg mb-2">
          Solana Access Not Available
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          This project doesn't have access to Solana functionality. To use
          Solana server wallets, please create a new project with Solana support
          enabled.
        </p>
        <Link href={`/team/${teamSlug}`}>
          <Button variant="default" className="rounded-full">
            Create New Project
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Wallets Pagination Component
function WalletsPagination({
  activeChain,
  currentPage,
  totalPages,
  totalRecords,
  teamSlug,
  projectSlug,
}: {
  activeChain: WalletChain;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  teamSlug: string;
  projectSlug: string;
}) {
  const pageParam = activeChain === "evm" ? "page" : "solana_page";

  return (
    <div className="flex flex-col items-center border-t p-6">
      <div className="mb-4 text-muted-foreground text-sm">
        Found {totalRecords} {activeChain === "evm" ? "EVM" : "Solana"} wallets
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Link
              href={`/team/${teamSlug}/${projectSlug}/transactions?${pageParam}=${
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
                  href={`/team/${teamSlug}/${projectSlug}/transactions?${pageParam}=${pageNumber}`}
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
              href={`/team/${teamSlug}/${projectSlug}/transactions?${pageParam}=${
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
  );
}

// EVM Wallet Row Component
function EVMWalletRow({
  wallet,
  project,
  teamSlug,
  client,
  chainId,
  showSmartAccount,
}: {
  wallet: EVMWallet;
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
  chainId: number;
  showSmartAccount: boolean;
}) {
  const chain = useV5DashboardChain(chainId);

  const smartAccountQuery = useQuery({
    queryFn: async () => {
      return await predictSmartAccountAddress({
        adminAddress: wallet.address,
        chain: chain,
        client: client,
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
      });
    },
    enabled: showSmartAccount,
    queryKey: ["smart-account-address", wallet.address, chainId],
  });

  const engineService = project.services.find((s) => s.name === "engineCloud");
  const isDefault =
    engineService?.projectWalletAddress &&
    wallet.address.toLowerCase() ===
      engineService.projectWalletAddress.toLowerCase();

  return (
    <TableRow>
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
          {isDefault && (
            <Badge variant="success" className="text-xs">
              default
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell>
        {showSmartAccount ? (
          smartAccountQuery.isPending ? (
            <Skeleton className="h-7 w-24" />
          ) : smartAccountQuery.data ? (
            <WalletAddress address={smartAccountQuery.data} client={client} />
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )
        ) : (
          <WalletAddress address={wallet.address} client={client} />
        )}
      </TableCell>

      <TableCell>
        {showSmartAccount ? (
          smartAccountQuery.isPending ? (
            <Skeleton className="h-5 w-16" />
          ) : smartAccountQuery.data ? (
            <WalletBalance
              address={smartAccountQuery.data}
              chainId={chainId}
              client={client}
            />
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )
        ) : (
          <WalletBalance
            address={wallet.address}
            chainId={chainId}
            client={client}
          />
        )}
      </TableCell>

      <TableCell>
        <DateCell date={wallet.createdAt} />
      </TableCell>

      <TableCell>
        <EVMWalletActions
          project={project}
          teamSlug={teamSlug}
          wallet={wallet}
          client={client}
          chainId={chainId}
          fundAddress={
            showSmartAccount ? smartAccountQuery.data : wallet.address
          }
        />
      </TableCell>
    </TableRow>
  );
}

// Solana Wallet Row Component
function SolanaWalletRow({
  wallet,
  project,
  teamSlug,
  client,
}: {
  wallet: SolanaWallet;
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
}) {
  const engineService = project.services.find(
    (s) => s.name === "engineCloud",
  ) as { projectSolanaWalletPublicKey?: string } | undefined;

  const isDefault =
    engineService?.projectSolanaWalletPublicKey &&
    wallet.publicKey.toLowerCase() ===
      engineService.projectSolanaWalletPublicKey.toLowerCase();

  return (
    <TableRow>
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
          {isDefault && (
            <Badge variant="success" className="text-xs">
              default
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell>
        <SolanaAddress address={wallet.publicKey} shortenAddress={true} />
      </TableCell>

      <TableCell>
        <SolanaWalletBalance publicKey={wallet.publicKey} />
      </TableCell>

      <TableCell>
        <DateCell date={wallet.createdAt} />
      </TableCell>

      <TableCell>
        <SolanaWalletActions
          project={project}
          teamSlug={teamSlug}
          wallet={wallet}
          client={client}
        />
      </TableCell>
    </TableRow>
  );
}

// Shared Components
function DateCell({ date }: { date: string }) {
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

function EVMWalletActions({
  wallet,
  project,
  teamSlug,
  client,
  chainId,
  fundAddress,
}: {
  wallet: EVMWallet;
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
  chainId: number;
  fundAddress: string | undefined;
}) {
  const [showFundModal, setShowFundModal] = useState(false);
  const router = useDashboardRouter();

  const setDefaultMutation = useMutation({
    mutationFn: async () => {
      await updateDefaultProjectWallet({
        project,
        projectWalletAddress: wallet.address,
      });
    },
    onSuccess: () => {
      toast.success("Wallet set as project wallet");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to set default wallet",
      );
    },
  });

  return (
    <>
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
              href={`/team/${teamSlug}/${project.slug}/transactions?testTxWithWallet=${wallet.id}`}
              className="flex items-center gap-2 h-9 rounded-lg"
            >
              <SendIcon className="size-4 text-muted-foreground" />
              Send test transaction
            </Link>
          </DropdownMenuItem>
          {fundAddress && (
            <DropdownMenuItem
              onClick={() => setShowFundModal(true)}
              className="flex items-center gap-2 h-9 rounded-lg"
            >
              <WalletProductIcon className="size-4 text-muted-foreground" />
              Fund wallet
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setDefaultMutation.mutate()}
            disabled={setDefaultMutation.isPending}
            className="flex items-center gap-2 h-9 rounded-lg"
          >
            <CheckIcon className="size-4 text-muted-foreground" />
            Set as default
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {fundAddress && (
        <FundWalletModal
          open={showFundModal}
          onOpenChange={setShowFundModal}
          title="Fund server wallet"
          description="Send funds to the server wallet"
          recipientAddress={fundAddress}
          client={client}
          defaultChainId={chainId}
          checkoutWidgetTitle={
            wallet.metadata.label
              ? `Fund ${wallet.metadata.label}`
              : "Fund server wallet"
          }
        />
      )}
    </>
  );
}

function SolanaWalletActions({
  wallet,
  project,
  teamSlug,
}: {
  wallet: SolanaWallet;
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
}) {
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
            href={`/team/${teamSlug}/${project.slug}/transactions?testSolanaTxWithWallet=${wallet.id}`}
            className="flex items-center gap-2 h-9 rounded-lg"
          >
            <SendIcon className="size-4 text-muted-foreground" />
            Send test transaction
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WalletBalance({
  address,
  chainId,
  client,
}: {
  address: string;
  chainId: number;
  client: ThirdwebClient;
}) {
  const chain = useV5DashboardChain(chainId);
  const balance = useWalletBalance({
    address,
    chain,
    client,
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

function SolanaWalletBalance({ publicKey }: { publicKey: string }) {
  const balance = useQuery({
    queryFn: async () => {
      // TODO: Implement actual Solana balance fetching
      return {
        displayValue: "0",
        symbol: "SOL",
      };
    },
    queryKey: ["solanaWalletBalance", publicKey],
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
