"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
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
import { formatDistanceToNowStrict } from "date-fns";
import { format } from "date-fns/format";
import CreateServerWallet from "../components/create-server-wallet.client";
import type { Wallet } from "./types";
import type { Project } from "@/api/projects";
export function ServerWalletsTableUI({
  wallets,
  project,
  managementAccessToken,
}: {
  wallets: Wallet[];
  project: Project;
  managementAccessToken: string | undefined;
}) {
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
        <CreateServerWallet
          project={project}
          managementAccessToken={managementAccessToken}
        />
      </div>

      <TableContainer className="rounded-none border-x-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
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
                    <WalletAddress address={wallet.address} />
                  </TableCell>
                  <TableCell>
                    <WalletDateCell date={wallet.createdAt} />
                  </TableCell>
                  <TableCell>
                    <WalletDateCell date={wallet.updatedAt} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
