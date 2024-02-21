import {
  ModalConfigCtx,
  SetModalConfigCtx,
  // SetModalConfigCtx,
} from "../../../providers/wallet-ui-states-provider.js";
import { useCallback, useContext } from "react";
import { reservedScreens, onModalUnmount } from "../constants.js";
import { HeadlessConnectUI } from "../../../wallets/headlessConnectUI.js";
import { ScreenSetupContext, type ScreenSetup } from "./screen.js";
import { StartScreen } from "../screens/StartScreen.js";
import { useConnect } from "../../../providers/wallet-provider.js";
import { WalletSelector } from "../WalletSelector.js";
import { useThirdwebProviderProps } from "../../../hooks/others/useThirdwebProviderProps.js";
import type { ScreenConfig, WalletConfig } from "../../../types/wallets.js";
import {
  ConnectModalCompactLayout,
  ConnectModalWideLayout,
} from "./ConnectModalSkeleton.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";

/**
 * @internal
 */
export const ConnectModalContent = (props: {
  screenSetup: ScreenSetup;
  onHide: () => void;
  onShow: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { onHide, onShow, onClose } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;
  const { wallets, client, dappMetadata } = useThirdwebProviderProps();
  // const disconnect = useDisconnect();
  const modalConfig = useContext(ModalConfigCtx);
  const setModalConfig = useContext(SetModalConfigCtx);
  // const activeWalletConnectionStatus = useActiveWalletConnectionStatus();
  // const setActiveWalletConnectionStatus = useSetActiveWalletConnectionStatus();
  // const activeWallet = useActiveWallet();
  const { connect } = useConnect();

  const title = modalConfig.title;
  const theme = modalConfig.theme;
  const modalSize = modalConfig.modalSize;
  const onConnect = modalConfig.onConnect;
  const isWideModal = modalSize === "wide";

  const saveData = useCallback(
    (data: any) => {
      setModalConfig((prev) => ({
        ...prev,
        data: data,
      }));
    },
    [setModalConfig],
  );

  // const { user } = useUser();
  // const authConfig = useThirdwebAuthContext();

  const handleConnected = useCallback(
    (wallet: Wallet) => {
      connect(wallet);

      if (onConnect) {
        onConnect(wallet);
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
    goBack: wallets.length > 1 ? handleBack : undefined,
    size: modalConfig.modalSize,
  };

  const connection = {
    done: handleConnected,
    chain: modalConfig.chain,
    chains: modalConfig.chains,
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
        connection: connection,
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
        connection={{
          ...connection,
          createInstance: () => {
            return walletConfig.create({
              client,
              dappMetadata,
            });
          },
        }}
        selection={{
          data: modalConfig.data,
          saveData,
        }}
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
    <ScreenSetupContext.Provider value={props.screenSetup}>
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
    </ScreenSetupContext.Provider>
  );
};
