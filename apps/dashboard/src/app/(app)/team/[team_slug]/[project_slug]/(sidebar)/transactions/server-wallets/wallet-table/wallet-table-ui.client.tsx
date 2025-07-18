"use client";

import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
import { SendIcon } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_7,
  predictSmartAccountAddress,
} from "thirdweb/wallets/smart";
import type { Project } from "@/api/projects";
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
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { useDashboardRouter } from "@/lib/DashboardRouter";
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
  const [showContractWallets, setShowContractWallets] = useState(false);
  const showContractWalletsId = useId();
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-col lg:flex-row items-center gap-4 px-6 py-6">
        <div className="flex flex-1 flex-col gap-4 rounded-lg rounded-b-none items-start">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Server Wallets
            </h2>
            <p className="text-muted-foreground text-sm">
              Create and manage server wallets for you project
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <CreateServerWallet
            managementAccessToken={managementAccessToken}
            project={project}
            teamSlug={teamSlug}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 py-4">
        <label
          className="cursor-pointer text-sm text-muted-foreground"
          htmlFor={showContractWalletsId}
        >
          Show ERC4337 Smart Account Addresses
        </label>
        <Switch
          checked={showContractWallets}
          id={showContractWalletsId}
          onCheckedChange={() => setShowContractWallets(!showContractWallets)}
        />
      </div>

      <TableContainer className="rounded-none border-x-0 border-b-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {showContractWallets ? "Smart Account Address" : "EOA Address"}
              </TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <TableHead className="text-right">Updated At</TableHead>
              <TableHead className="text-right">Send test tx</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.map((wallet) => (
              <TableRow className="hover:bg-accent/50" key={wallet.id}>
                <TableCell>
                  {showContractWallets ? (
                    <SmartAccountCell client={client} wallet={wallet} />
                  ) : (
                    <WalletAddress address={wallet.address} client={client} />
                  )}
                </TableCell>
                <TableCell>{wallet.metadata.label || "none"}</TableCell>
                <TableCell className="text-right">
                  <WalletDateCell date={wallet.createdAt} />
                </TableCell>
                <TableCell className="text-right">
                  <WalletDateCell date={wallet.updatedAt} />
                </TableCell>
                <TableCell className="flex justify-end">
                  <SendTestTransaction
                    project={project}
                    teamSlug={teamSlug}
                    wallet={wallet}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {wallets.length === 0 && (
          <div className="py-20 flex items-center justify-center px-4 text-center">
            No server wallets found
          </div>
        )}
      </TableContainer>

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
  );
}

function SmartAccountCell({
  wallet,
  client,
}: {
  wallet: Wallet;
  client: ThirdwebClient;
}) {
  const chainId = 1; // TODO: add chain switcher for balance + smart account address
  const chain = useV5DashboardChain(chainId);

  const smartAccountAddressQuery = useQuery({
    queryFn: async () => {
      const smartAccountAddress = await predictSmartAccountAddress({
        adminAddress: wallet.address,
        chain,
        client: client,
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
      });
      return smartAccountAddress;
    },
    queryKey: ["smart-account-address", wallet.address],
  });

  return (
    <div>
      {smartAccountAddressQuery.data ? (
        <div className="flex items-center gap-2">
          <WalletAddress
            address={smartAccountAddressQuery.data}
            client={client}
          />
          <Badge variant={"default"}>Smart Account</Badge>
        </div>
      ) : (
        <Skeleton className="h-4 w-20" />
      )}
    </div>
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

function SendTestTransaction(props: {
  wallet: Wallet;
  teamSlug: string;
  project: Project;
}) {
  const router = useDashboardRouter();
  return (
    <Button
      onClick={() => {
        router.push(
          `/team/${props.teamSlug}/${props.project.slug}/transactions?testTxWithWallet=${props.wallet.id}`,
        );
      }}
      size="sm"
      variant="secondary"
    >
      <SendIcon className="size-4" />
    </Button>
  );
}
