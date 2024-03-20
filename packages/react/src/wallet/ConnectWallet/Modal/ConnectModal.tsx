import { Modal } from "../../../components/Modal";
import { WalletSelector } from "../WalletSelector";
import {
  WalletConfig,
  WalletInstance,
  useAddress,
  useConnect,
  useConnectionStatus,
  useDisconnect,
  useThirdwebAuthContext,
  useUser,
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
import { ScreenSetup, ScreenSetupContext, useSetupScreen } from "./screen";
import { StartScreen } from "../screens/StartScreen";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../design-system/CustomThemeProvider";
import { SignatureScreen } from "../SignatureScreen";
import { StyledDiv } from "../../../design-system/elements";

export const ConnectModalContent = (props: {
  screenSetup: ScreenSetup;
  onHide: () => void;
  onShow: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { onHide, onShow, onClose } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;

  const walletConfigs = useWallets();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();

  const modalConfig = useContext(ModalConfigCtx);
  const setModalConfig = useContext(SetModalConfigCtx);

  const title = modalConfig.title;
  const theme = modalConfig.theme;
  const modalSize = modalConfig.modalSize;
  const onConnect = modalConfig.onConnect;
  const isWideModal = modalSize === "wide";

  const { user } = useUser();
  const authConfig = useThirdwebAuthContext();

  const [handleConnectedPending, setIsHandleConnectedPending] = useState(false);

  const handleConnected = useCallback(
    (_wallet: WalletInstance) => {
      if (onConnect) {
        onConnect(_wallet);
      }

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
    },
    [
      modalConfig.auth?.loginOptional,
      authConfig?.authUrl,
      user?.address,
      setScreen,
      onShow,
      onClose,
      onConnect,
    ],
  );

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

  // wait for the wallet state to be updated before calling handleConnected
  useEffect(() => {
    if (activeWallet && handleConnectedPending) {
      handleConnected(activeWallet);
      setIsHandleConnectedPending(false);
    }
  }, [handleConnectedPending, activeWallet, handleConnected]);

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
        connected={() => {
          setIsHandleConnectedPending(true);
        }}
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
    <ScreenSetupContext.Provider value={props.screenSetup}>
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
    </ScreenSetupContext.Provider>
  );
};

export const ConnectModal = () => {
  const { theme, modalSize } = useContext(ModalConfigCtx);

  const screenSetup = useSetupScreen();
  const { screen, setScreen, initialScreen } = screenSetup;
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

  const disconnect = useDisconnect();

  useEffect(() => {
    if (!isWalletModalOpen) {
      onModalUnmount(() => {
        setHideModal(false);
      });
    }
  }, [isWalletModalOpen, setIsWalletModalOpen, screen]);

  const onHide = useCallback(() => setHideModal(true), []);
  const onShow = useCallback(() => setHideModal(false), []);

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

          if (!value) {
            onModalUnmount(() => {
              if (connectionStatus === "connecting") {
                disconnect();
              }

              setScreen(initialScreen);
            });
          }
        }}
      >
        <ConnectModalContent
          screenSetup={screenSetup}
          onHide={onHide}
          onShow={onShow}
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
