import { Modal } from "../../components/Modal";
import { WalletSelector } from "./WalletSelector";
import {
  ConfiguredWallet,
  useConnectionStatus,
  useCreateWalletInstance,
  useDisconnect,
  useThirdwebWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  useIsWalletModalOpen,
  useModalTheme,
  useSetIsWalletModalOpen,
} from "../../evm/providers/wallet-ui-states-provider";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../design-system";
import { useState, useCallback, useEffect } from "react";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";
import { reservedScreens } from "./constants";
import { HeadlessConnectUI } from "../wallets/headlessConnectUI";

export const ConnectModal = () => {
  const modalTheme = useModalTheme();
  const [screen, setScreen] = useState<string | ConfiguredWallet>(
    reservedScreens.main,
  );
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();
  const createInstance = useCreateWalletInstance();
  const twWalletContext = useThirdwebWallet();
  const configuredWallets = useWallets();
  const [wrapperWallet, setWrapperWallet] = useState<
    ConfiguredWallet | undefined
  >();

  // to hide the modal temporarily when showing the third party Modal to avoid z-index issues
  const [hideModal, setHideModal] = useState(false);

  const closeModalAndReset = useCallback(() => {
    setScreen(reservedScreens.main);
    setIsWalletModalOpen(false);
    setHideModal(false);
  }, [setIsWalletModalOpen, setScreen]);

  const handleConnect = useCallback(() => {
    if (wrapperWallet) {
      setScreen(wrapperWallet);
    } else {
      closeModalAndReset();
    }
  }, [wrapperWallet, setScreen, closeModalAndReset]);

  const handleBack = useCallback(() => {
    setScreen("main");
  }, [setScreen]);

  // if the modal is closed, and connecting to wrapper, open again
  useEffect(() => {
    if (
      wrapperWallet &&
      !isWalletModalOpen &&
      connectionStatus === "connected"
    ) {
      setIsWalletModalOpen(true);
    }
  }, [
    wrapperWallet,
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
      <Modal
        style={{
          maxWidth: "480px",
        }}
        open={hideModal ? false : isWalletModalOpen}
        setOpen={(value) => {
          setIsWalletModalOpen(value);
          if (!value) {
            // ignore if the modal is hidden already
            if (hideModal) {
              return;
            }
            closeModalAndReset();
            if (connectionStatus === "connecting") {
              disconnect();
            }
          }
        }}
      >
        {screen === reservedScreens.main && (
          <WalletSelector
            configuredWallets={configuredWallets}
            onGetStarted={() => {
              setScreen(reservedScreens.getStarted);
            }}
            selectWallet={(wallet) => {
              setScreen(wallet);
            }}
          />
        )}

        {screen === reservedScreens.getStarted && (
          <GetStartedWithWallets onBack={handleBack} />
        )}

        {typeof screen !== "string" && screen.connectUI && (
          <screen.connectUI
            onConnect={handleConnect}
            createInstance={createInstance}
            goBack={handleBack}
            hideModal={() => {
              setHideModal(true);
            }}
            isModalHidden={hideModal}
            selectWallet={(configuredWallet) => {
              setScreen(configuredWallet);
            }}
            setConnectedWallet={(wallet) => {
              twWalletContext.handleWalletConnect(wallet);
            }}
            showModal={() => {
              setHideModal(false);
            }}
            setWrapperWallet={setWrapperWallet}
          />
        )}

        {typeof screen !== "string" && !screen.connectUI && (
          <HeadlessConnectUI
            onConnect={handleConnect}
            createInstance={createInstance}
            goBack={handleBack}
            hideModal={() => {
              setHideModal(true);
            }}
            isModalHidden={hideModal}
            selectWallet={(configuredWallet) => {
              setScreen(configuredWallet);
            }}
            setConnectedWallet={(wallet) => {
              twWalletContext.handleWalletConnect(wallet);
            }}
            showModal={() => {
              setHideModal(false);
            }}
            setWrapperWallet={setWrapperWallet}
            configuredWallet={screen}
          />
        )}
      </Modal>
    </ThemeProvider>
  );
};
