import type { Transaction } from "thirdweb/dist/types/insight/get-transactions";
import { THIRDWEB_ENGINE_CLOUD_URL } from "../../../../../../@/constants/env";
import type { TransactionStats } from "../../../../../../types/analytics";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";

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
      `${THIRDWEB_ENGINE_CLOUD_URL}/project/transactions/analytics-summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-team-id": props.teamId,
          "x-client-id": props.clientId,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
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
    startDate: from,
    endDate: to,
    resolution: interval,
  };

  const response = await fetch(
    `${THIRDWEB_ENGINE_CLOUD_URL}/project/transactions/analytics`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-id": teamId,
        "x-client-id": clientId,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(filters),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return [];
    }

    // TODO - need to handle this error state, like we do with the connect charts
    throw new Error(
      `Error fetching transactions chart data: ${response.status} ${response.statusText} - ${await response.text().catch(() => "Unknown error")}`,
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
    date: stat.timeBucket,
    chainId: Number(stat.chainId),
    count: stat.count,
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
        values: [transactionId],
        operation: "OR",
      },
    ],
  };

  const response = await fetch(
    `${THIRDWEB_ENGINE_CLOUD_URL}/project/transactions/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-id": teamId,
        "x-client-id": clientId,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(filters),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      return undefined;
    }

    // TODO - need to handle this error state, like we do with the connect charts
    throw new Error(
      `Error fetching single transaction data: ${response.status} ${response.statusText} - ${await response.text().catch(() => "Unknown error")}`,
    );
  }

  type TransactionParam = {
    to: string;
    data: string;
    value: string;
  };

  type ExecutionParams = {
    type: string;
    signerAddress: string;
    entrypointAddress: string;
    smartAccountAddress: string;
  };

  type ExecutionResult = {
    status: string;
  };

  type Transaction = {
    id: string;
    batchIndex: number;
    chainId: string;
    from: string;
    transactionParams: TransactionParam[];
    transactionHash: string | null;
    confirmedAt: string | null;
    confirmedAtBlockNumber: number | null;
    enrichedData: unknown[];
    executionParams: ExecutionParams;
    executionResult: ExecutionResult;
    createdAt: string;
    errorMessage: string | null;
    cancelledAt: string | null;
  };

  type Pagination = {
    totalCount: string;
    page: number;
    limit: number;
  };

  type TransactionsSearchResponse = {
    result: {
      transactions: Transaction[];
      pagination: Pagination;
    };
  };

  const data = (await response.json()) as TransactionsSearchResponse;

  return data.result.transactions[0];
}
