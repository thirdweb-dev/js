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

type AnalyticsEntry = {
  count: number;
  time: Date;
};

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

export async function getContractEventAnalytics(params: {
  contractAddress: string;
  chainId: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<AnalyticsEntry[]> {
  const queryParams = [
    `chain=${params.chainId}`,
    "group_by=time",
    "aggregate=toStartOfDay(toDate(block_timestamp)) as time",
    "aggregate=count(block_timestamp) as count",
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
    `https://insight.${thirdwebDomain}.com/v1/events/${params.contractAddress}?${queryParams}`,
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

  const values: AnalyticsEntry[] = [];

  for (const value of aggregations) {
    if (
      typeof value === "object" &&
      value !== null &&
      "time" in value &&
      "count" in value &&
      typeof value.time === "string" &&
      typeof value.count === "number"
    ) {
      values.push({
        count: value.count,
        time: new Date(value.time),
      });
    }
  }

  return values.sort((a, b) => a.time.getTime() - b.time.getTime());
}
