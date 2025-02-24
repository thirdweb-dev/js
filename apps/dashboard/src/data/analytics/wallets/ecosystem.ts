import type { EcosystemWalletStats } from "types/analytics";
import { fetchAnalytics } from "../fetch-analytics";

export async function getEcosystemWalletUsage(args: {
  teamId: string;
  ecosystemSlug: string;
  ecosystemPartnerId?: string;
  projectId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}) {
  const {
    ecosystemSlug,
    ecosystemPartnerId,
    teamId,
    projectId,
    from,
    to,
    period,
  } = args;

  const searchParams = new URLSearchParams();
  // required params
  searchParams.append("ecosystemSlug", ecosystemSlug);
  searchParams.append("teamId", teamId);

  // optional params
  if (ecosystemPartnerId) {
    searchParams.append("ecosystemPartnerId", ecosystemPartnerId);
  }
  if (projectId) {
    searchParams.append("projectId", projectId);
  }
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
    `v2/wallets/connects/${ecosystemSlug}?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res?.status !== 200) {
    console.error("Failed to fetch ecosystem wallet stats");
    return null;
  }

  const json = await res.json();

  return json.data as EcosystemWalletStats[];
}
