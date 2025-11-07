"use client";
import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";
import type { TransactionStats } from "@/types/analytics";

export async function getTransactionsChartData({
  teamId,
  clientId,
  from,
  to,
  interval,
  authToken,
}: {
  teamId: string;
  clientId: string;
  from: string;
  to: string;
  interval: "day" | "week";
  authToken: string;
}): Promise<TransactionStats[]> {
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
