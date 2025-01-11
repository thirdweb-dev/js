import { getUnixTime } from "date-fns";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "../../@/constants/env";
import { getVercelEnv } from "../../lib/vercel-utils";

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

export async function getContractUniqueWalletAnalytics(params: {
  contractAddress: string;
  chainId: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<TransactionAnalyticsEntry[]> {
  const queryParams = [
    `chain=${params.chainId}`,
    "group_by=time",
    "aggregate=toStartOfDay(toDate(block_timestamp)) as time",
    "aggregate=count(distinct from_address) as count",
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
        "x-client-id": DASHBOARD_THIRDWEB_CLIENT_ID,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  const json = (await res.json()) as InsightResponse;
  const aggregations = Object.values(json.aggregations[0]);

  const returnValue: TransactionAnalyticsEntry[] = [];

  for (const tx of aggregations) {
    if (
      typeof tx === "object" &&
      tx !== null &&
      "time" in tx &&
      "count" in tx &&
      typeof tx.time === "string" &&
      typeof tx.count === "number"
    ) {
      returnValue.push({
        count: tx.count,
        time: new Date(tx.time),
      });
    }
  }

  return returnValue.sort((a, b) => a.time.getTime() - b.time.getTime());
}
