import "server-only";
import type { ChainMetadata } from "thirdweb/chains";
import type { ChainService } from "../../app/(app)/(dashboard)/(chain)/types/chain";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "../constants/public-envs";
import { API_SERVER_SECRET } from "../constants/server-envs";

export async function getGasSponsoredChains() {
  if (!API_SERVER_SECRET) {
    throw new Error("API_SERVER_SECRET is not set");
  }
  const res = await fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/chains/gas-sponsored`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-service-api-key": API_SERVER_SECRET,
      },
      next: {
        revalidate: 15 * 60, //15 minutes
      },
    },
  );

  if (!res.ok) {
    console.error(
      "Failed to fetch gas sponsored chains",
      res.status,
      res.statusText,
    );
    res.body?.cancel();
    return [];
  }

  try {
    return (await res.json()).data as number[];
  } catch (e) {
    console.error("Failed to parse gas sponsored chains", e);
    return [];
  }
}

export function getChains() {
  return fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/chains`,
    // revalidate every 60 minutes
    { next: { revalidate: 60 * 60 } },
  ).then((res) => res.json()) as Promise<{ data: ChainMetadata[] }>;
}

export function getChainServices() {
  return fetch(
    `${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/chains/services`,
    // revalidate every 60 minutes
    { next: { revalidate: 60 * 60 } },
  ).then((res) => res.json()) as Promise<{
    data: Record<number, Array<ChainService>>;
  }>;
}
