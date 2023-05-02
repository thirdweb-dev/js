import { Modal } from "../../components/Modal";
import { isMobile } from "../../evm/utils/isMobile";
import { useInstalledWallets } from "../hooks/useInstalledWallets";
import { WalletInfo } from "../types";
import { WalletSelector } from "./WalletSelector";
import { CoinbaseWalletSetup } from "./screens/Coinbase/CoinbaseConnecting";
import { CoinbaseGetStarted } from "./screens/Coinbase/CoinbaseGetStarted";
import { ScanCoinbase } from "./screens/Coinbase/CoinbaseScan";
import { MetamaskConnecting } from "./screens/Metamask/MetamaskConnecting";
import { MetamaskGetStarted } from "./screens/Metamask/MetamaskGetStarted";
import { ScanMetamask } from "./screens/Metamask/MetamaskScan";
import {
  Wallet,
  useConnect,
  useConnectionStatus,
  useDisconnect,
  useWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { SelectpersonalWallet } from "./screens/Safe/SelectPersonalWallet";
import { SafeForm } from "./screens/Safe/SafeForm";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";
import {
  useIsConnectingToWalletWrapper,
  useIsWalletModalOpen,
  useModalTheme,
  useScreen,
  useSetIsConnectingToWalletWrapper,
  useSetIsWalletModalOpen,
  useSetScreen,
} from "../../evm/providers/wallet-ui-states-provider";
import { ifWaiting } from "../../evm/utils/ifWaiting";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../design-system";
import { LocalWalletSetup } from "./screens/LocalWallet/LocalWalletSetup";
import { SmartWalletForm } from "./screens/SmartWallet/SmartWalletForm";
import { MagicConnect } from "./screens/Magic/MagicConnect";
import { SmartWalletSelect } from "./screens/SmartWallet/SmartWalletSelect";
import { SmartWalletObj } from "../wallets/smartWallet";
import { SafeWalletObj } from "../wallets/safeWallet";
import { walletIds } from "@thirdweb-dev/wallets";
import { WalletsInfoCtx } from "./walletInfo";

export const ConnectModal = () => {
  const modalTheme = useModalTheme();
  const isConnectingToWalletWrapper = useIsConnectingToWalletWrapper();
  const showScreen = useScreen();
  const setShowScreen = useSetScreen();
  const setIsConnectingToWalletWrapper = useSetIsConnectingToWalletWrapper();
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const connect = useConnect();
  const wallets = useWallets();
  const activeWallet = useWallet();
  const installedWallets = useInstalledWallets();

  // to hide the modal temporarily when showing the third party Modal to avoid z-index issues
  const [hideModal, setHideModal] = useState(false);

  const closeModalAndReset = useCallback(() => {
    setShowScreen("walletList");
    setIsConnectingToWalletWrapper(false);
    setIsWalletModalOpen(false);
  }, [setIsConnectingToWalletWrapper, setIsWalletModalOpen, setShowScreen]);

  const onConnect = useCallback(() => {
    if (isConnectingToWalletWrapper === "safe") {
      setShowScreen("safe/form");
    } else if (isConnectingToWalletWrapper === "smartWallet") {
      setShowScreen("smartWallet/form");
    } else {
      closeModalAndReset();
    }
  }, [closeModalAndReset, isConnectingToWalletWrapper, setShowScreen]);

  const onConnectError = useCallback(() => {
    if (isConnectingToWalletWrapper === "safe") {
      setShowScreen("safe/select-wallet");
    } else if (isConnectingToWalletWrapper === "smartWallet") {
      setShowScreen("smartWallet/select-wallet");
    } else {
      setShowScreen("walletList");
    }
  }, [isConnectingToWalletWrapper, setShowScreen]);

  const onlyOneWallet = wallets.length === 1;

  const handleBack = useCallback(() => {
    if (isConnectingToWalletWrapper === "safe") {
      setShowScreen("safe/select-wallet");
    } else if (isConnectingToWalletWrapper === "smartWallet") {
      setShowScreen("smartWallet/select-wallet");
    } else {
      setShowScreen("walletList");
    }
  }, [isConnectingToWalletWrapper, setShowScreen]);

  type GetWalletInfo = (wallet: Wallet) => WalletInfo;
  const getWalletInfo: GetWalletInfo = useCallback(
    (wallet: Wallet) => ({
      wallet,
      installed:
        wallet.id in installedWallets &&
        installedWallets[wallet.id as keyof typeof installedWallets],
      connect: async () => {
        // Metamask
        if (wallet.id === walletIds.metamask) {
          if (installedWallets.metamask) {
            try {
              await ifWaiting({
                for: connect(wallet, {}),
                moreThan: 100,
                do: () => {
                  setShowScreen("metamask/connecting");
                },
              });

              onConnect();
            } catch (e) {
              onConnectError();
            }
          }

          // if metamask is not injected
          else {
            // on mobile, open metamask app link
            if (isMobile()) {
              window.open(
                `https://metamask.app.link/dapp/${window.location.toString()}`,
              );
            } else {
              // on desktop, show the metamask scan qr code
              setShowScreen("metamask/scan");
            }
          }
        }

        // Coinbase Wallet
        else if (wallet.id === walletIds.coinbase) {
          if (installedWallets.coinbaseWallet) {
            try {
              await ifWaiting({
                for: connect(wallet, {}),
                moreThan: 100,
                do: () => {
                  setShowScreen("coinbase/connecting");
                },
              });
              onConnect();
            } catch (e) {
              onConnectError();
            }
          } else {
            if (isMobile()) {
              // coinbase will redirect to download page for coinbase wallet apps
              connect(wallet, {});
            } else {
              setShowScreen("coinbase/scan");
            }
          }
        }

        // Safe
        else if (wallet.id === walletIds.safe) {
          setIsConnectingToWalletWrapper("safe");
          setShowScreen("safe/select-wallet");
        }

        // Smart Wallet
        else if (wallet.id === walletIds.smartWallet) {
          setIsConnectingToWalletWrapper("smartWallet");
          setShowScreen("smartWallet/select-wallet");
        }

        // Local Wallet
        else if (wallet.id === walletIds.localWallet) {
          setShowScreen("localWallet/connect");
        }

        // Magic link
        else if (wallet.id === walletIds.magicLink) {
          setShowScreen("magic/connect");
        }

        // others ( they handle their own connection flow)
        else {
          try {
            setHideModal(true);
            await connect(wallet, {});
            onConnect();
            setHideModal(false);
          } catch (e) {
            onConnectError();
            setHideModal(false);
            console.error(e);
          }
        }
      },
    }),
    [
      connect,
      installedWallets,
      onConnect,
      onConnectError,
      setIsConnectingToWalletWrapper,
      setShowScreen,
    ],
  );

  const smartWalletObj = wallets.find((w) => w.id === walletIds.smartWallet) as
    | SmartWalletObj
    | undefined;

  const safeWalletObj = wallets.find((w) => w.id === walletIds.safe) as
    | SafeWalletObj
    | undefined;

  const walletsInfo: WalletInfo[] = (() => {
    if (isConnectingToWalletWrapper === "safe") {
      return safeWalletObj?.config.personalWallets.map(getWalletInfo) || [];
    }

    if (isConnectingToWalletWrapper === "smartWallet") {
      return smartWalletObj?.config.personalWallets.map(getWalletInfo) || [];
    }
    return wallets.map(getWalletInfo);
  })();

  // if only one wallet, auto select it
  const connected = useRef(false);
  useEffect(() => {
    if (
      showScreen === "walletList" &&
      wallets.length === 1 &&
      !activeWallet &&
      isWalletModalOpen &&
      !connected.current
    ) {
      connected.current = true;
      walletsInfo[0].connect();
    }
  }, [
    walletsInfo,
    showScreen,
    wallets.length,
    activeWallet,
    isWalletModalOpen,
  ]);

  useEffect(() => {
    // if the modal is closed, and isConnectingToWalletWrapper is true, open again and connected
    if (
      isConnectingToWalletWrapper &&
      !isWalletModalOpen &&
      connectionStatus === "connected"
    ) {
      setIsWalletModalOpen(true);
    }
  }, [
    isConnectingToWalletWrapper,
    isWalletModalOpen,
    connectionStatus,
    setIsWalletModalOpen,
  ]);

  return (
    <ThemeProvider
      theme={
        typeof modalTheme === "object"
          ? modalTheme
          : modalTheme === "light"
          ? lightTheme
          : darkTheme
      }
    >
      <WalletsInfoCtx.Provider value={walletsInfo}>
        <Modal
          style={{
            maxWidth: "480px",
          }}
          open={hideModal ? false : isWalletModalOpen}
          setOpen={(value) => {
            setIsWalletModalOpen(value);

            if (!value) {
              if (!isConnectingToWalletWrapper) {
                closeModalAndReset();
                if (connectionStatus === "connecting") {
                  disconnect();
                }
              }
            }
          }}
        >
          {showScreen === "walletList" && (
            <WalletSelector
              onGetStarted={() => {
                setShowScreen("wallets/get-started");
              }}
              onGuestConnect={() => {
                setShowScreen("localWallet/connect");
              }}
            />
          )}

          {showScreen === "metamask/get-started" && (
            <MetamaskGetStarted
              onBack={() => {
                setShowScreen("metamask/scan");
              }}
            />
          )}

          {showScreen === "coinbase/get-started" && (
            <CoinbaseGetStarted
              onBack={() => {
                setShowScreen("coinbase/scan");
              }}
            />
          )}

          {showScreen === "metamask/connecting" && (
            <MetamaskConnecting onBack={handleBack} />
          )}

          {showScreen === "metamask/scan" && (
            <ScanMetamask
              onBack={handleBack}
              onConnected={onConnect}
              onGetStarted={() => {
                setShowScreen("metamask/get-started");
              }}
            />
          )}

          {showScreen === "coinbase/scan" && (
            <ScanCoinbase
              onBack={handleBack}
              onConnected={onConnect}
              onGetStarted={() => {
                setShowScreen("coinbase/get-started");
              }}
            />
          )}

          {showScreen === "coinbase/connecting" && (
            <CoinbaseWalletSetup onBack={handleBack} />
          )}

          {showScreen === "safe/select-wallet" && (
            <SelectpersonalWallet
              safeWallet={safeWalletObj as SafeWalletObj}
              onBack={() => {
                if (onlyOneWallet) {
                  return;
                }
                setIsConnectingToWalletWrapper(false);
                setShowScreen("walletList");
              }}
            />
          )}

          {showScreen === "safe/form" && (
            <SafeForm
              safeWallet={safeWalletObj as SafeWalletObj}
              onBack={handleBack}
              onConnect={() => {
                closeModalAndReset();
              }}
            />
          )}

          {showScreen === "wallets/get-started" && (
            <GetStartedWithWallets
              onBack={handleBack}
              walletInfo={walletsInfo[0]}
            />
          )}

          {showScreen === "localWallet/connect" && (
            <LocalWalletSetup onBack={handleBack} onConnected={onConnect} />
          )}

          {showScreen === "smartWallet/form" && (
            <SmartWalletForm
              smartWallet={smartWalletObj as SmartWalletObj}
              onBack={handleBack}
              onConnect={() => {
                closeModalAndReset();
              }}
            />
          )}

          {showScreen === "smartWallet/select-wallet" && (
            <SmartWalletSelect
              smartWallet={smartWalletObj as SmartWalletObj}
              onBack={() => {
                if (onlyOneWallet) {
                  return;
                }
                setShowScreen("walletList");
                setIsConnectingToWalletWrapper(false);
              }}
            />
          )}

          {showScreen === "magic/connect" && (
            <MagicConnect onBack={handleBack} onConnect={onConnect} />
          )}
        </Modal>
      </WalletsInfoCtx.Provider>
    </ThemeProvider>
  );
};
