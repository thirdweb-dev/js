import { Chain } from "@thirdweb-dev/chains";
import React, { createContext, PropsWithChildren, useContext } from "react";
import invariant from "tiny-invariant";

interface ThirdwebConfigContext {
  chains: Chain[];
  clientId?: string;
}

export const ThirdwebConfigContext = /* @__PURE__ */ createContext<
  ThirdwebConfigContext | undefined
>(undefined);

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
  const context = useContext(ThirdwebConfigContext);
  invariant(
    context,
    "useThirdwebConfigContext() hook must be used within a <ThirdwebProvider/>",
  );
  return context;
}
