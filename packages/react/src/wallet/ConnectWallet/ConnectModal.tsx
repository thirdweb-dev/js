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
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";
import { GetStartedWithWallets } from "./screens/GetStartedWithWallets";
import {
  modalMaxWidthCompact,
  modalMaxWidthWide,
  reservedScreens,
  modalMaxHeight,
} from "./constants";
import { HeadlessConnectUI } from "../wallets/headlessConnectUI";
import styled from "@emotion/styled";
import { Cross2Icon } from "@radix-ui/react-icons";
import { IconButton } from "../../components/buttons";
import { FlexScrollContainer } from "../../components/basic";

export const ConnectModalContent = (props: {
  screen: string | WalletConfig;
  setScreen: (screen: string | WalletConfig) => void;
  theme?: "light" | "dark";
  title?: string;
  modalSize: "wide" | "compact";
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
  const walletModalConfig = useContext(ModalConfigCtx);
  const setWalletModalConfig = useContext(SetModalConfigCtx);
  const disconnect = useDisconnect();

  const modalSize = modalConfig.modalSize || props.modalSize;
  const isWideModal = modalSize === "wide";

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

  const WalletConnectUI =
    typeof screen !== "string" && (screen.connectUI || HeadlessConnectUI);

  const walletList = (
    <WalletSelector
      title={title}
      walletConfigs={walletConfigs}
      onGetStarted={() => {
        setScreen(reservedScreens.getStarted);
      }}
      selectWallet={setScreen}
    />
  );

  const screenContent = (
    <>
      {screen === reservedScreens.main && !isWideModal && walletList}

      {isWideModal && screen === reservedScreens.main && (
        <GetStartedWithWallets onBack={handleBack} />
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
          modalSize={modalConfig.modalSize}
          selectionData={walletModalConfig.data}
          setSelectionData={(data) => {
            setWalletModalConfig((config) => ({
              ...config,
              data,
            }));
          }}
        />
      )}
    </>
  );

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <ScreenContext.Provider value={screen}>
        {isWideModal ? (
          <div
            style={{
              height: "100%",
              display: "grid",
              gridTemplateColumns: "300px 1fr",
            }}
          >
            <LeftContainer> {walletList} </LeftContainer>
            <FlexScrollContainer>{screenContent}</FlexScrollContainer>
          </div>
        ) : (
          <FlexScrollContainer
            style={{
              maxHeight: modalMaxHeight,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {screenContent}
          </FlexScrollContainer>
        )}
      </ScreenContext.Provider>
    </ThemeProvider>
  );
};

export const ConnectModal = () => {
  const { theme, modalSize, title } = useContext(ModalConfigCtx);
  const { screen, setScreen, initialScreen } = useScreen();
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const wallet = useWallet();
  const isWrapperConnected = !!wallet?.getPersonalWallet();
  const prevConnectionStatus = useRef(connectionStatus);

  const isWrapperScreen =
    typeof screen !== "string" && !!screen.personalWallets;

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

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Modal
        size={modalSize}
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
        <ConnectModalContent
          screen={screen}
          setScreen={setScreen}
          title={title}
          modalSize={modalSize}
        />
      </Modal>
    </ThemeProvider>
  );
};

const LeftContainer = /* @__PURE__ */ styled(FlexScrollContainer)<{
  theme?: Theme;
}>`
  border-right: 1px solid ${(p) => p.theme.bg.elevatedHover};
`;

export const ConnectModalInline = (props: {
  theme?: "light" | "dark";
  title?: string;
  className?: string;
  modalSize: "wide" | "compact";
}) => {
  const { screen, setScreen } = useScreen();
  return (
    <WalletUIStatesProvider theme={props.theme} modalSize={props.modalSize}>
      <ThemeProvider theme={props.theme === "light" ? lightTheme : darkTheme}>
        <ConnectModalInlineContainer
          className={props.className}
          style={{
            height: props.modalSize === "compact" ? "auto" : modalMaxHeight,
            maxWidth:
              props.modalSize === "compact"
                ? modalMaxWidthCompact
                : modalMaxWidthWide,
          }}
        >
          <ConnectModalContent
            screen={screen}
            setScreen={setScreen}
            theme={props.theme}
            title={props.title}
            modalSize={props.modalSize}
          />

          {/* close icon */}
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

type Screen = string | WalletConfig;

export const ScreenContext = /* @__PURE__ */ createContext<Screen | undefined>(
  undefined,
);

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

export function useScreenContext() {
  const screen = useContext(ScreenContext);
  if (!screen) {
    throw new Error(
      "useScreenContext must be used within a <ScreenProvider />",
    );
  }
  return screen;
}

const ConnectModalInlineContainer = styled.div<{ theme?: Theme }>`
  background: ${(p) => p.theme.bg.base};
  transition: background 0.2s ease;
  border-radius: ${radius.xl};
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${shadow.lg};
  position: relative;
  border: 1px solid ${(p) => p.theme.bg.elevatedHover};
  line-height: 1;
`;
