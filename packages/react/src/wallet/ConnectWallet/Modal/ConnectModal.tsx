import { Modal } from "../../../components/Modal";
import { WalletSelector } from "../WalletSelector";
import {
  WalletConfig,
  useAddress,
  useConnect,
  useConnectionStatus,
  useDisconnect,
  useThirdwebAuthContext,
  useUser,
  useWallet,
  useWalletContext,
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
  onHide: () => void;
  onShow: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { screen, setScreen, initialScreen, onHide, onShow, onClose } = props;

  const walletConfigs = useWallets();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const modalConfig = useContext(ModalConfigCtx);
  const setModalConfig = useContext(SetModalConfigCtx);

  const title = modalConfig.title;
  const theme = modalConfig.theme;
  const modalSize = modalConfig.modalSize;
  const isWideModal = modalSize === "wide";

  const { user } = useUser();
  const authConfig = useThirdwebAuthContext();

  const handleConnected = useCallback(() => {
    const requiresSignIn = modalConfig.auth?.loginOptional
      ? false
      : !!authConfig?.authUrl && !user?.address;

    onModalUnmount(() => {
      onShow();
    });

    // show sign in screen if required
    if (requiresSignIn) {
      setScreen(reservedScreens.signIn);
    }

    // close modal and reset screen
    else {
      onClose();
    }
  }, [
    modalConfig.auth?.loginOptional,
    authConfig?.authUrl,
    user?.address,
    setScreen,
    onShow,
    onClose,
  ]);

  const handleBack = useCallback(() => {
    setScreen(initialScreen);
    if (connectionStatus === "connecting") {
      disconnect();
    }
  }, [setScreen, initialScreen, connectionStatus, disconnect]);

  const connect = useConnect();
  const address = useAddress();

  const {
    setConnectionStatus,
    setConnectedWallet,
    createWalletInstance,
    activeWallet,
  } = useWalletContext();

  const walletList = (
    <WalletSelector
      title={title}
      walletConfigs={walletConfigs}
      onGetStarted={() => {
        setScreen(reservedScreens.getStarted);
      }}
      selectWallet={setScreen}
      selectUIProps={{
        connect,
        setConnectionStatus,
        setConnectedWallet,
        createWalletInstance,
        connectionStatus,
      }}
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
        isOpen={props.isOpen}
        show={onShow}
        hide={onHide}
        walletConfig={walletConfig}
        modalSize={modalConfig.modalSize}
        selectionData={modalConfig.data}
        connect={(options: any) => connect(walletConfig, options)}
        setConnectionStatus={setConnectionStatus}
        setConnectedWallet={setConnectedWallet}
        createWalletInstance={() => createWalletInstance(walletConfig)}
        connectionStatus={connectionStatus}
        connectedWallet={activeWallet}
        connectedWalletAddress={address}
        setSelectionData={(data) => {
          setModalConfig((config) => ({
            ...config,
            data,
          }));
        }}
      />
    );
  };

  const signatureScreen = (
    <SignatureScreen
      onDone={onClose}
      modalSize={modalSize}
      termsOfServiceUrl={modalConfig.termsOfServiceUrl}
      privacyPolicyUrl={modalConfig.privacyPolicyUrl}
    />
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
          <Container flex="column" scrollY relative>
            {screen === reservedScreens.signIn && signatureScreen}
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
          {screen === reservedScreens.signIn && signatureScreen}
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
  const [hideModal, setHideModal] = useState(false);
  const connectionStatus = useConnectionStatus();

  const closeModal = useCallback(() => {
    setIsWalletModalOpen(false);
    onModalUnmount(() => {
      setScreen(initialScreen);
    });
  }, [initialScreen, setIsWalletModalOpen, setScreen]);

  const [prevConnectionStatus, setPrevConnectionStatus] =
    useState(connectionStatus);

  useEffect(() => {
    setPrevConnectionStatus(connectionStatus);
  }, [connectionStatus]);

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
      onModalUnmount(() => {
        setHideModal(false);
      });
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
          if (hideModal) {
            return;
          }

          setIsWalletModalOpen(value);
        }}
      >
        <ConnectModalContent
          initialScreen={initialScreen}
          screen={screen}
          setScreen={setScreen}
          onHide={() => setHideModal(true)}
          onShow={() => setHideModal(false)}
          isOpen={isWalletModalOpen}
          onClose={closeModal}
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
