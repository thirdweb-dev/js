import { Chain, defaultChains } from "@thirdweb-dev/chains";
import React, { createContext, PropsWithChildren, useContext } from "react";

interface ThirdwebConfigContext {
  chains: Chain[];
  thirdwebApiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
}

const ThirdwebConfigContext = createContext<ThirdwebConfigContext>({
  chains: defaultChains,
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
