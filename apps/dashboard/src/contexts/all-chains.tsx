import { useApiChains } from "@3rdweb-sdk/react/hooks/useApi";
import { createContext, useMemo } from "react";
import type { ChainMetadata } from "thirdweb/chains";

type AllChainsData = {
  allChains: ChainMetadata[];
  chainIdToChainRecord: Record<number, ChainMetadata>;
  chainIdToIndexRecord: Record<number, number>;
  slugToChainRecord: Record<string, ChainMetadata>;
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
    const slugToChainRecord: Record<string, ChainMetadata> = {};
    const chainIdToChainRecord: Record<number, ChainMetadata> = {};
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
