"use client";

import type { ThirdwebClient } from "thirdweb";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import { TransactionsTableUI } from "./tx-table-ui";
import type { TransactionStatus, TransactionsResponse } from "./types";

export function TransactionsTable(props: {
  project: Project;
  wallets?: Wallet[];
  teamSlug: string;
  client: ThirdwebClient;
}) {
  return (
    <TransactionsTableUI
      client={props.client}
      getData={async ({ page, status }) => {
        return await getTransactions({
          page,
          project: props.project,
          status,
        });
      }}
      project={props.project}
      teamSlug={props.teamSlug}
      wallets={props.wallets}
    />
  );
}

async function getTransactions({
  project,
  page,
  status,
}: {
  project: Project;
  page: number;
  status: TransactionStatus | undefined;
}) {
  const transactions = await engineCloudProxy<{ result: TransactionsResponse }>(
    {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": project.publishableKey,
        "x-team-id": project.teamId,
      },
      method: "GET",
      pathname: `/v1/transactions`,
      searchParams: {
        limit: "20",
        page: page.toString(),
        status: status ?? undefined,
      },
    },
  );

  if (!transactions.ok) {
    throw new Error(transactions.error);
  }

  return transactions.data.result;
}
