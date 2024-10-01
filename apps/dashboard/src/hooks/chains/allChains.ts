"use client";

import { isProd } from "@/constants/env";
import { createStore, useStore } from "@/lib/reactive";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ChainMetadata } from "thirdweb/chains";
import {
  type StoredChain,
  chainOverridesStore,
} from "../../stores/chainStores";

type AllChainsStore = {
  allChains: StoredChain[];
  idToChain: Map<number, StoredChain | undefined>;
  nameToChain: Map<string, StoredChain | undefined>;
  slugToChain: Map<string, StoredChain | undefined>;
};

function createAllChainsStore() {
  const store = createStore<AllChainsStore>({
    allChains: [],
    idToChain: new Map(),
    nameToChain: new Map(),
    slugToChain: new Map(),
  });

  const dependencies = [chainOverridesStore, originalAllChainsStore];
  for (const dep of dependencies) {
    dep.subscribe(() => {
      updateAllChainsStore(
        originalAllChainsStore.getValue(),
        chainOverridesStore.getValue(),
      );
    });
  }

  function updateAllChainsStore(
    originalAllChains: ChainMetadata[],
    chainOverrides: StoredChain[],
  ) {
    // if original chains are not loaded yet - ignore
    if (originalAllChains.length === 0) {
      return;
    }

    // but don't ignore if chainOverrides is empty!

    const allChains: StoredChain[] = [];
    const idToChain: Map<number, StoredChain | undefined> = new Map();
    const nameToChain: Map<string, StoredChain | undefined> = new Map();
    const slugToChain: Map<string, StoredChain | undefined> = new Map();

    for (let i = 0; i < originalAllChains.length; i++) {
      let _chain = originalAllChains[i];

      // for dev env, replace the rpc urls to dev domain
      if (!isProd) {
        _chain = {
          ..._chain,
          rpc: _chain.rpc.map((rpc) =>
            rpc.replace("rpc.thirdweb.com", "rpc.thirdweb-dev.com"),
          ),
        };
      }

      const chain: StoredChain =
        chainOverrides.find((x) => x.chainId === _chain.chainId) || _chain;

      allChains.push(chain);
      idToChain.set(chain.chainId, chain);
      nameToChain.set(chain.name, chain);
      slugToChain.set(chain.slug, chain);
    }

    // add custom chains
    for (const c of chainOverrides) {
      if (c.isCustom) {
        allChains.push(c);
        idToChain.set(c.chainId, c);
        nameToChain.set(c.name, c);
        slugToChain.set(c.slug, c);
      }
    }

    store.setValue({
      allChains,
      idToChain: idToChain,
      nameToChain: nameToChain,
      slugToChain: slugToChain,
    });
  }

  return store;
}

const originalAllChainsStore = /* @__PURE__ */ createStore<ChainMetadata[]>([]);
const allChainsStore = /* @__PURE__ */ createAllChainsStore();

async function fetchChainsFromApi() {
  // always fetch from prod for chains for now
  // TODO: re-visit this
  const res = await fetch("https://api.thirdweb.com/v1/chains");
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
    queryKey: ["all-chains"],
    queryFn: () => fetchChainsFromApi(),
  });

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // already set
    if (originalAllChainsStore.getValue().length > 0) {
      return;
    }

    if (!allChainsQuery.data) {
      return;
    }

    originalAllChainsStore.setValue(allChainsQuery.data);
  }, [allChainsQuery.data]);

  return useStore(allChainsStore);
}
