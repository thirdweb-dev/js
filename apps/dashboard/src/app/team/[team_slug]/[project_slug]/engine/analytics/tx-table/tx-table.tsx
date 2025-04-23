"use client";

import { engineCloudProxy } from "@/actions/proxies";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import { TransactionsTableUI } from "./tx-table-ui";
import type { TransactionsResponse } from "./types";

export function TransactionsTable(props: {
  teamId: string;
  clientId: string;
  wallets?: Wallet[];
}) {
  return (
    <TransactionsTableUI
      getData={async ({ page }) => {
        return await getTransactions({
          teamId: props.teamId,
          clientId: props.clientId,
          page,
        });
      }}
      clientId={props.clientId}
      wallets={props.wallets}
    />
  );
}

async function getTransactions({
  teamId,
  clientId,
}: {
  teamId: string;
  clientId: string;
  page: number;
}) {
  const transactions = await engineCloudProxy<{ result: TransactionsResponse }>(
    {
      pathname: "/project/transactions/search",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-id": teamId,
        "x-client-id": clientId,
      },
      body: JSON.stringify({}),
    },
  );

  if (!transactions.ok) {
    throw new Error(transactions.error);
  }

  return transactions.data.result;
}
