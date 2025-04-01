import "server-only";

import { BRIDGE_URL, DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/env";
import { getAuthToken } from "app/api/lib/getAuthToken";
import type { Route } from "./types/route";

export async function getRoutes({
  limit,
}: {
  limit?: number;
} = {}) {
  const url = new URL(`${BRIDGE_URL}/v1/routes`);
  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }
  // It's faster to filter client side, doesn't seem to be a big performance boost to paginate/filter server side
  const token = await getAuthToken();
  const routesResponse = await fetch(url, {
    headers: token
      ? {
          authorization: `Bearer ${token}`,
        }
      : {
          "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
        },
    next: { revalidate: 60 * 60 },
  });

  if (!routesResponse.ok) {
    throw new Error("Failed to fetch routes");
  }
  const routes: { data: Route[] } = await routesResponse.json();

  return routes.data;
}
