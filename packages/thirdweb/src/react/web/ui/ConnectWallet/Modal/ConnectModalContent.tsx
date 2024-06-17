"use client";
import { Suspense, lazy, useCallback } from "react";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useSiweAuth } from "../../../../core/hooks/auth/useSiweAuth.js";
import { useConnectUI } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { useActiveWallet } from "../../../hooks/wallets/useActiveWallet.js";
import { useSetActiveWallet } from "../../../hooks/wallets/useSetActiveWallet.js";
import { useSetSelectionData } from "../../../providers/wallet-ui-states-provider.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { WalletSelector } from "../WalletSelector.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import { SignatureScreen } from "../screens/SignatureScreen.js";
import { StartScreen } from "../screens/StartScreen.js";
import { AnyWalletConnectUI } from "./AnyWalletConnectUI.js";
import {
  ConnectModalCompactLayout,
  ConnectModalWideLayout,
} from "./ConnectModalSkeleton.js";
import { SmartConnectUI } from "./SmartWalletConnectUI.js";
import { type ScreenSetup, ScreenSetupContext } from "./screen.js";

const AllWalletsUI = /* @__PURE__ */ lazy(() => import("./AllWalletsUI.js"));

/**
 * @internal
 */
export const ConnectModalContent = (props: {
  screenSetup: ScreenSetup;
  onClose: () => void;
  isOpen: boolean;
  setModalVisibility: (value: boolean) => void;
  shouldSetActive: boolean;
}) => {
  const { setModalVisibility, onClose, shouldSetActive } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;
  const {
    wallets,
    accountAbstraction,
    auth,
    onConnect,
    connectModal,
    connectLocale,
    client,
  } = useConnectUI();
  const setActiveWallet = useSetActiveWallet();
  const setSelectionData = useSetSelectionData();

  const activeWallet = useActiveWallet();
  const siweAuth = useSiweAuth(activeWallet, auth);
  const showSignatureScreen = siweAuth.requiresAuth && !siweAuth.isLoggedIn;

  const handleConnected = useCallback(
    (wallet: Wallet) => {
      if (shouldSetActive) {
        setActiveWallet(wallet);
      }

      if (onConnect) {
        onConnect(wallet);
      }

      onModalUnmount(() => {
        setSelectionData({});
        setModalVisibility(true);
      });

      // show sign in screen if required
      if (showSignatureScreen) {
        setScreen(reservedScreens.signIn);
      } else {
        onClose();
      }
    },
    [
      setModalVisibility,
      onClose,
      onConnect,
      setActiveWallet,
      showSignatureScreen,
      setScreen,
      setSelectionData,
      shouldSetActive,
    ],
  );

  const handleBack = useCallback(() => {
    setScreen(initialScreen);
  }, [setScreen, initialScreen]);

  const walletList = (
    <WalletSelector
      title={connectModal.title || connectLocale.defaultModalTitle}
      wallets={wallets}
      onGetStarted={() => {
        setScreen(reservedScreens.getStarted);
      }}
      selectWallet={(newWallet) => {
        if (newWallet.onConnectRequested) {
          newWallet
            .onConnectRequested()
            .then(() => setScreen(newWallet))
            .catch(console.error); // TODO propagate error down
        } else {
          setScreen(newWallet);
        }
      }}
      onShowAll={() => {
        setScreen(reservedScreens.showAll);
      }}
      done={handleConnected}
      goBack={wallets.length > 1 ? handleBack : undefined}
      setModalVisibility={setModalVisibility}
    />
  );

  const showAll = (
    <Suspense fallback={<LoadingScreen />}>
      <AllWalletsUI onBack={handleBack} onSelect={setScreen} />
    </Suspense>
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
            handleConnected(smartWallet);
          }}
          personalWallet={wallet}
          onBack={goBack}
          setModalVisibility={props.setModalVisibility}
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
        setModalVisibility={props.setModalVisibility}
      />
    );
  };

  const signatureScreen = (
    <SignatureScreen
      onDone={onClose}
      modalSize={connectModal.size}
      termsOfServiceUrl={connectModal.termsOfServiceUrl}
      privacyPolicyUrl={connectModal.privacyPolicyUrl}
      auth={auth}
      client={client}
      connectLocale={connectLocale}
    />
  );

  return (
    <ScreenSetupContext.Provider value={props.screenSetup}>
      {connectModal.size === "wide" ? (
        <ConnectModalWideLayout
          left={walletList}
          right={
            <>
              {screen === reservedScreens.signIn && signatureScreen}
              {screen === reservedScreens.main && getStarted}
              {screen === reservedScreens.getStarted && getStarted}
              {screen === reservedScreens.showAll && showAll}
              {typeof screen !== "string" && getWalletUI(screen)}
            </>
          }
        />
      ) : (
        <ConnectModalCompactLayout>
          {screen === reservedScreens.signIn && signatureScreen}
          {screen === reservedScreens.main && walletList}
          {screen === reservedScreens.getStarted && getStarted}
          {screen === reservedScreens.showAll && showAll}
          {typeof screen !== "string" && getWalletUI(screen)}
        </ConnectModalCompactLayout>
      )}
    </ScreenSetupContext.Provider>
  );
};
