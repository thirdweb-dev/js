import { SmartWallet, walletIds } from "@thirdweb-dev/wallets";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWalletConnectListener } from "../wallets/hooks/useWalletConnectListener";
import { MagicWallet } from "../wallets/wallets/MagicWallet";
import { useWalletContext } from "@thirdweb-dev/react-core";

type DappContextType = {
  smartWallet?: SmartWallet;
  setSmartWallet?: (value?: SmartWallet) => void;
  magicWallet?: MagicWallet;
  setMagicWallet?: (value?: MagicWallet) => void;
};

const DappContext = createContext<DappContextType>({});

export const DappContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [smartWallet, setSmartWallet] = useState<SmartWallet | undefined>();
  const [magicWallet, setMagicWallet] = useState<MagicWallet | undefined>();
  const createdWalletInstance = useWalletContext().createdWalletInstance;

  useEffect(() => {
    if (createdWalletInstance?.walletId === walletIds.magicLink) {
      setMagicWallet(createdWalletInstance as MagicWallet);
    }
  }, [createdWalletInstance, setMagicWallet]);

  useWalletConnectListener();

  const magicSDK = useCallback(() => {
    if (magicWallet) {
      const magic = magicWallet.getMagicSDK();
      return <magic.Relayer />;
    }

    return null;
  }, [magicWallet]);

  console.log("dapp context provider.render");
  return (
    <DappContext.Provider
      value={{
        smartWallet,
        setSmartWallet,
        magicWallet: magicWallet,
        setMagicWallet: setMagicWallet,
      }}
    >
      {props.children}
      {magicSDK()}
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

export const useMagicWallet = () => {
  const context = useContext(DappContext);

  return {
    magicWallet: context.magicWallet,
    setMagicWallet: context.setMagicWallet,
  } as const;
};
