import { useApiChains } from "@3rdweb-sdk/react/hooks/useApi";
import type { Chain } from "@thirdweb-dev/chains";
import React, { createContext, useMemo } from "react";

type AllChainsData = {
  allChains: Chain[];
  chainIdToChainRecord: Record<number, Chain>;
  chainIdToIndexRecord: Record<number, number>;
  slugToChainRecord: Record<string, Chain>;
};

export const AllChainsContext = createContext<AllChainsData | undefined>(
  undefined,
);

/**
 * if no networks are configured by the user, return the defaultChains
 */
export function AllChainsProvider(props: { children: React.ReactNode }) {
  const { data } = useApiChains();

  const allChainsData: AllChainsData = useMemo(() => {
    const slugToChainRecord: Record<string, Chain> = {};
    const chainIdToChainRecord: Record<number, Chain> = {};
    const chainIdToIndexRecord: Record<number, number> = {};
    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        const chain = data[i];
        slugToChainRecord[chain.slug] = chain;
        chainIdToChainRecord[chain.chainId] = chain;
        chainIdToIndexRecord[chain.chainId] = i;
      }
    }
    return {
      allChains: data || [],
      chainIdToChainRecord,
      slugToChainRecord,
      chainIdToIndexRecord,
    };
  }, [data]);

  return (
    <AllChainsContext.Provider value={allChainsData}>
      {props.children}
    </AllChainsContext.Provider>
  );
}
