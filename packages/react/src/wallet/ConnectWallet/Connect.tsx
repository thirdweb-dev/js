import { Modal } from "../../components/Modal";
import { isMobile } from "../../evm/utils/isMobile";
import { useInstalledWallets } from "../hooks/useInstalledWallets";
import { WalletMeta } from "../types";
import { WalletSelector } from "./WalletSelector";
import { CoinbaseWalletSetup } from "./screens/Coinbase/CoinbaseConnecting";
import { CoinbaseGetStarted } from "./screens/Coinbase/CoinbaseGetStarted";
import { ScanCoinbase } from "./screens/Coinbase/CoinbaseScan";
import { ConnectToDeviceWallet } from "./screens/DeviceWallet/DeviceWalletSetup";
import { MetamaskConnecting } from "./screens/Metamask/MetamaskConnecting";
import { MetamaskGetStarted } from "./screens/Metamask/MetamaskGetStarted";
import { ScanMetamask } from "./screens/Metamask/MetamaskScan";
import {
  useConnect,
  useConnectionStatus,
  useDisconnect,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useCallback, useState } from "react";
import { SelectpersonalWallet } from "./screens/Safe/SelectPersonalWallet";
import { SafeForm } from "./screens/Safe/SafeForm";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";
import {
  useIsConnectingToSafe,
  useIsWalletModalOpen,
  useModalTheme,
  useScreen,
  useSetIsConnectingToSafe,
  useSetIsWalletModalOpen,
  useSetScreen,
} from "../../evm/providers/wallet-ui-states-provider";
import { ifWaiting } from "../../evm/utils/ifWaiting";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../design-system";

export const ConnectModal = () => {
  const modalTheme = useModalTheme();
  const isConnectingToSafe = useIsConnectingToSafe();
  const showScreen = useScreen();
  const setShowScreen = useSetScreen();
  const setIsConnectingToSafe = useSetIsConnectingToSafe();
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
    setIsConnectingToSafe(false);
    setIsWalletModalOpen(false);
  }, [setIsConnectingToSafe, setIsWalletModalOpen, setShowScreen]);

  const onConnect = useCallback(() => {
    if (isConnectingToSafe) {
      setShowScreen("safe/form");
    } else {
      closeModalAndReset();
    }
  }, [closeModalAndReset, isConnectingToSafe, setShowScreen]);

  const onConnectError = useCallback(() => {
    if (isConnectingToSafe) {
      setShowScreen("safe/select-wallet");
    } else {
      setShowScreen("walletList");
    }
  }, [isConnectingToSafe, setShowScreen]);

  const handleBack = useCallback(() => {
    if (isConnectingToSafe) {
      setShowScreen("safe/select-wallet");
    } else {
      setShowScreen("walletList");
    }
  }, [isConnectingToSafe, setShowScreen]);

  const walletsMeta: WalletMeta[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.meta.name,
    iconURL: wallet.meta.iconURL,
    installed:
      wallet.id in installedWallets &&
      installedWallets[wallet.id as keyof typeof installedWallets],
    onClick: async () => {
      // Device Wallet
      if (wallet.id === "deviceWallet") {
        setShowScreen("deviceWallet/connect");
      }

      // Metamask
      else if (wallet.id === "metamask") {
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
          setShowScreen("coinbase/scan");
        }
      }

      // Safe
      else if (wallet.id === "Safe") {
        setIsConnectingToSafe(true);
        setShowScreen("safe/select-wallet");
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
          maxWidth: "450px",
        }}
        open={hideModal ? false : isWalletModalOpen}
        setOpen={(value) => {
          setIsWalletModalOpen(value);
          if (!value) {
            closeModalAndReset();
            console.log({ connectionStatus });
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

        {showScreen === "deviceWallet/connect" && (
          <ConnectToDeviceWallet onBack={handleBack} onConnected={onConnect} />
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
              setIsConnectingToSafe(false);
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
      </Modal>
    </ThemeProvider>
  );
};
