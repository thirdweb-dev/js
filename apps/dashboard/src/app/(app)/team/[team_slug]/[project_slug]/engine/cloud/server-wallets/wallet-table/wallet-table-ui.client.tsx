"use client";

import type { Project } from "@/api/projects";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
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
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { format } from "date-fns/format";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_7,
  predictSmartAccountAddress,
} from "thirdweb/wallets/smart";
import { Button } from "../../../../../../../../../@/components/ui/button";
import { useDashboardRouter } from "../../../../../../../../../@/lib/DashboardRouter";
import { useV5DashboardChain } from "../../../../../../../../../lib/v5-adapter";
import CreateServerWallet from "../components/create-server-wallet.client";
import type { Wallet } from "./types";

export function ServerWalletsTableUI({
  wallets,
  project,
  teamSlug,
  managementAccessToken,
}: {
  wallets: Wallet[];
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
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
                      <WalletAddress address={wallet.address} />
                    ) : (
                      <SmartAccountCell wallet={wallet} />
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
    </div>
  );
}

export function SmartAccountCell({ wallet }: { wallet: Wallet }) {
  const chainId = 1; // TODO: add chain switcher for balance + smart account address
  const chain = useV5DashboardChain(chainId);

  const smartAccountAddressQuery = useQuery({
    queryKey: ["smart-account-address", wallet.address],
    queryFn: async () => {
      const smartAccountAddress = await predictSmartAccountAddress({
        client: getThirdwebClient(undefined),
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
          <WalletAddress address={smartAccountAddressQuery.data} />
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
