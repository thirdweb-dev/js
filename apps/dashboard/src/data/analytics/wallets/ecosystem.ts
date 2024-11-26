import type { EcosystemWalletStats } from "types/analytics";
import { fetchAnalytics } from "../fetch-analytics";

export async function getEcosystemWalletUsage(args: {
  ecosystemId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}) {
  const { ecosystemId, from, to, period } = args;

  const searchParams = new URLSearchParams();
  if (from) {
    searchParams.append("from", from.toISOString());
  }
  if (to) {
    searchParams.append("to", to.toISOString());
  }
  if (period) {
    searchParams.append("period", period);
  }
  const res = await fetchAnalytics(
    `v1/wallets/ecosystem/${ecosystemId}?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res?.status !== 200) {
    console.error("Failed to fetch in-app wallet stats");
    return null;
  }

  const json = await res.json();

  return json.data as EcosystemWalletStats[];
}
