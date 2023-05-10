import { Modal } from "../../components/Modal";
import { WalletSelector } from "./WalletSelector";
import {
  ConfiguredWallet,
  useConnectionStatus,
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
  const configuredWallets = useWallets();

  const handleClose = useCallback(
    (reset = true) => {
      if (reset) {
        setScreen(reservedScreens.main);
      }
      setIsWalletModalOpen(false);
    },
    [setIsWalletModalOpen],
  );

  const handleBack = useCallback(() => {
    setScreen(reservedScreens.main);
  }, [setScreen]);

  const isWrapper =
    typeof screen !== "string" &&
    "config" in screen &&
    !!(screen.config as any).personalWallets;

  // if the modal is closed, rendering a wrapper, personal wallet is connected - open modal back
  useEffect(() => {
    if (isWrapper && !isWalletModalOpen && connectionStatus === "connected") {
      setIsWalletModalOpen(true);
    }
  }, [isWalletModalOpen, connectionStatus, setIsWalletModalOpen, isWrapper]);

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
            setScreen(reservedScreens.main); // reset screen
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
            theme={modalTheme}
            goBack={handleBack}
            close={handleClose}
            isOpen={isWalletModalOpen}
            open={() => {
              setIsWalletModalOpen(true);
            }}
          />
        )}

        {typeof screen !== "string" && !screen.connectUI && (
          <HeadlessConnectUI
            theme={modalTheme}
            goBack={handleBack}
            close={handleClose}
            isOpen={isWalletModalOpen}
            open={() => {
              setIsWalletModalOpen(true);
            }}
            configuredWallet={screen}
          />
        )}
      </Modal>
    </ThemeProvider>
  );
};
