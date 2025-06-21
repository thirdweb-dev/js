"use client";

import type { ThirdwebClient } from "thirdweb";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/projects";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import { TransactionsTableUI } from "./tx-table-ui";
import type { TransactionsResponse } from "./types";

export function TransactionsTable(props: {
  project: Project;
  wallets?: Wallet[];
  teamSlug: string;
  client: ThirdwebClient;
}) {
  return (
    <TransactionsTableUI
      client={props.client}
      getData={async ({ page }) => {
        return await getTransactions({
          page,
          project: props.project,
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
}: {
  project: Project;
  page: number;
}) {
  const transactions = await engineCloudProxy<{ result: TransactionsResponse }>(
    {
      body: JSON.stringify({
        limit: 20,
        page,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-client-id": project.publishableKey,
        "x-team-id": project.teamId,
      },
      method: "POST",
      pathname: "/v1/transactions/search",
    },
  );

  if (!transactions.ok) {
    throw new Error(transactions.error);
  }

  return transactions.data.result;
}
