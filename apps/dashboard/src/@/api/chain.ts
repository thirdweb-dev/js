import "server-only";
import type { ChainMetadata } from "thirdweb/chains";
import { NEXT_PUBLIC_THIRDWEB_API_HOST } from "@/constants/public-envs";
import type { ChainService } from "@/types/chain";

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
