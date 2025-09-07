import { getUnixTime } from "date-fns";
import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";
import { getVercelEnv } from "@/utils/vercel";

type InsightAggregationEntry = {
  topic_0: string;
  day: string;
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
    "group_by=topic_0",
    `limit=${daysDifference * 10}`, // at most 10 topics per day
    params.startDate
      ? `filter_block_timestamp_gte=${getUnixTime(params.startDate)}`
      : "",
    params.endDate
      ? `filter_block_timestamp_lte=${getUnixTime(params.endDate)}`
      : "",
  ]
    .filter(Boolean)
    .join("&");

  const url = `https://insight.${thirdwebDomain}.com/v1/events/${params.contractAddress}?${queryParams}`;

  const res = await fetch(url, {
    headers: {
      "x-client-id": NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
    },
  });

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
      "day" in value &&
      "count" in value &&
      "topic_0" in value &&
      typeof value.topic_0 === "string" &&
      typeof value.day === "string"
    ) {
      collectedAggregations.push({
        count: Number(value.count),
        topic_0: value.topic_0,
        day: value.day,
      });
    }
  }

  const dayToFunctionBreakdownMap: Map<
    string,
    Record<string, number>
  > = new Map();

  for (const value of collectedAggregations) {
    const mapKey = value.day;
    let valueForDay = dayToFunctionBreakdownMap.get(mapKey);
    if (!valueForDay) {
      valueForDay = {};
      dayToFunctionBreakdownMap.set(mapKey, valueForDay);
    }

    valueForDay[value.topic_0] =
      (valueForDay[value.topic_0] || 0) + value.count;
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
