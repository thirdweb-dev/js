import { createContext, useContext, useState } from "react";

type DappContextType = {
  isConnectModalVisible: boolean;
  setIsConnectModalVisible: (isVisible: boolean) => void;
  selectedWallet?: 
};

const DappContext = createContext<DappContextType>({
  isConnectModalVisible: false,
  setIsConnectModalVisible: () => {},
});

export const DappContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);

  return (
    <DappContext.Provider
      value={{ isConnectModalVisible, setIsConnectModalVisible }}
    >
      {props.children}
    </DappContext.Provider>
  );
};

export const useDappContext = () => {
  return useContext(DappContext);
};

export const useIsConnectModalVisible = () => {
  const context = useContext(DappContext);

  return {
    isConnectModalVisible: context.isConnectModalVisible,
    setIsConnectModalVisible: context.setIsConnectModalVisible,
  } as const;
};

export const useSelectedWallet = () => {
  const context = useContext(DappContext);

  return context.selectedWallet;
};
