import { getUnixTime } from "date-fns";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "../../@/constants/env";
import { getVercelEnv } from "../../lib/vercel-utils";

type InsightAggregationEntry = {
  event_signature: string;
  time: string;
  count: number;
};

// This is weird aggregation response type, this will be changed later in insight
type InsightResponse = {
  aggregations: [Record<string, InsightAggregationEntry | unknown>];
};

type EventBreakdownEntry = Record<string, number> & {
  time: Date;
};

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

export async function getContractEventBreakdown(params: {
  contractAddress: string;
  chainId: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<EventBreakdownEntry[]> {
  const queryParams = [
    `chain=${params.chainId}`,
    "group_by=time",
    "group_by=topic_0 as event_signature",
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

  const collectedAggregations: InsightAggregationEntry[] = [];
  for (const value of aggregations) {
    if (
      typeof value === "object" &&
      value !== null &&
      "time" in value &&
      "count" in value &&
      "event_signature" in value &&
      typeof value.event_signature === "string" &&
      typeof value.time === "string" &&
      typeof value.count === "number"
    ) {
      collectedAggregations.push({
        count: value.count,
        time: value.time,
        event_signature: value.event_signature,
      });
    }
  }

  const dayToFunctionBreakdownMap: Map<
    string,
    Record<string, number>
  > = new Map();

  for (const value of collectedAggregations) {
    const mapKey = value.time;
    let valueForDay = dayToFunctionBreakdownMap.get(mapKey);
    if (!valueForDay) {
      valueForDay = {};
      dayToFunctionBreakdownMap.set(mapKey, valueForDay);
    }

    valueForDay[value.event_signature] =
      (valueForDay[value.event_signature] || 0) + value.count;
  }

  const values: EventBreakdownEntry[] = [];

  for (const [day, value] of dayToFunctionBreakdownMap.entries()) {
    values.push({
      time: new Date(day),
      ...value,
    } as EventBreakdownEntry);
  }

  return values.sort((a, b) => {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });
}
