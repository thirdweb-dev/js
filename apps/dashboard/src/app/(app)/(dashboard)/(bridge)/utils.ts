import "server-only";

import { NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST } from "@/constants/public-envs";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import type { Address } from "thirdweb";
import type { Route } from "./types/route";

export async function getRoutes({
  limit,
  offset,
  originQuery,
  destinationQuery,
  originChainId,
  destinationChainId,
  originTokenAddress,
  destinationTokenAddress,
}: {
  limit?: number;
  offset?: number;
  originQuery?: string;
  destinationQuery?: string;
  originChainId?: number;
  destinationChainId?: number;
  originTokenAddress?: Address;
  destinationTokenAddress?: Address;
} = {}) {
  const url = new URL(`${NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST}/v1/routes`);
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
  if (originChainId) {
    url.searchParams.set("originChainId", originChainId.toString());
  }
  if (destinationChainId) {
    url.searchParams.set("destinationChainId", destinationChainId.toString());
  }
  if (originTokenAddress) {
    url.searchParams.set("originTokenAddress", originTokenAddress);
  }
  if (destinationTokenAddress) {
    url.searchParams.set("destinationTokenAddress", destinationTokenAddress);
  }
  url.searchParams.set("sortBy", "popularity");
  // It's faster to filter client side, doesn't seem to be a big performance boost to paginate/filter server side
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

export async function getOnrampCountrySupport(
  provider: "stripe" | "coinbase" | "transak",
) {
  const url = new URL(
    `${NEXT_PUBLIC_THIRDWEB_BRIDGE_HOST}/v1/onramp/countries`,
  );
  url.searchParams.set("provider", provider);
  const res = await fetch(url.toString(), {
    headers: {
      "x-secret-key": DASHBOARD_THIRDWEB_SECRET_KEY,
    },
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch onramp countries");
  }

  const json = await res.json();
  return json.data as import("./types/onramp-country").OnrampCountrySupport;
}
