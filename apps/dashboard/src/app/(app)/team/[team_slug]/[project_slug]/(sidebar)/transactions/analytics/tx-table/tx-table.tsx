"use client";

import type { ThirdwebClient } from "thirdweb";
import { engineCloudProxy } from "@/actions/proxies";
import type { Project } from "@/api/project/projects";
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
      getData={async ({ page, status, id, from }) => {
        return await getTransactions({
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

async function getTransactions({
  project,
  page,
  status,
  id,
  from,
}: {
  project: Project;
  page: number;
  status: TransactionStatus | undefined;
  id: string | undefined;
  from: string | undefined;
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
        id: id ?? undefined,
        from: from ?? undefined,
      },
    },
  );

  if (!transactions.ok) {
    throw new Error(transactions.error);
  }

  return transactions.data.result;
}
