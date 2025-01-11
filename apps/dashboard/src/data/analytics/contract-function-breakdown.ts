import { getUnixTime } from "date-fns";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "../../@/constants/env";
import { getVercelEnv } from "../../lib/vercel-utils";

type InsightAggregationEntry = {
  function_selector: string;
  time: string;
  count: number;
};

// This is weird aggregation response type, this will be changed later in insight
type InsightResponse = {
  aggregations: [Record<string, InsightAggregationEntry | unknown>];
};

type FunctionBreakdownEntry = Record<string, number> & {
  time: Date;
};

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

export async function getContractFunctionBreakdown(params: {
  contractAddress: string;
  chainId: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<FunctionBreakdownEntry[]> {
  const queryParams = [
    `chain=${params.chainId}`,
    "group_by=time",
    "group_by=function_selector",
    "aggregate=toStartOfDay(toDate(block_timestamp)) as time",
    "aggregate=count(*) as count",
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

  const dayToFunctionSelectorToCount: Map<
    string,
    Record<string, number>
  > = new Map();

  const json = (await res.json()) as InsightResponse;
  const aggregations = Object.values(json.aggregations[0]);
  const collectedAggregations: InsightAggregationEntry[] = [];

  for (const value of aggregations) {
    if (
      typeof value === "object" &&
      value !== null &&
      "time" in value &&
      "count" in value &&
      "function_selector" in value &&
      typeof value.function_selector === "string" &&
      typeof value.time === "string" &&
      typeof value.count === "number"
    ) {
      collectedAggregations.push({
        count: value.count,
        time: value.time,
        function_selector: value.function_selector,
      });
    }
  }

  for (const value of collectedAggregations) {
    const mapKey = value.time;
    let valueForDay = dayToFunctionSelectorToCount.get(mapKey);
    if (!valueForDay) {
      valueForDay = {};
      dayToFunctionSelectorToCount.set(mapKey, valueForDay);
    }

    valueForDay[value.function_selector] =
      (valueForDay[value.function_selector] || 0) + value.count;
  }

  const values: FunctionBreakdownEntry[] = [];
  for (const [day, value] of dayToFunctionSelectorToCount.entries()) {
    values.push({
      time: new Date(day),
      ...value,
    } as FunctionBreakdownEntry);
  }

  return values.sort((a, b) => {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });
}
