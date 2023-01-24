import { Chain, defaultChains } from "@thirdweb-dev/chains";
import React, { PropsWithChildren, createContext, useContext } from "react";

interface ThirdwebConfigContext {
  chains: Chain[];
  rpcUrlMap: Record<number, string>;
}

const ThirdwebConfigContext = createContext<ThirdwebConfigContext>({
  chains: defaultChains,
  rpcUrlMap: defaultChains.reduce((acc, chain) => {
    acc[chain.chainId] = chain.rpc[0];
    return acc;
  }, {} as Record<number, string>),
});

export const ThirdwebConfigProvider: React.FC<
  PropsWithChildren<{
    value: ThirdwebConfigContext;
  }>
> = ({ value, children }) => (
  <ThirdwebConfigContext.Provider value={value}>
    {children}
  </ThirdwebConfigContext.Provider>
);

export function useThirdwebConfigContext() {
  return useContext(ThirdwebConfigContext);
}
