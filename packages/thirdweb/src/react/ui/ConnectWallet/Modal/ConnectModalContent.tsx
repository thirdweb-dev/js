import {
  ModalConfigCtx,
  // SetModalConfigCtx,
  useIsWalletModalOpen,
  useSetIsWalletModalOpen,
} from "../../../providers/wallet-ui-states-provider.js";
import { useCallback, useEffect, useContext, useState } from "react";
import { reservedScreens, onModalUnmount } from "../constants.js";
import { HeadlessConnectUI } from "../../../wallets/headlessConnectUI.js";
import { ScreenContext, useScreen } from "./screen.js";
import { StartScreen } from "../screens/StartScreen.js";
import { CustomThemeProvider } from "../../design-system/CustomThemeProvider.js";
import {
  useActiveAccount,
  useConnect,
} from "../../../providers/wallet-provider.js";
import { Modal } from "../../components/Modal.js";
import { WalletSelector } from "../WalletSelector.js";
import { useThirdwebProviderProps } from "../../../hooks/others/useThirdwebProviderProps.js";
import type { ScreenConfig, WalletConfig } from "../../../types/wallets.js";
import {
  ConnectModalCompactLayout,
  ConnectModalWideLayout,
} from "./ConnectModalSkeleton.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";

/**
 * @internal
 */
export const ConnectModalContent = (props: {
  screen: string | WalletConfig;
  initialScreen: string | WalletConfig;
  setScreen: (screen: string | WalletConfig) => void;
  onHide: () => void;
  onShow: () => void;
  isOpen: boolean;
  onClose: () => void;
  chainId?: bigint;
}) => {
  const { screen, setScreen, initialScreen, onHide, onShow, onClose } = props;
  const { wallets, client, dappMetadata } = useThirdwebProviderProps();
  // const disconnect = useDisconnect();
  const modalConfig = useContext(ModalConfigCtx);
  // const setModalConfig = useContext(SetModalConfigCtx);
  // const activeWalletConnectionStatus = useActiveWalletConnectionStatus();
  // const setActiveWalletConnectionStatus = useSetActiveWalletConnectionStatus();
  // const activeWallet = useActiveWallet();
  const { connect } = useConnect();

  const title = modalConfig.title;
  const theme = modalConfig.theme;
  const modalSize = modalConfig.modalSize;
  const onConnect = modalConfig.onConnect;
  const isWideModal = modalSize === "wide";

  // const { user } = useUser();
  // const authConfig = useThirdwebAuthContext();

  const handleConnected = useCallback(
    (account: Account) => {
      connect(account);

      if (onConnect) {
        onConnect();
      }

      const requiresSignIn = false;
      // const requiresSignIn = modalConfig.auth?.loginOptional
      //   ? false
      //   : !!authConfig?.authUrl && !user?.address;

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
      // modalConfig.auth?.loginOptional,
      // authConfig?.authUrl,
      // user?.address,
      setScreen,
      onShow,
      onClose,
      onConnect,
      connect,
    ],
  );

  const handleBack = useCallback(() => {
    setScreen(initialScreen);
    // if (connectionStatus === "connecting") {
    //   disconnect();
    // }
  }, [
    setScreen,
    initialScreen,
    // connectionStatus,
    // disconnect
  ]);

  // const address = useActiveWalletAddress();

  // const { setConnectionStatus, createWalletInstance, activeWallet } =
  //   useWalletContext();

  const setModalVisibility = useCallback(
    (value: boolean) => {
      if (value) {
        onShow();
      } else {
        onHide();
      }
    },
    [onHide, onShow],
  );

  const screenConfig: ScreenConfig = {
    setModalVisibility,
    theme: typeof theme === "string" ? theme : theme.type,
    goBack: handleBack,
    size: modalConfig.modalSize,
  };

  const walletList = (
    <WalletSelector
      title={title}
      walletConfigs={wallets}
      onGetStarted={() => {
        setScreen(reservedScreens.getStarted);
      }}
      selectWallet={setScreen}
      selectUIProps={{
        screenConfig: screenConfig,
        // activeWalletConnectionStatus,
        // connected: handleConnected,
        // setActiveWalletConnectionStatus,
        // activeWallet,
        // activeWalletAddress: address,
      }}
    />
  );

  const getStarted = <StartScreen />;

  const getWalletUI = (walletConfig: WalletConfig) => {
    const ConnectUI = walletConfig.connectUI || HeadlessConnectUI;

    return (
      <ConnectUI
        walletConfig={walletConfig}
        screenConfig={screenConfig}
        done={handleConnected}
        // selectionData={modalConfig.data}
        // activeWallet={activeWallet}
        // activeWalletAddress={address}
        // setSelectionData={(data: any) => {
        //   setModalConfig((config) => ({
        //     ...config,
        //     data,
        //   }));
        // }}
        // activeWalletConnectionStatus={activeWalletConnectionStatus}
        // setActiveWalletConnectionStatus={setActiveWalletConnectionStatus}
        // connect={walletConfig.connect}
        createInstance={() => {
          return walletConfig.create({
            client,
            dappMetadata,
          });
        }}
        chainId={props.chainId}
      />
    );
  };

  // const signatureScreen = (
  //   <SignatureScreen
  //     onDone={onClose}
  //     modalSize={modalSize}
  //     termsOfServiceUrl={modalConfig.termsOfServiceUrl}
  //     privacyPolicyUrl={modalConfig.privacyPolicyUrl}
  //   />
  // );

  return (
    <ScreenContext.Provider value={screen}>
      {isWideModal ? (
        <ConnectModalWideLayout
          left={walletList}
          right={
            <>
              {/* {screen === reservedScreens.signIn && signatureScreen} */}
              {screen === reservedScreens.main && <>{getStarted}</>}
              {screen === reservedScreens.getStarted && getStarted}
              {typeof screen !== "string" && getWalletUI(screen)}
            </>
          }
        />
      ) : (
        <ConnectModalCompactLayout>
          {/* {screen === reservedScreens.signIn && signatureScreen} */}
          {screen === reservedScreens.main && walletList}
          {screen === reservedScreens.getStarted && getStarted}
          {typeof screen !== "string" && getWalletUI(screen)}
        </ConnectModalCompactLayout>
      )}
    </ScreenContext.Provider>
  );
};

/**
 * @internal
 */
export const ConnectModal = () => {
  const { theme, modalSize, chainId } = useContext(ModalConfigCtx);

  const { screen, setScreen, initialScreen } = useScreen();
  const isWalletModalOpen = useIsWalletModalOpen();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();
  const [hideModal, setHideModal] = useState(false);
  // const connectionStatus = useConnectionStatus();

  const closeModal = useCallback(() => {
    setIsWalletModalOpen(false);
    onModalUnmount(() => {
      setScreen(initialScreen);
    });
  }, [initialScreen, setIsWalletModalOpen, setScreen]);

  // const [prevConnectionStatus, setPrevConnectionStatus] =
  //   useState(connectionStatus);

  // useEffect(() => {
  //   setPrevConnectionStatus(connectionStatus);
  // }, [connectionStatus]);

  // const disconnect = useDisconnect();

  const activeAccount = useActiveAccount();
  // const isWrapperConnected = !!wallet?.getPersonalWallet();

  // const isWrapperScreen =
  //   typeof screen !== "string" && !!screen.personalWallets;

  // reopen the screen to complete wrapper wallet's next step after connecting a personal wallet
  // useEffect(() => {
  //   if (
  //     // !isWrapperConnected &&
  //     isWrapperScreen &&
  //     !isWalletModalOpen &&
  //     // connectionStatus === "connected" &&
  //     // prevConnectionStatus === "connecting"
  //   ) {
  //     setIsWalletModalOpen(true);
  //   }
  // }, [
  //   isWalletModalOpen,
  //   connectionStatus,
  //   setIsWalletModalOpen,
  //   isWrapperScreen,
  //   // isWrapperConnected,
  //   prevConnectionStatus,
  // ]);

  useEffect(() => {
    if (!isWalletModalOpen) {
      onModalUnmount(() => {
        setHideModal(false);
      });
    }
  }, [isWalletModalOpen, setIsWalletModalOpen, screen]);

  const onHide = useCallback(() => setHideModal(true), []);
  const onShow = useCallback(() => setHideModal(false), []);

  // if wallet is suddenly disconnected when showing the sign in screen, close the modal and reset the screen
  useEffect(() => {
    if (
      isWalletModalOpen &&
      screen === reservedScreens.signIn &&
      !activeAccount
    ) {
      setScreen(initialScreen);
      setIsWalletModalOpen(false);
    }
  }, [
    initialScreen,
    isWalletModalOpen,
    screen,
    setIsWalletModalOpen,
    setScreen,
    activeAccount,
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

          if (!value) {
            onModalUnmount(() => {
              // if (connectionStatus === "connecting") {
              //   disconnect();
              // }

              setScreen(initialScreen);
            });
          }
        }}
      >
        <ConnectModalContent
          initialScreen={initialScreen}
          screen={screen}
          setScreen={setScreen}
          onHide={onHide}
          onShow={onShow}
          isOpen={isWalletModalOpen}
          onClose={closeModal}
          chainId={chainId}
        />
      </Modal>
    </CustomThemeProvider>
  );
};
