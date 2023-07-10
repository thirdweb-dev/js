import { Chain, defaultChains } from "@thirdweb-dev/chains";
import React, { createContext, PropsWithChildren, useContext } from "react";

interface ThirdwebConfigContext {
  chains: Chain[];
  apiKey?: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
}

const ThirdwebConfigContext =
  /* @__PURE__ */ createContext<ThirdwebConfigContext>({
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
