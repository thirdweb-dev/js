import { Modal } from "../../components/Modal";
import { WalletSelector } from "./WalletSelector";
import {
  WalletConfig,
  useConnectionStatus,
  useDisconnect,
  useWalletConfig,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "../../evm/providers/wallet-ui-states-provider";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../design-system";
import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";
import { reservedScreens } from "./constants";
import { HeadlessConnectUI } from "../wallets/headlessConnectUI";

export const ConnectModal = () => {
  const { theme, title } = useContext(ModalConfigCtx);
  const walletConfigs = useWallets();
  const initialScreen =
    walletConfigs.length === 1 && !walletConfigs[0].selectUI
      ? walletConfigs[0]
      : reservedScreens.main;

  const [screen, setScreen] = useState<string | WalletConfig>(initialScreen);
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const walletConfig = useWalletConfig();
  const walletModalConfig = useContext(ModalConfigCtx);
  const setWalletModalConfig = useContext(SetModalConfigCtx);
  const disconnect = useDisconnect();

  const handleClose = useCallback(
    (reset = true) => {
      if (reset) {
        setScreen(initialScreen);
      }
      if (connectionStatus === "connecting") {
        disconnect();
      }
      setIsWalletModalOpen(false);
    },
    [setIsWalletModalOpen, initialScreen, connectionStatus, disconnect],
  );

  const handleBack = useCallback(() => {
    setScreen(initialScreen);
    if (connectionStatus === "connecting") {
      disconnect();
    }
  }, [setScreen, initialScreen, connectionStatus, disconnect]);

  const prevConnectionStatus = useRef(connectionStatus);

  // if screen's wallet is not connected and modal is closed and connectionStatus is connected
  // then reopen the modal
  useEffect(() => {
    if (
      // if modal is closed
      !isWalletModalOpen &&
      // a wallet is connected
      connectionStatus === "connected" &&
      // rendering a screen for a wallet - and it's not connected
      typeof screen !== "string" &&
      screen.id !== walletConfig?.id
    ) {
      // then reopen the modal
      setIsWalletModalOpen(true);
    }

    prevConnectionStatus.current = connectionStatus;
  }, [
    isWalletModalOpen,
    connectionStatus,
    setIsWalletModalOpen,
    screen,
    walletConfig?.id,
  ]);

  const WalletConnectUI =
    typeof screen !== "string" && (screen.connectUI || HeadlessConnectUI);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Modal
        style={{
          maxWidth: "480px",
        }}
        open={isWalletModalOpen}
        setOpen={(value) => {
          setIsWalletModalOpen(value);
          if (!value) {
            setScreen(initialScreen); // reset screen
          }
          if (connectionStatus === "connecting") {
            disconnect();
          }
        }}
      >
        {screen === reservedScreens.main && (
          <WalletSelector
            title={title}
            walletConfigs={walletConfigs}
            onGetStarted={() => {
              setScreen(reservedScreens.getStarted);
            }}
            selectWallet={setScreen}
          />
        )}

        {screen === reservedScreens.getStarted && (
          <GetStartedWithWallets onBack={handleBack} />
        )}

        {WalletConnectUI && (
          <WalletConnectUI
            supportedWallets={walletConfigs}
            theme={theme}
            goBack={handleBack}
            close={handleClose}
            isOpen={isWalletModalOpen}
            open={() => {
              setIsWalletModalOpen(true);
            }}
            walletConfig={screen}
            selectionData={walletModalConfig.data}
            setSelectionData={(data) => {
              setWalletModalConfig((config) => ({
                ...config,
                data,
              }));
            }}
          />
        )}
      </Modal>
    </ThemeProvider>
  );
};
