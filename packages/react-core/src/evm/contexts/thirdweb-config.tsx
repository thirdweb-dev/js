import {
  SupportedChainId,
  defaultSupportedChains,
} from "../constants/chain";
import { DEFAULT_RPC_URLS } from "@thirdweb-dev/sdk";
import React, { PropsWithChildren, createContext, useContext } from "react";
import { Chain } from "../types";

interface ThirdwebConfigContext {
  rpcUrlMap: Record<SupportedChainId | number, string>;
  supportedChains: Chain[];
}

const ThirdwebConfigContext = createContext<ThirdwebConfigContext>({
  rpcUrlMap: DEFAULT_RPC_URLS,
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
