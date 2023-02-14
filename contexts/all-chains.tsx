import type { Chain } from "@thirdweb-dev/chains";
import chainsPackage from "@thirdweb-dev/chains/package.json";
import { get, set } from "idb-keyval";
import React, { createContext, useEffect, useState } from "react";

type AllChainsData = {
  allChains: Chain[];
  chainIdToChainRecord: Record<number, Chain>;
  slugToChainRecord: Record<string, Chain>;
};

export const AllChainsContext = createContext<AllChainsData | undefined>(
  undefined,
);

const ALL_CHAINS_IDB_KEY = `allChains-${chainsPackage.version}`;

/**
 * if no networks are configured by the user, return the defaultChains
 */
export function AllChainsProvider(props: { children: React.ReactNode }) {
  const [allChainsData, setAllChainsData] = useState<AllChainsData>({
    allChains: [],
    chainIdToChainRecord: {},
    slugToChainRecord: {},
  });

  useEffect(() => {
    if (allChainsData.allChains.length !== 0) {
      return;
    }

    function updateState(_allChains: Chain[]) {
      const _slugToChainRecord: Record<string, Chain> = {};
      const _chainIdToChainRecord: Record<number, Chain> = {};

      for (const chain of _allChains) {
        _slugToChainRecord[chain.slug] = chain;
        _chainIdToChainRecord[chain.chainId] = chain;
      }

      setAllChainsData({
        allChains: _allChains,
        chainIdToChainRecord: _chainIdToChainRecord,
        slugToChainRecord: _slugToChainRecord,
      });
    }

    async function fetchAllChains() {
      const _allChains = await get(ALL_CHAINS_IDB_KEY);
      if (_allChains) {
        updateState(_allChains);
      } else {
        const _module = await import("@thirdweb-dev/chains");
        updateState(_module.allChains);
        set(ALL_CHAINS_IDB_KEY, _module.allChains);
      }
    }

    fetchAllChains();
  }, [allChainsData]);

  return (
    <AllChainsContext.Provider value={allChainsData}>
      {props.children}
    </AllChainsContext.Provider>
  );
}
