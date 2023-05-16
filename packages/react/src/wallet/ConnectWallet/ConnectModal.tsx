import { Modal } from "../../components/Modal";
import { WalletSelector } from "./WalletSelector";
import {
  WalletConfig,
  useConnectionStatus,
  useWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  useIsWalletModalOpen,
  useModalTheme,
  useSetIsWalletModalOpen,
} from "../../evm/providers/wallet-ui-states-provider";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme } from "../../design-system";
import { useState, useCallback, useEffect, useRef } from "react";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";
import { reservedScreens } from "./constants";
import { HeadlessConnectUI } from "../wallets/headlessConnectUI";

export const ConnectModal = () => {
  const modalTheme = useModalTheme();
  const walletConfigs = useWallets();
  const initialScreen =
    walletConfigs.length > 1 ? reservedScreens.main : walletConfigs[0];

  const [screen, setScreen] = useState<string | WalletConfig>(initialScreen);
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const wallet = useWallet();

  const handleClose = useCallback(
    (reset = true) => {
      if (reset) {
        setScreen(initialScreen);
      }
      setIsWalletModalOpen(false);
    },
    [setIsWalletModalOpen, initialScreen],
  );

  const handleBack = useCallback(() => {
    setScreen(initialScreen);
  }, [setScreen, initialScreen]);

  const isWrapperConnected = !!wallet?.getPersonalWallet();

  const isWrapperScreen =
    typeof screen !== "string" &&
    "config" in screen &&
    !!(screen.config as any).personalWallets;

  const prevConnectionStatus = useRef(connectionStatus);

  // reopen the screen to complete wrapper wallet's next step after connecting a personal wallet
  useEffect(() => {
    if (
      !isWrapperConnected &&
      isWrapperScreen &&
      !isWalletModalOpen &&
      connectionStatus === "connected" &&
      prevConnectionStatus.current === "connecting"
    ) {
      setIsWalletModalOpen(true);
    }

    prevConnectionStatus.current = connectionStatus;
  }, [
    isWalletModalOpen,
    connectionStatus,
    setIsWalletModalOpen,
    isWrapperScreen,
    isWrapperConnected,
  ]);

  const WalletConnectUI =
    typeof screen !== "string" && (screen.connectUI || HeadlessConnectUI);

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
        open={isWalletModalOpen}
        setOpen={(value) => {
          setIsWalletModalOpen(value);
          if (!value) {
            setScreen(initialScreen); // reset screen
          }
        }}
      >
        {screen === reservedScreens.main && (
          <WalletSelector
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
            theme={modalTheme}
            goBack={handleBack}
            close={handleClose}
            isOpen={isWalletModalOpen}
            open={() => {
              setIsWalletModalOpen(true);
            }}
            walletConfig={screen}
          />
        )}
      </Modal>
    </ThemeProvider>
  );
};
