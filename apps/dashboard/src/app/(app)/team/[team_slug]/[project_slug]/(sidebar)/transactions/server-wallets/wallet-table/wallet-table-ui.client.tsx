"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  MoreVerticalIcon,
  RefreshCcwIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { defineChain, type ThirdwebClient } from "thirdweb";
import { useWalletBalance } from "thirdweb/react";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_7,
  predictSmartAccountAddress,
} from "thirdweb/wallets/smart";
import type { Project } from "@/api/projects";
import { FundWalletModal } from "@/components/blocks/fund-wallets-modal";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { WalletAddress } from "@/components/blocks/wallet-address";
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
import { ToolTipLabel } from "@/components/ui/tooltip";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { cn } from "@/lib/utils";
import CreateServerWallet from "../components/create-server-wallet.client";
import type { Wallet } from "./types";

export function ServerWalletsTableUI({
  wallets,
  project,
  teamSlug,
  managementAccessToken,
  totalRecords,
  currentPage,
  totalPages,
  client,
}: {
  wallets: Wallet[];
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  client: ThirdwebClient;
}) {
  const [selectedChainId, setSelectedChainId] = useState<number>(1);
  const [showSmartAccount, setShowSmartAccount] = useState(false);
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
              Server Wallets
            </h2>
            <p className="text-muted-foreground text-sm">
              Create and manage server wallets for your project
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-5 border-t lg:border-t-0 pt-5 lg:pt-0 border-dashed">
            <SingleNetworkSelector
              chainId={selectedChainId}
              onChange={setSelectedChainId}
              client={client}
              disableChainId
              className="w-fit min-w-[180px] rounded-full bg-background hover:bg-accent/50"
              placeholder="Select network"
              popoverContentClassName="!w-[320px] rounded-xl overflow-hidden"
            />

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
          </div>
        </div>

        <TableContainer className="rounded-none border-x-0 border-b-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead className="w-[280px]">
                  {showSmartAccount
                    ? "Smart Account Address"
                    : "Wallet Address"}
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
                              queryKey: ["walletBalance", selectedChainId],
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
                <TableHead>Created </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets.map((wallet) => (
                <ServerWalletTableRow
                  key={wallet.id}
                  wallet={wallet}
                  project={project}
                  teamSlug={teamSlug}
                  client={client}
                  chainId={selectedChainId}
                  showSmartAccount={showSmartAccount}
                />
              ))}
            </TableBody>
          </Table>

          {wallets.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center px-4 text-center gap-4">
              <div className="p-2 rounded-full bg-background border border-border">
                <XIcon className="size-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No server wallets found</p>
              <CreateServerWallet
                managementAccessToken={managementAccessToken}
                project={project}
                teamSlug={teamSlug}
              />
            </div>
          )}
        </TableContainer>

        {wallets.length > 0 && (
          <div className="flex justify-end items-center p-4 py-5 lg:px-6 border-t">
            <CreateServerWallet
              managementAccessToken={managementAccessToken}
              project={project}
              teamSlug={teamSlug}
            />
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col items-center border-t p-6">
            <div className="mb-4 text-muted-foreground text-sm">
              Found {totalRecords} server wallets
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Link
                    href={`/team/${teamSlug}/${project.slug}/transactions/server-wallets?page=${
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
                        href={`/team/${teamSlug}/${project.slug}/transactions/server-wallets?page=${pageNumber}`}
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
                    href={`/team/${teamSlug}/${project.slug}/transactions/server-wallets?page=${
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

function ServerWalletTableRow(props: {
  wallet: Wallet;
  project: Project;
  teamSlug: string;
  client: ThirdwebClient;
  chainId: number;
  showSmartAccount: boolean;
}) {
  const { wallet, project, teamSlug, client, chainId, showSmartAccount } =
    props;

  const chain = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    return defineChain(chainId);
  }, [chainId]);

  const smartAccountAddressQuery = useQuery({
    queryFn: async () => {
      const smartAccountAddress = await predictSmartAccountAddress({
        adminAddress: wallet.address,

        chain: chain,
        client: client,
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
      });
      return smartAccountAddress;
    },
    enabled: showSmartAccount,
    queryKey: ["smart-account-address", wallet.address, chainId],
  });

  return (
    <TableRow key={wallet.id}>
      {/* Label */}
      <TableCell>
        <span
          className={cn(
            "text-sm text-foreground",
            !wallet.metadata.label && "text-muted-foreground",
          )}
        >
          {wallet.metadata.label || "N/A"}
        </span>
      </TableCell>

      {/* Address */}
      <TableCell>
        {showSmartAccount ? (
          <div>
            {smartAccountAddressQuery.data ? (
              <WalletAddress
                address={smartAccountAddressQuery.data}
                client={client}
              />
            ) : smartAccountAddressQuery.isPending ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
        ) : (
          <WalletAddress address={wallet.address} client={client} />
        )}
      </TableCell>

      {/* Balance */}
      <TableCell>
        {showSmartAccount && (
          // biome-ignore lint/complexity/noUselessFragments: keep for readability
          <>
            {smartAccountAddressQuery.isPending ? (
              <Skeleton className="h-5 w-16" />
            ) : smartAccountAddressQuery.data ? (
              <WalletBalanceCell
                address={smartAccountAddressQuery.data}
                chainId={chainId}
                client={client}
              />
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </>
        )}

        {!showSmartAccount && (
          <WalletBalanceCell
            address={wallet.address}
            chainId={chainId}
            client={client}
          />
        )}
      </TableCell>

      <TableCell>
        <WalletDateCell date={wallet.createdAt} />
      </TableCell>

      <TableCell>
        <WalletActionsDropdown
          project={project}
          teamSlug={teamSlug}
          fundWalletAddress={
            showSmartAccount ? smartAccountAddressQuery.data : wallet.address
          }
          wallet={wallet}
          client={client}
          chainId={chainId}
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
  fundWalletAddress: string | undefined;
  wallet: Wallet;
  teamSlug: string;
  project: Project;
  client: ThirdwebClient;
  chainId: number;
}) {
  const [showFundModal, setShowFundModal] = useState(false);

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
              href={`/team/${props.teamSlug}/${props.project.slug}/transactions?testTxWithWallet=${props.wallet.id}`}
              className="flex items-center gap-2 h-9 rounded-lg"
            >
              <SendIcon className="size-4 text-muted-foreground" />
              Send test transaction
            </Link>
          </DropdownMenuItem>
          {props.fundWalletAddress && (
            <DropdownMenuItem
              onClick={() => setShowFundModal(true)}
              className="flex items-center gap-2 h-9 rounded-lg"
            >
              <WalletProductIcon className="size-4 text-muted-foreground" />
              Fund wallet
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {props.fundWalletAddress && (
        <FundWalletModal
          open={showFundModal}
          onOpenChange={setShowFundModal}
          title="Fund server wallet"
          description="Send funds to the server wallet"
          recipientAddress={props.fundWalletAddress}
          client={props.client}
          defaultChainId={props.chainId}
          checkoutWidgetTitle={
            props.wallet.metadata.label
              ? `Fund ${props.wallet.metadata.label}`
              : "Fund server wallet"
          }
        />
      )}
    </>
  );
}

function WalletBalanceCell(props: {
  address: string;
  chainId: number;
  client: ThirdwebClient;
}) {
  const balance = useWalletBalance({
    address: props.address,
    // eslint-disable-next-line no-restricted-syntax
    chain: defineChain(props.chainId),
    client: props.client,
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
