import { CrossContainer, Modal } from "../../components/Modal";
import { WalletSelector } from "./WalletSelector";
import {
  WalletConfig,
  useConnectionStatus,
  useDisconnect,
  useWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
  WalletUIStatesProvider,
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "../../evm/providers/wallet-ui-states-provider";
import { ThemeProvider } from "@emotion/react";
import {
  Theme,
  darkTheme,
  iconSize,
  lightTheme,
  radius,
  shadow,
} from "../../design-system";
import { useState, useCallback, useEffect, useRef, useContext } from "react";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";
import { modalMaxWidth, reservedScreens } from "./constants";
import { HeadlessConnectUI } from "../wallets/headlessConnectUI";
import styled from "@emotion/styled";
import { Cross2Icon } from "@radix-ui/react-icons";
import { IconButton } from "../../components/buttons";

export const ConnectModalContent = (props: {
  screen: string | WalletConfig;
  setScreen: (screen: string | WalletConfig) => void;
  theme?: "light" | "dark";
  title?: string;
}) => {
  const { screen, setScreen } = props;
  const modalConfig = useContext(ModalConfigCtx);
  const title = props.title || modalConfig.title;
  const theme = props.theme || modalConfig.theme;
  const walletConfigs = useWallets();
  const initialScreen =
    walletConfigs.length === 1 && !walletConfigs[0].selectUI
      ? walletConfigs[0]
      : reservedScreens.main;

  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const wallet = useWallet();
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
    [
      connectionStatus,
      setIsWalletModalOpen,
      setScreen,
      initialScreen,
      disconnect,
    ],
  );

  const handleBack = useCallback(() => {
    setScreen(initialScreen);
  }, [setScreen, initialScreen]);

  const isWrapperConnected = !!wallet?.getPersonalWallet();

  const isWrapperScreen =
    typeof screen !== "string" && !!screen.personalWallets;

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
        typeof theme === "object"
          ? theme
          : theme === "light"
          ? lightTheme
          : darkTheme
      }
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
    </ThemeProvider>
  );
};

export const ConnectModal = () => {
  const { theme } = useContext(ModalConfigCtx);
  const { screen, setScreen, initialScreen } = useScreen();
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Modal
        style={{
          maxWidth: modalMaxWidth,
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
        <ConnectModalContent screen={screen} setScreen={setScreen} />
      </Modal>
    </ThemeProvider>
  );
};

export const ConnectModalInline = (props: {
  theme?: "light" | "dark";
  title?: string;
  className?: string;
}) => {
  const { screen, setScreen } = useScreen();
  return (
    <WalletUIStatesProvider theme={props.theme}>
      <ThemeProvider theme={props.theme === "light" ? lightTheme : darkTheme}>
        <ConnectModalInlineContainer className={props.className}>
          <ConnectModalContent
            screen={screen}
            setScreen={setScreen}
            theme={props.theme}
            title={props.title}
          />

          <CrossContainer>
            <IconButton variant="secondary" type="button" aria-label="Close">
              <Cross2Icon
                style={{
                  width: iconSize.md,
                  height: iconSize.md,
                  color: "inherit",
                }}
              />
            </IconButton>
          </CrossContainer>
        </ConnectModalInlineContainer>
      </ThemeProvider>
    </WalletUIStatesProvider>
  );
};

function useScreen() {
  const walletConfigs = useWallets();
  const initialScreen =
    walletConfigs.length === 1 && !walletConfigs[0].selectUI
      ? walletConfigs[0]
      : reservedScreens.main;

  const [screen, setScreen] = useState<string | WalletConfig>(initialScreen);
  return {
    screen,
    setScreen,
    initialScreen,
  };
}

const ConnectModalInlineContainer = styled.div<{ theme?: Theme }>`
  background: linear-gradient(
    to top,
    ${(p) => p.theme.bg.base},
    ${(p) => p.theme.bg.baseHover}
  );
  border-radius: ${radius.xl};
  max-width: ${modalMaxWidth};
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${shadow.lg};
  position: relative;
  border: 1px solid ${(p) => p.theme.bg.elevated};
`;
