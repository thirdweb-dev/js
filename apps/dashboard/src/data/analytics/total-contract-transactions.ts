import { DASHBOARD_THIRDWEB_CLIENT_ID } from "../../@/constants/env";
import { getVercelEnv } from "../../lib/vercel-utils";

// This is weird aggregation response type, this will be changed later in insight
type InsightResponse = {
  aggregations: [
    {
      0: {
        total: number;
      };
    },
  ];
};

const thirdwebDomain =
  getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

export async function getTotalContractTransactions(params: {
  contractAddress: string;
  chainId: number;
}): Promise<{ count: number }> {
  const queryParams = [
    `chain=${params.chainId}`,
    "aggregate=count(block_number) as total",
  ].join("&");

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

  return {
    count: json.aggregations[0][0].total,
  };
}
