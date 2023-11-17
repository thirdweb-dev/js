import { Modal } from "../../../components/Modal";
import { WalletSelector } from "../WalletSelector";
import {
  WalletConfig,
  useConnectionStatus,
  useDisconnect,
  useThirdwebAuthContext,
  useUser,
  useWallet,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  ModalConfigCtx,
  SetModalConfigCtx,
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "../../../evm/providers/wallet-ui-states-provider";
import { useCallback, useEffect, useContext, useState } from "react";
import {
  reservedScreens,
  compactModalMaxHeight as compactModalMaxHeight,
  onModalUnmount,
} from "../constants";
import { HeadlessConnectUI } from "../../wallets/headlessConnectUI";
import { Container, noScrollBar } from "../../../components/basic";
import { ScreenContext, useScreen } from "./screen";
import { StartScreen } from "../screens/StartScreen";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../design-system/CustomThemeProvider";
import { SignatureScreen } from "../SignatureScreen";
import { StyledDiv } from "../../../design-system/elements";

export const ConnectModalContent = (props: {
  screen: string | WalletConfig;
  initialScreen: string | WalletConfig;
  setScreen: (screen: string | WalletConfig) => void;
  setHideModal: (hide: boolean) => void;
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

  const { user } = useUser();
  const authConfig = useThirdwebAuthContext();

  const closeModal = () => {
    setIsWalletModalOpen(false);
    onModalUnmount(() => {
      setScreen(initialScreen);
    });
  };

  const { setHideModal } = props;
  const handleConnected = useCallback(() => {
    const requiresSignIn = modalConfig.auth?.loginOptional
      ? false
      : !!authConfig?.authUrl && !user?.address;

    setHideModal(false);

    // show sign in screen if required
    if (requiresSignIn) {
      setScreen(reservedScreens.signIn);
    }

    // close modal and reset screen
    else {
      setIsWalletModalOpen(false);
      onModalUnmount(() => {
        setScreen(initialScreen);
      });
    }
  }, [
    modalConfig.auth?.loginOptional,
    authConfig?.authUrl,
    user?.address,
    setIsWalletModalOpen,
    setScreen,
    initialScreen,
    setHideModal,
  ]);

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
        connected={handleConnected}
        isOpen={isWalletModalOpen}
        show={() => {
          props.setHideModal(false);
        }}
        hide={() => {
          props.setHideModal(true);
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
            {screen === reservedScreens.signIn && (
              <SignatureScreen
                onDone={closeModal}
                modalSize={modalSize}
                termsOfServiceUrl={modalConfig.termsOfServiceUrl}
                privacyPolicyUrl={modalConfig.privacyPolicyUrl}
              />
            )}
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
            maxHeight: compactModalMaxHeight,
          }}
        >
          {screen === reservedScreens.signIn && (
            <SignatureScreen
              onDone={closeModal}
              modalSize={modalSize}
              termsOfServiceUrl={modalConfig.termsOfServiceUrl}
              privacyPolicyUrl={modalConfig.privacyPolicyUrl}
            />
          )}
          {screen === reservedScreens.main && walletList}
          {screen === reservedScreens.getStarted && getStarted}
          {typeof screen !== "string" && getWalletUI(screen)}
        </Container>
      )}
    </ScreenContext.Provider>
  );
};

export const ConnectModal = () => {
  const { theme, modalSize, auth } = useContext(ModalConfigCtx);
  const authConfig = useThirdwebAuthContext();
  const { user } = useUser();

  const { screen, setScreen, initialScreen } = useScreen();
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const [hideModal, setHideModal] = useState(false);
  const connectionStatus = useConnectionStatus();

  const [prevConnectionStatus, setPrevConnectionStatus] =
    useState(connectionStatus);
  useEffect(() => {
    setPrevConnectionStatus(connectionStatus);
  }, [connectionStatus]);

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
      connectionStatus === "connected" &&
      prevConnectionStatus === "connecting"
    ) {
      setIsWalletModalOpen(true);
    }
  }, [
    isWalletModalOpen,
    connectionStatus,
    setIsWalletModalOpen,
    isWrapperScreen,
    isWrapperConnected,
    prevConnectionStatus,
  ]);

  useEffect(() => {
    if (!isWalletModalOpen) {
      setHideModal(false);
    }
  }, [isWalletModalOpen, setIsWalletModalOpen, screen]);

  // if wallet is suddenly disconnected when showing the sign in screen, close the modal and reset the screen
  useEffect(() => {
    if (isWalletModalOpen && screen === reservedScreens.signIn && !wallet) {
      setScreen(initialScreen);
      setIsWalletModalOpen(false);
    }
  }, [
    initialScreen,
    isWalletModalOpen,
    screen,
    setIsWalletModalOpen,
    setScreen,
    wallet,
  ]);

  return (
    <CustomThemeProvider theme={theme}>
      <Modal
        hide={hideModal}
        size={modalSize}
        open={isWalletModalOpen}
        setOpen={(value) => {
          setIsWalletModalOpen(value);
          if (!value) {
            const requiresSignIn = auth?.loginOptional
              ? false
              : !!authConfig?.authUrl && !user?.address;

            onModalUnmount(() => {
              if (connectionStatus === "connecting" || requiresSignIn) {
                disconnect();
              }

              setScreen(initialScreen);
            });
          }
        }}
      >
        <ConnectModalContent
          initialScreen={initialScreen}
          screen={screen}
          setScreen={setScreen}
          setHideModal={setHideModal}
        />
      </Modal>
    </CustomThemeProvider>
  );
};

const LeftContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    ...noScrollBar,
    position: "relative",
    borderRight: `1px solid ${theme.colors.separatorLine}`,
  };
});
