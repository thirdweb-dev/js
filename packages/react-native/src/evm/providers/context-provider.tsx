import {
  SmartWallet,
  WalletConnectHandler,
  WalletConnectReceiverConfig,
  WalletConnectV2Handler,
  walletIds,
} from "@thirdweb-dev/wallets";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWalletConnectListener } from "../wallets/hooks/useWalletConnectListener";
import { MagicLink } from "../wallets/wallets/MagicLink";
import { useWallet, useWalletContext } from "@thirdweb-dev/react-core";
import { isWalletConnectReceiverEnabled } from "../wallets/utils";

type DappContextType = {
  smartWallet?: SmartWallet;
  setSmartWallet?: (value?: SmartWallet) => void;
  magicLink?: MagicLink;
  setMagicLink?: (value?: MagicLink) => void;
  walletConnectHandler?: WalletConnectHandler;
};

const DappContext = createContext<DappContextType>({});

export const DappContextProvider = (props: React.PropsWithChildren) => {
  const [smartWallet, setSmartWallet] = useState<SmartWallet | undefined>();
  const [magicLink, setMagicLink] = useState<MagicLink | undefined>();
  const [walletConnectHandler, setWalletConnectHandler] =
    useState<WalletConnectHandler>();
  const createdWalletInstance = useWalletContext().createdWalletInstance;
  const activeWallet = useWallet();

  useEffect(() => {
    if (!createdWalletInstance) {
      return;
    }

    if (createdWalletInstance.walletId === walletIds.magicLink) {
      setMagicLink(createdWalletInstance as MagicLink);
    }
  }, [createdWalletInstance, setMagicLink]);

  useEffect(() => {
    if (!activeWallet) {
      return;
    }

    const initWCHandler = async () => {
      const wcReceiverOptions =
        activeWallet?.getOptions() as WalletConnectReceiverConfig;

      const handler = new WalletConnectV2Handler(
        {
          walletConnectReceiver: {
            ...(wcReceiverOptions?.walletConnectReceiver === true
              ? {}
              : wcReceiverOptions?.walletConnectReceiver),
          },
        },
        activeWallet,
      );
      await handler.init();
      setWalletConnectHandler(handler);
    };

    if (isWalletConnectReceiverEnabled(activeWallet)) {
      initWCHandler();
    }
  }, [activeWallet]);

  useWalletConnectListener(walletConnectHandler);

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
        walletConnectHandler: walletConnectHandler,
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

export const useWalletConnectHandler = () => {
  const context = useContext(DappContext);

  return context.walletConnectHandler;
};
