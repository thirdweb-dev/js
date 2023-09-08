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
import { ThemeProvider } from "@emotion/react";
import { Theme, darkTheme, lightTheme } from "../../../design-system";
import { useCallback, useEffect, useContext } from "react";
import { GetStartedWithWallets } from "../screens/GetStartedWithWallets";
import { reservedScreens, modalMaxHeight } from "../constants";
import { HeadlessConnectUI } from "../../wallets/headlessConnectUI";
import styled from "@emotion/styled";
import { FlexScrollContainer } from "../../../components/basic";
import { ScreenContext, useScreen } from "./screen";

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
          selectionData={modalConfig.data}
          setSelectionData={(data) => {
            setModalConfig((config) => ({
              ...config,
              data,
            }));
          }}
        />
      )}
    </>
  );

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
          <FlexScrollContainer>{screenContent}</FlexScrollContainer>
        </div>
      ) : (
        <FlexScrollContainer
          style={{
            maxHeight: modalMaxHeight,
          }}
        >
          {screenContent}
        </FlexScrollContainer>
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
          initialScreen={initialScreen}
          screen={screen}
          setScreen={setScreen}
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
