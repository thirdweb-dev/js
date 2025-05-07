"use client";

import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import { TransactionsTableUI } from "./tx-table-ui";
import type { TransactionsResponse } from "./types";

export function TransactionsTable(props: {
  project: Project;
  wallets?: Wallet[];
  teamSlug: string;
}) {
  return (
    <TransactionsTableUI
      getData={async ({ page }) => {
        return await getTransactions({
          project: props.project,
          page,
        });
      }}
      project={props.project}
      wallets={props.wallets}
      teamSlug={props.teamSlug}
    />
  );
}

async function getTransactions({
  project,
  page,
}: {
  project: Project;
  page: number;
}) {
  const transactions = await engineCloudProxy<{ result: TransactionsResponse }>(
    {
      pathname: "/v1/transactions/search",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-id": project.teamId,
        "x-client-id": project.publishableKey,
      },
      body: JSON.stringify({
        page,
        limit: 20,
      }),
    },
  );

  if (!transactions.ok) {
    throw new Error(transactions.error);
  }

  return transactions.data.result;
}
