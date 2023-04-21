import { Modal } from "../../components/Modal";
import { isMobile } from "../../evm/utils/isMobile";
import { useInstalledWallets } from "../hooks/useInstalledWallets";
import { WalletMeta } from "../types";
import { WalletSelector } from "./WalletSelector";
import { CoinbaseWalletSetup } from "./screens/Coinbase/CoinbaseConnecting";
import { CoinbaseGetStarted } from "./screens/Coinbase/CoinbaseGetStarted";
import { ScanCoinbase } from "./screens/Coinbase/CoinbaseScan";
import { MetamaskConnecting } from "./screens/Metamask/MetamaskConnecting";
import { MetamaskGetStarted } from "./screens/Metamask/MetamaskGetStarted";
import { ScanMetamask } from "./screens/Metamask/MetamaskScan";
import {
  useConnect,
  useConnectionStatus,
  useDisconnect,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useState } from "react";
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
import { ConnectToDeviceWallet } from "./screens/DeviceWallet/DeviceWalletSetup";
import { SmartWalletConnection } from "./screens/SmartWallet/SmartWalletForm";

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
    } else {
      setShowScreen("walletList");
    }
  }, [isConnectingToWalletWrapper, setShowScreen]);

  const handleBack = useCallback(() => {
    if (isConnectingToWalletWrapper === "safe") {
      setShowScreen("safe/select-wallet");
    } else {
      setShowScreen("walletList");
    }
  }, [isConnectingToWalletWrapper, setShowScreen]);

  const walletsMeta: WalletMeta[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.meta.name,
    iconURL: wallet.meta.iconURL,
    installed:
      wallet.id in installedWallets &&
      installedWallets[wallet.id as keyof typeof installedWallets],
    onClick: async () => {
      // Metamask
      if (wallet.id === "metamask") {
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
      else if (wallet.id === "coinbaseWallet") {
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
      else if (wallet.id === "Safe") {
        setIsConnectingToWalletWrapper("safe");
        setShowScreen("safe/select-wallet");
      }

      // Smart Wallet
      else if (wallet.id === "SmartWallet") {
        // setIsConnectingToWalletWrapper("smartWallet");
        setShowScreen("smartWallet/form");
      }

      // Device Wallet
      else if (wallet.id === "deviceWallet") {
        setShowScreen("deviceWallet/connect");
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
  }));

  useEffect(() => {
    if (showScreen === "walletList" && wallets.length === 1) {
      walletsMeta[0].onClick();
    }
  }, [walletsMeta, showScreen, wallets.length]);

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
      <Modal
        style={{
          maxWidth: "480px",
        }}
        open={hideModal ? false : isWalletModalOpen}
        setOpen={(value) => {
          setIsWalletModalOpen(value);
          if (!value) {
            closeModalAndReset();
            if (connectionStatus === "connecting") {
              disconnect();
            }
          }
        }}
      >
        {showScreen === "walletList" && (
          <WalletSelector
            walletsMeta={walletsMeta}
            onGetStarted={() => {
              setShowScreen("wallets/get-started");
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
            onBack={() => {
              setIsConnectingToWalletWrapper(false);
              setShowScreen("walletList");
            }}
            walletsMeta={walletsMeta}
          />
        )}

        {showScreen === "safe/form" && (
          <SafeForm
            onBack={handleBack}
            onConnect={() => {
              closeModalAndReset();
            }}
          />
        )}

        {showScreen === "wallets/get-started" && (
          <GetStartedWithWallets onBack={handleBack} />
        )}

        {showScreen === "deviceWallet/connect" && (
          <ConnectToDeviceWallet onBack={handleBack} onConnected={onConnect} />
        )}

        {showScreen === "smartWallet/form" && (
          <SmartWalletConnection
            onBack={handleBack}
            onConnect={() => {
              closeModalAndReset();
            }}
          />
        )}
      </Modal>
    </ThemeProvider>
  );
};
