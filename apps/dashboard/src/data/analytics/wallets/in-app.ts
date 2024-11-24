import type { InAppWalletStats } from "types/analytics";
import { fetchAnalytics } from "../fetch-analytics";

export async function getInAppWalletUsage(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}) {
  const { clientId, from, to, period } = args;

  const searchParams = new URLSearchParams();
  searchParams.append("clientId", clientId);
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
    `v1/wallets/in-app?${searchParams.toString()}`,
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

  return json.data as InAppWalletStats[];
}
