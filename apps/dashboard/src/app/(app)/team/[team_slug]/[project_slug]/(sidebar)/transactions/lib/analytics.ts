import { getAuthToken } from "@/api/auth-token";
import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";
import type { TransactionStats } from "@/types/analytics";
import type {
  Transaction,
  TransactionsResponse,
} from "../analytics/tx-table/types";

// Define the structure of the data we expect back from our fetch function
export type TransactionSummaryData = {
  totalCount: number;
  totalGasCostWei: string;
  totalGasUnitsUsed: string; // Keep fetched data structure
};

// Define the structure of the API response
type AnalyticsSummaryApiResponse = {
  result: {
    summary: {
      totalCount: number;
      totalGasCostWei: string;
      totalGasUnitsUsed: string;
    };
    metadata: {
      startDate?: string;
      endDate?: string;
    };
  };
};

// Fetches data from the /analytics-summary endpoint
export async function getTransactionAnalyticsSummary(props: {
  teamId: string;
  clientId: string;
}): Promise<TransactionSummaryData> {
  const authToken = await getAuthToken();
  const body = {};
  const defaultData: TransactionSummaryData = {
    totalCount: 0,
    totalGasCostWei: "0",
    totalGasUnitsUsed: "0",
  };

  try {
    const response = await fetch(
      `${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/transactions/analytics-summary`,
      {
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "x-client-id": props.clientId,
          "x-team-id": props.teamId,
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 400) {
        console.error("Unauthorized fetching transaction summary");
        return defaultData;
      }
      const errorText = await response.text();
      throw new Error(
        `Error fetching transaction summary: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as AnalyticsSummaryApiResponse;

    return {
      totalCount: data.result.summary.totalCount ?? 0,
      totalGasCostWei: data.result.summary.totalGasCostWei ?? "0",
      totalGasUnitsUsed: data.result.summary.totalGasUnitsUsed ?? "0",
    };
  } catch (error) {
    console.error("Failed to fetch transaction summary:", error);
    return defaultData;
  }
}

export async function getTransactionsChart({
  teamId,
  clientId,
  from,
  to,
  interval,
}: {
  teamId: string;
  clientId: string;
  from: string;
  to: string;
  interval: "day" | "week";
}): Promise<TransactionStats[]> {
  const authToken = await getAuthToken();

  const filters = {
    endDate: to,
    resolution: interval,
    startDate: from,
  };

  const response = await fetch(
    `${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/transactions/analytics`,
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
    if (response.status === 401 || response.status === 400) {
      return [];
    }

    // TODO - need to handle this error state, like we do with the connect charts
    throw new Error(
      `Error fetching transactions chart data: ${response.status} ${
        response.statusText
      } - ${await response.text().catch(() => "Unknown error")}`,
    );
  }

  type TransactionsChartResponse = {
    result: {
      analytics: Array<{
        timeBucket: string;
        chainId: string;
        count: number;
      }>;
      metadata: {
        resolution: string;
        startDate: string;
        endDate: string;
      };
    };
  };

  const data = (await response.json()) as TransactionsChartResponse;

  return data.result.analytics.map((stat) => ({
    chainId: Number(stat.chainId),
    count: stat.count,
    date: stat.timeBucket,
  }));
}

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
