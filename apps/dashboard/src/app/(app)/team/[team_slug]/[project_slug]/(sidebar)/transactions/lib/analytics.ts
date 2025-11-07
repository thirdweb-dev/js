import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";
import type {
  Transaction,
  TransactionsResponse,
} from "../analytics/tx-table/types";

export async function getSingleTransaction({
  teamId,
  clientId,
  transactionId,
}: {
  teamId: string;
  clientId: string;
  transactionId: string;
}): Promise<Transaction | undefined> {
  const authToken = await getAuthToken();

  const filters = {
    filters: [
      {
        field: "id",
        operation: "OR",
        values: [transactionId],
      },
    ],
  };

  const response = await fetch(
    `${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/transactions/search`,
    {
      body: JSON.stringify(filters),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-team-id": teamId,
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return undefined;
    }

    // TODO - need to handle this error state, like we do with the connect charts
    throw new Error(
      `Error fetching single transaction data: ${response.status} ${
        response.statusText
      } - ${await response.text().catch(() => "Unknown error")}`,
    );
  }

  const data = (await response.json()).result as TransactionsResponse;

  return data.transactions[0];
}

export async function getSingleSolanaTransaction({
  teamId,
  clientId,
  transactionId,
}: {
  teamId: string;
  clientId: string;
  transactionId: string;
}): Promise<
  import("../analytics/solana-tx-table/types").SolanaTransaction | undefined
> {
  const authToken = await getAuthToken();

  const filters = {
    filters: [
      {
        field: "id",
        operation: "OR",
        values: [transactionId],
      },
    ],
  };

  const response = await fetch(
    `${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/solana/transactions/search`,
    {
      body: JSON.stringify(filters),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-team-id": teamId,
        "x-chain-id": "solana:devnet", // TODO: Support multiple Solana networks
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return undefined;
    }

    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Error fetching single Solana transaction data: ${response.status} ${
        response.statusText
      } - ${errorText}`,
    );
  }

  const rawData = await response.json();
  const data =
    rawData.result as import("../analytics/solana-tx-table/types").SolanaTransactionsResponse;

  return data.transactions[0];
}

// Activity log types
export type ActivityLogEntry = {
  id: string;
  transactionId: string;
  batchIndex: number;
  eventType: string;
  stageName: string;
  executorName: string;
  notificationId: string;
  payload: Record<string, unknown> | string | number | boolean | null;
  timestamp: string;
  createdAt: string;
};

type ActivityLogsResponse = {
  result: {
    activityLogs: ActivityLogEntry[];
    transaction: {
      id: string;
      batchIndex: number;
      clientId: string;
    };
    pagination: {
      totalCount: number;
      page: number;
      limit: number;
    };
  };
};

export async function getTransactionActivityLogs({
  teamId,
  clientId,
  transactionId,
}: {
  teamId: string;
  clientId: string;
  transactionId: string;
}): Promise<ActivityLogEntry[]> {
  const authToken = await getAuthToken();

  const response = await fetch(
    `${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/transactions/activity-logs?transactionId=${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-team-id": teamId,
      },
      method: "GET",
    },
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      return [];
    }
    return [];
  }

  const data = (await response.json()) as ActivityLogsResponse;
  return data.result.activityLogs;
}

export async function getSolanaTransactionActivityLogs({
  teamId,
  clientId,
  transactionId,
}: {
  teamId: string;
  clientId: string;
  transactionId: string;
}): Promise<ActivityLogEntry[]> {
  const authToken = await getAuthToken();

  const response = await fetch(
    `${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/solana/transactions/activity-logs?transactionId=${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-team-id": teamId,
        "x-chain-id": "solana:devnet", // TODO: Support multiple Solana networks
      },
      method: "GET",
    },
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      return [];
    }
    return [];
  }

  const data = (await response.json()) as ActivityLogsResponse;
  return data.result.activityLogs;
}
