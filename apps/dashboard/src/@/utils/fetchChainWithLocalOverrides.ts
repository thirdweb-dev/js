import "server-only";

import { cookies } from "next/headers";
import type { ChainMetadata } from "thirdweb/chains";
import { TW_LOCAL_CHAIN_STORE } from "@/stores/storageKeys";
import { fetchChain } from "./fetchChain";

export async function fetchChainWithLocalOverrides(
  chainIdOrSlug: string | number,
): Promise<ChainMetadata | null> {
  const cookieStore = await cookies();
  const localChainStoreValue = cookieStore.get(TW_LOCAL_CHAIN_STORE)?.value;

  if (localChainStoreValue) {
    try {
      const chains = JSON.parse(decodeURIComponent(localChainStoreValue));
      if (typeof chains === "object" && Array.isArray(chains)) {
        const chainOverrides = chains as ChainMetadata[];
        const savedChain = chainOverrides.find(
          (c) =>
            c.slug === chainIdOrSlug || c.chainId.toString() === chainIdOrSlug,
        );
        if (savedChain) {
          return savedChain;
        }
      }
    } catch {
      // noop
    }
  }

  return fetchChain(chainIdOrSlug);
}
