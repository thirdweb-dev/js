import { getUnixTime } from "date-fns";
import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";
import { getVercelEnv } from "@/utils/vercel";

// This is weird aggregation response type, this will be changed later in insight
type InsightResponse = {
  aggregations: [
    Record<
      string,
      | {
          time: string;
          count: number;
        }
      | unknown
    >,
  ];
};

type TransactionAnalyticsEntry = {
  count: number;
  time: Date;
};

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

export async function getContractTransactionAnalytics(params: {
  contractAddress: string;
  chainId: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<TransactionAnalyticsEntry[]> {
  const daysDifference =
    params.startDate && params.endDate
      ? Math.ceil(
          (params.endDate.getTime() - params.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 30;
  const queryParams = [
    `chain=${params.chainId}`,
    "group_by=day",
    `limit=${daysDifference}`,
    params.startDate
      ? `filter_block_timestamp_gte=${getUnixTime(params.startDate)}`
      : "",
    params.endDate
      ? `filter_block_timestamp_lte=${getUnixTime(params.endDate)}`
      : "",
  ]
    .filter(Boolean)
    .join("&");

  const res = await fetch(
    `https://insight.${thirdwebDomain}.com/v1/transactions/${params.contractAddress}?${queryParams}`,
    {
      headers: {
        "x-client-id": NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch transaction analytics data: ${errorText}`);
  }

  const json = (await res.json()) as InsightResponse;
  const aggregations = Object.values(json.aggregations[0]);

  const returnValue: TransactionAnalyticsEntry[] = [];

  for (const tx of aggregations) {
    if (
      typeof tx === "object" &&
      tx !== null &&
      "day" in tx &&
      "count" in tx &&
      typeof tx.day === "string"
    ) {
      returnValue.push({
        count: Number(tx.count),
        time: new Date(tx.day),
      });
    }
  }

  return returnValue.sort((a, b) => a.time.getTime() - b.time.getTime());
}
