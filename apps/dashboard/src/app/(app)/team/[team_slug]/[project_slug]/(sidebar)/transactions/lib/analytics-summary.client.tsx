"use client";

import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";

export type TransactionSummaryData = {
  totalCount: number;
  totalGasCostWei: string;
  totalGasUnitsUsed: string; // Keep fetched data structure
};

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
  authToken: string;
}): Promise<TransactionSummaryData> {
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
          Authorization: `Bearer ${props.authToken}`,
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
