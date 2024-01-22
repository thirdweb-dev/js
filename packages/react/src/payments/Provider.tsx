// UNCHANGED
import type { SupportedChainName } from "@thirdweb-dev/payments";
import type { Dispatch, SetStateAction } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

interface SDKContext {
  chainName: SupportedChainName;
  setChainName: Dispatch<SetStateAction<SupportedChainName>>;
  clientId: string;
  appName: string;
}

const defaultContextValue: SDKContext = {
  chainName: "Polygon",
  setChainName: () => {},
  clientId: "",
  appName: "",
};

const PaymentsSDKContext = /* @__PURE__ */ createContext(defaultContextValue);

export interface PaymentsProviderProps {
  chainName?: SupportedChainName;
  appName?: string;
  clientId?: string;
}

export const PaymentsSDKProvider = ({
  appName = "",
  chainName = "Polygon",
  clientId = "",
  children,
}: React.PropsWithChildren<PaymentsProviderProps>) => {
  const [chainName_, setChainName] = useState<SupportedChainName>(chainName);
  const contextValue = useMemo(
    () => ({
      chainName: chainName_,
      setChainName,
      appName: appName,
      clientId: clientId,
    }),
    [chainName_, appName, clientId],
  );

  return (
    <PaymentsSDKContext.Provider value={contextValue}>
      {children}
    </PaymentsSDKContext.Provider>
  );
};

export const usePaymentsSDKContext = (): SDKContext => {
  return useContext(PaymentsSDKContext);
};
