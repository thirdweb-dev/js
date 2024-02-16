import { SmartWallet } from "@thirdweb-dev/wallets";
import { createContext, useContext, useState } from "react";
import { useWalletConnectListener } from "../wallets/hooks/useWalletConnectListener";

type DappContextType = {
  smartWallet?: SmartWallet;
  setSmartWallet?: (value?: SmartWallet) => void;
};

const DappContext = createContext<DappContextType>({});

export const DappContextProvider = (props: React.PropsWithChildren) => {
  const [smartWallet, setSmartWallet] = useState<SmartWallet | undefined>();

  useWalletConnectListener();

  return (
    <DappContext.Provider
      value={{
        smartWallet,
        setSmartWallet,
      }}
    >
      {props.children}
    </DappContext.Provider>
  );
};

export const useDappContext = () => {
  return useContext(DappContext);
};

export const useSmartWallet = () => {
  const context = useContext(DappContext);

  return [context.smartWallet, context.setSmartWallet] as const;
};
