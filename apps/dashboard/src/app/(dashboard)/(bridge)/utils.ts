import "server-only";

import { BRIDGE_URL, DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/env";
import type { Address } from "thirdweb";
import type { Route } from "./types/route";

export async function getRoutes({
  limit,
  offset,
  originChainId,
  originTokenAddress,
  destinationChainId,
  destinationTokenAddress,
}: {
  limit?: number;
  offset?: number;
  originChainId?: number;
  originTokenAddress?: Address;
  destinationChainId?: number;
  destinationTokenAddress?: Address;
} = {}) {
  const url = new URL(`${BRIDGE_URL}/v1/routes`);
  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }
  if (offset) {
    url.searchParams.set("offset", offset.toString());
  }
  if (originChainId) {
    url.searchParams.set("originChainId", originChainId.toString());
  }
  if (originTokenAddress) {
    url.searchParams.set("originTokenAddress", originTokenAddress);
  }
  if (destinationChainId) {
    url.searchParams.set("destinationChainId", destinationChainId.toString());
  }
  if (destinationTokenAddress) {
    url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  }
  const routesResponse = await fetch(url, {
    headers: { "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY },
    next: { revalidate: 60 * 60 },
  });

  if (!routesResponse.ok) {
    throw new Error("Failed to fetch routes");
  }
  const routes: { data: Route[] } = await routesResponse.json();

  return routes.data;
}
