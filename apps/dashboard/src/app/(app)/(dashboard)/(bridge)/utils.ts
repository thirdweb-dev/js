import "server-only";

import { NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST } from "@/constants/public-envs";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import type { Route } from "./types/route";

export async function getRoutes({
  limit,
  offset,
  originQuery,
  destinationQuery,
}: {
  limit?: number;
  offset?: number;
  originQuery?: string;
  destinationQuery?: string;
} = {}) {
  const url = new URL(`${NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST}/v1/routes/search`);
  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }
  if (offset) {
    url.searchParams.set("offset", offset.toString());
  }
  if (originQuery) {
    url.searchParams.set("originQuery", originQuery);
  }
  if (destinationQuery) {
    url.searchParams.set("destinationQuery", destinationQuery);
  }
  url.searchParams.set("sortBy", "popularity");
  const routesResponse = await fetch(url, {
    headers: {
      "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
    },
    next: { revalidate: 60 * 60 },
  });

  if (!routesResponse.ok) {
    throw new Error("Failed to fetch routes");
  }
  const routes: {
    data: Route[];
    meta: { totalCount: number; filteredCount: number };
  } = await routesResponse.json();

  return routes;
}
