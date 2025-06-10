"use client";

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
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useV5DashboardChain } from "lib/v5-adapter";
import { SendIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_7,
  predictSmartAccountAddress,
} from "thirdweb/wallets/smart";
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
  const [showSigners, setShowSigners] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex flex-row items-center gap-4 px-6 py-6">
        <div className="flex flex-1 flex-col gap-4 rounded-lg rounded-b-none lg:flex-row lg:justify-between">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Server Wallets
            </h2>
            <p className="text-muted-foreground text-sm">
              Create and manage server wallets for you project
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <label htmlFor="show-signers" className="cursor-pointer text-sm">
            Show Signer Addresses
          </label>
          <Switch
            id="show-signers"
            checked={showSigners}
            onCheckedChange={() => setShowSigners(!showSigners)}
          />
        </div>
        <CreateServerWallet
          project={project}
          teamSlug={teamSlug}
          managementAccessToken={managementAccessToken}
        />
      </div>

      <TableContainer className="rounded-none border-x-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <TableHead className="text-right">Updated At</TableHead>
              <TableHead className="text-right">Send test tx</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No server wallets found
                </TableCell>
              </TableRow>
            ) : (
              wallets.map((wallet) => (
                <TableRow key={wallet.id} className="hover:bg-accent/50">
                  <TableCell>
                    {showSigners ? (
                      <WalletAddress address={wallet.address} client={client} />
                    ) : (
                      <SmartAccountCell wallet={wallet} client={client} />
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
                      wallet={wallet}
                      project={project}
                      teamSlug={teamSlug}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex flex-col items-center p-6">
        <div className="mb-4 text-muted-foreground text-sm">
          Found {totalRecords} server wallets
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Link
                href={`/team/${teamSlug}/${project.slug}/engine/cloud/server-wallets?page=${
                  currentPage > 1 ? currentPage - 1 : 1
                }`}
                passHref
                legacyBehavior
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
                    href={`/team/${teamSlug}/${project.slug}/engine/cloud/server-wallets?page=${pageNumber}`}
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
                href={`/team/${teamSlug}/${project.slug}/engine/cloud/server-wallets?page=${
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
    </div>
  );
}

export function SmartAccountCell({
  wallet,
  client,
}: {
  wallet: Wallet;
  client: ThirdwebClient;
}) {
  const chainId = 1; // TODO: add chain switcher for balance + smart account address
  const chain = useV5DashboardChain(chainId);

  const smartAccountAddressQuery = useQuery({
    queryKey: ["smart-account-address", wallet.address],
    queryFn: async () => {
      const smartAccountAddress = await predictSmartAccountAddress({
        client: client,
        adminAddress: wallet.address,
        chain,
        factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7,
      });
      return smartAccountAddress;
    },
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
      variant="secondary"
      size="sm"
      onClick={() => {
        router.push(
          `/team/${props.teamSlug}/${props.project.slug}/engine/cloud?testTxWithWallet=${props.wallet.id}`,
        );
      }}
    >
      <SendIcon className="size-4" />
    </Button>
  );
}
