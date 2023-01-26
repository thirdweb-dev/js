import { SupportedChainId, defaultSupportedChains } from "../constants/chain";
import { Chain } from "../types";
import React, { PropsWithChildren, createContext, useContext } from "react";

interface ThirdwebConfigContext {
  rpcUrlMap: Record<SupportedChainId | number, string>;
  supportedChains: Chain[];
}

const ThirdwebConfigContext = createContext<ThirdwebConfigContext>({
  rpcUrlMap: [], // TODO (jonas) use default chains here
  supportedChains: defaultSupportedChains,
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
