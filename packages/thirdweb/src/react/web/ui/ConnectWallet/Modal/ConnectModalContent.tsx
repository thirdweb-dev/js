"use client";
import { Suspense, lazy, useCallback, useState } from "react";
import { COINBASE } from "../../../../../wallets/constants.js";
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
    chain,
  } = useConnectUI();
  const setActiveWallet = useSetActiveWallet();
  const setSelectionData = useSetSelectionData();

  const activeWallet = useActiveWallet();
  const siweAuth = useSiweAuth(activeWallet, auth);
  const showSignatureScreen = siweAuth.requiresAuth && !siweAuth.isLoggedIn;

  const [connectError, setConnectError] = useState(false);
  const [personalWalletConnected, setPersonalWalletConnected] = useState(false);

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
      selectWallet={async (newWallet) => {
        setScreen(newWallet);
        // re-set the connect error so that it doesn't show up on the next connection
        setConnectError(false);

        // When selecting Coinbase, fire off the connection immediately
        // this fixes an issue on safari where the CB popup window would get blocked
        // because of the delay between this click and the actual connection
        // that happens within 'CoinbaseSDKConnection' component 2 layers down
        // when the cb extension is installed -> pops the extension
        // when the extension is not installed -> pops a new window
        // then in 'CoinbaseSDKConnection' the connection is requested again
        // which just "links" to the extension / popup window a few ms later
        // and handle the completion / error handling there
        // this connection flow structure needs to be refactored to properly handle this
        if (newWallet.id === COINBASE) {
          try {
            await newWallet.connect({
              client,
              chain,
            });
            // if AA -> only set the personal wallet connected state, don not close the modal!
            if (accountAbstraction) {
              setPersonalWalletConnected(true);
            } else {
              handleConnected(newWallet);
            }
          } catch {
            // set the connect error so the child componenet can know if connection failed
            setConnectError(true);
          }
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
    if (accountAbstraction && personalWalletConnected) {
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
          // if AA -> only set the personal wallet connected state, don not close the modal!
          if (accountAbstraction) {
            setPersonalWalletConnected(true);
          } else {
            handleConnected(wallet);
          }
        }}
        connectError={connectError}
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
