import { NEXT_PUBLIC_DASHBOARD_CLIENT_ID } from "@/constants/public-envs";
import { getVercelEnv } from "@/utils/vercel";

// This is weird aggregation response type, this will be changed later in insight
type InsightResponse = {
  aggregations: [
    {
      0: {
        count: number;
      };
    },
  ];
};

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

export async function getTotalContractEvents(params: {
  contractAddress: string;
  chainId: number;
}): Promise<{ count: number }> {
  const queryParams = [`chain=${params.chainId}`, "aggregate=count()"].join(
    "&",
  );

  const res = await fetch(
    `https://insight.${thirdwebDomain}.com/v1/events/${params.contractAddress}?${queryParams}`,
    {
      headers: {
        "x-client-id": NEXT_PUBLIC_DASHBOARD_CLIENT_ID,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  const json = (await res.json()) as InsightResponse;

  return {
    count: json.aggregations[0][0].count,
  };
}
