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
  const json = await res?.json();

  if (!res || res.status !== 200) {
    throw new Error(json.message);
  }

  return json.data;
}
