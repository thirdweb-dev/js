"use client";

import type { ThirdwebClient } from "thirdweb";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/project/projects";
import type { SolanaWallet } from "../../solana-wallets/wallet-table/types";
import { SolanaTransactionsTableUI } from "./solana-tx-table-ui";
import type {
  SolanaTransactionStatus,
  SolanaTransactionsResponse,
} from "./types";

export function SolanaTransactionsTable(props: {
  project: Project;
  wallets?: SolanaWallet[];
  teamSlug: string;
  client: ThirdwebClient;
}) {
  return (
    <SolanaTransactionsTableUI
      client={props.client}
      getData={async ({ page, status, id, from }) => {
        return await getSolanaTransactions({
          page,
          project: props.project,
          status,
          id,
          from,
        });
      }}
      project={props.project}
      teamSlug={props.teamSlug}
      wallets={props.wallets}
    />
  );
}

async function getSolanaTransactions({
  project,
  page,
  status,
  id,
  from,
}: {
  project: Project;
  page: number;
  status: SolanaTransactionStatus | undefined;
  id: string | undefined;
  from: string | undefined;
}) {
  const transactions = await engineCloudProxy<{
    result: SolanaTransactionsResponse;
  }>({
    headers: {
      "Content-Type": "application/json",
      "x-client-id": project.publishableKey,
      "x-team-id": project.teamId,
    },
    method: "GET",
    pathname: `/v1/solana/transactions`,
    searchParams: {
      limit: "20",
      page: page.toString(),
      status: status ?? undefined,
      id: id ?? undefined,
      from: from ?? undefined,
    },
  });

  if (!transactions.ok) {
    throw new Error(transactions.error);
  }

  return transactions.data.result;
}
