"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Chain, ChainMetadata } from "thirdweb/chains";
import { isProd } from "@/constants/env-utils";
// import { isProd } from "@/constants/env-utils";
import { createStore, useStore } from "@/lib/reactive";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";

type AllChainsStore = {
  allChains: ChainMetadata[];
  allChainsV5: Chain[];
  idToChain: Map<number, ChainMetadata | undefined>;
  nameToChain: Map<string, ChainMetadata | undefined>;
  slugToChain: Map<string, ChainMetadata | undefined>;
};

function updateAllChainsStore(chains: ChainMetadata[]) {
  // if original chains are not loaded yet - ignore
  if (chains.length === 0) {
    return;
  }

  // but don't ignore if chainOverrides is empty!

  const allChains: ChainMetadata[] = [];
  const allChainsV5: Chain[] = [];
  const idToChain: Map<number, ChainMetadata | undefined> = new Map();
  const nameToChain: Map<string, ChainMetadata | undefined> = new Map();
  const slugToChain: Map<string, ChainMetadata | undefined> = new Map();

  for (let i = 0; i < chains.length; i++) {
    let chain = chains[i];
    if (!chain) {
      continue;
    }

    // for dev env, replace the rpc urls to dev domain
    if (!isProd) {
      chain = {
        ...chain,
        rpc: chain.rpc.map((rpc) =>
          rpc.replace("rpc.thirdweb.com", "rpc.thirdweb-dev.com"),
        ),
      };
    }

    allChains.push(chain);
    // eslint-disable-next-line no-restricted-syntax
    allChainsV5.push(mapV4ChainToV5Chain(chain));
    idToChain.set(chain.chainId, chain);
    nameToChain.set(chain.name, chain);
    slugToChain.set(chain.slug, chain);
  }

  allChainsStore.setValue({
    allChains,
    allChainsV5,
    idToChain: idToChain,
    nameToChain: nameToChain,
    slugToChain: slugToChain,
  });
}

function createAllChainsStore() {
  return createStore<AllChainsStore>({
    allChains: [],
    allChainsV5: [],
    idToChain: new Map(),
    nameToChain: new Map(),
    slugToChain: new Map(),
  });
}

const allChainsStore = /* @__PURE__ */ createAllChainsStore();

async function fetchChainsFromApi() {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch("https://api.thirdweb.com/v1/chains");

  if (!res.ok) {
    throw new Error("Failed to fetch chains");
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.data as ChainMetadata[];
}

export function useAllChainsData() {
  // trigger fetching all chains if this hook is used instead of putting this on root
  // so we can avoid fetching all chains if it's not required
  const allChainsQuery = useQuery({
    queryFn: () => fetchChainsFromApi(),
    queryKey: ["all-chains"],
  });

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // already set
    if (allChainsStore.getValue().allChains.length > 0) {
      return;
    }

    if (!allChainsQuery.data) {
      return;
    }

    updateAllChainsStore(allChainsQuery.data);
  }, [allChainsQuery.data]);

  return useStore(allChainsStore);
}
