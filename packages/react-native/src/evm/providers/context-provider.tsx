import { SmartWallet, walletIds } from "@thirdweb-dev/wallets";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWalletConnectListener } from "../wallets/hooks/useWalletConnectListener";
import { MagicLink } from "../wallets/wallets/MagicLink";
import { useWalletContext } from "@thirdweb-dev/react-core";

type DappContextType = {
  smartWallet?: SmartWallet;
  setSmartWallet?: (value?: SmartWallet) => void;
  magicLink?: MagicLink;
  setMagicLink?: (value?: MagicLink) => void;
};

const DappContext = createContext<DappContextType>({});

export const DappContextProvider = (props: React.PropsWithChildren) => {
  const [smartWallet, setSmartWallet] = useState<SmartWallet | undefined>();
  const [magicLink, setMagicLink] = useState<MagicLink | undefined>();
  const createdWalletInstance = useWalletContext().createdWalletInstance;

  useEffect(() => {
    if (!createdWalletInstance) {
      return;
    }

    if (createdWalletInstance.walletId === walletIds.magicLink) {
      setMagicLink(createdWalletInstance as MagicLink);
    }
  }, [createdWalletInstance, setMagicLink]);

  useWalletConnectListener();

  const magicSDK = useCallback(() => {
    if (magicLink) {
      const magic = magicLink.getMagicSDK();
      return <magic.Relayer />;
    }

    return null;
  }, [magicLink]);

  return (
    <DappContext.Provider
      value={{
        smartWallet,
        setSmartWallet,
        magicLink: magicLink,
        setMagicLink: setMagicLink,
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

export const useMagicLink = () => {
  const context = useContext(DappContext);

  return {
    magicLink: context.magicLink,
    setMagicLink: context.setMagicLink,
  } as const;
};
