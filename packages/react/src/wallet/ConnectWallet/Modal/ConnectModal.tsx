import { Modal } from "../../../components/Modal";
import { WalletSelector } from "../WalletSelector";
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
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "../../../evm/providers/wallet-ui-states-provider";
import { useCallback, useEffect, useContext } from "react";
import { reservedScreens, compactmodalMaxHeight } from "../constants";
import { HeadlessConnectUI } from "../../wallets/headlessConnectUI";
import styled from "@emotion/styled";
import { Container, noScrollBar } from "../../../components/basic";
import { ScreenContext, useScreen } from "./screen";
import { StartScreen } from "../screens/StartScreen";
import { CustomThemeProvider } from "../../../design-system/CustomThemeProvider";
import { Theme } from "../../../design-system";

export const ConnectModalContent = (props: {
  screen: string | WalletConfig;
  initialScreen: string | WalletConfig;
  setScreen: (screen: string | WalletConfig) => void;
}) => {
  const { screen, setScreen, initialScreen } = props;

  const walletConfigs = useWallets();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  const modalConfig = useContext(ModalConfigCtx);
  const setModalConfig = useContext(SetModalConfigCtx);

  const title = modalConfig.title;
  const theme = modalConfig.theme;
  const modalSize = modalConfig.modalSize;
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
    if (connectionStatus === "connecting") {
      disconnect();
    }
  }, [setScreen, initialScreen, connectionStatus, disconnect]);

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

  const getStarted = <StartScreen />;

  const getWalletUI = (walletConfig: WalletConfig) => {
    const ConnectUI = walletConfig.connectUI || HeadlessConnectUI;

    return (
      <ConnectUI
        supportedWallets={walletConfigs}
        theme={typeof theme === "string" ? theme : theme.type}
        goBack={handleBack}
        close={handleClose}
        isOpen={isWalletModalOpen}
        open={() => {
          setIsWalletModalOpen(true);
        }}
        walletConfig={walletConfig}
        modalSize={modalConfig.modalSize}
        selectionData={modalConfig.data}
        setSelectionData={(data) => {
          setModalConfig((config) => ({
            ...config,
            data,
          }));
        }}
      />
    );
  };

  return (
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
          <Container flex="column" scrollY relative>
            {screen === reservedScreens.main && <>{getStarted}</>}
            {screen === reservedScreens.getStarted && getStarted}
            {typeof screen !== "string" && getWalletUI(screen)}
          </Container>
        </div>
      ) : (
        <Container
          flex="column"
          scrollY
          relative
          style={{
            maxHeight: compactmodalMaxHeight,
          }}
        >
          {screen === reservedScreens.main && walletList}
          {screen === reservedScreens.getStarted && getStarted}
          {typeof screen !== "string" && getWalletUI(screen)}
        </Container>
      )}
    </ScreenContext.Provider>
  );
};

export const ConnectModal = () => {
  const { theme, modalSize } = useContext(ModalConfigCtx);
  const { screen, setScreen, initialScreen } = useScreen();
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const wallet = useWallet();
  const isWrapperConnected = !!wallet?.getPersonalWallet();

  const isWrapperScreen =
    typeof screen !== "string" && !!screen.personalWallets;

  // reopen the screen to complete wrapper wallet's next step after connecting a personal wallet
  useEffect(() => {
    if (
      !isWrapperConnected &&
      isWrapperScreen &&
      !isWalletModalOpen &&
      connectionStatus === "connected"
    ) {
      setIsWalletModalOpen(true);
    }
  }, [
    isWalletModalOpen,
    connectionStatus,
    setIsWalletModalOpen,
    isWrapperScreen,
    isWrapperConnected,
  ]);

  return (
    <CustomThemeProvider theme={theme}>
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
          initialScreen={initialScreen}
          screen={screen}
          setScreen={setScreen}
        />
      </Modal>
    </CustomThemeProvider>
  );
};

const LeftContainer = /* @__PURE__ */ styled.div<{
  theme?: Theme;
}>`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ${noScrollBar}
  position: relative;
  border-right: 1px solid ${(p) => p.theme.colors.separatorLine};
`;
