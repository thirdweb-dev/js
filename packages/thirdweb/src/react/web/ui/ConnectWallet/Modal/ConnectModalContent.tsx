import {
  ModalConfigCtx,
  // SetModalConfigCtx,
  // SetModalConfigCtx,
} from "../../../providers/wallet-ui-states-provider.js";
import { useCallback, useContext } from "react";
import { reservedScreens, onModalUnmount } from "../constants.js";
// import { HeadlessConnectUI } from "../../../wallets/headlessConnectUI.js";
import { ScreenSetupContext, type ScreenSetup } from "./screen.js";
import { StartScreen } from "../screens/StartScreen.js";
import { WalletSelector } from "../WalletSelector.js";
import {
  ConnectModalCompactLayout,
  ConnectModalWideLayout,
} from "./ConnectModalSkeleton.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useConnect } from "../../../../core/hooks/wallets/wallet-hooks.js";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { AnyWalletConnectUI } from "./AnyWalletConnectUI.js";
import { SmartConnectUI } from "./SmartWalletConnectUI.js";

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
  const { onShow, onClose } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;
  const { wallets, accountAbstraction } = useWalletConnectionCtx();
  // const disconnect = useDisconnect();
  const modalConfig = useContext(ModalConfigCtx);
  // const setModalConfig = useContext(SetModalConfigCtx);
  // const activeWalletConnectionStatus = useActiveWalletConnectionStatus();
  // const activeWallet = useActiveWallet();
  const { connect } = useConnect();

  const title = modalConfig.title;
  const modalSize = modalConfig.modalSize;
  const onConnect = modalConfig.onConnect;
  const isWideModal = modalSize === "wide";

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

  const walletList = (
    <WalletSelector
      title={title}
      wallets={wallets}
      onGetStarted={() => {
        setScreen(reservedScreens.getStarted);
      }}
      selectWallet={setScreen}
      done={handleConnected}
      goBack={wallets.length > 1 ? handleBack : undefined}
    />
  );

  const getStarted = <StartScreen />;

  const goBack = wallets.length > 1 ? handleBack : undefined;

  const getWalletUI = (wallet: Wallet) => {
    if (accountAbstraction) {
      return (
        <SmartConnectUI
          key={wallet.id}
          accountAbstraction={accountAbstraction}
          done={(smartWallet) => {
            console.log("connected smart wallet");
            handleConnected(smartWallet);
          }}
          personalWallet={wallet}
          onBack={goBack}
        />
      );
    }

    return (
      <AnyWalletConnectUI
        key={wallet.id}
        wallet={wallet}
        onBack={goBack}
        done={() => {
          handleConnected(wallet);
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
