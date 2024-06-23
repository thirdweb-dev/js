"use client";
import { Suspense, lazy, useCallback } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import {
  type SiweAuthOptions,
  useSiweAuth,
} from "../../../../core/hooks/auth/useSiweAuth.js";
import { useActiveWallet } from "../../../hooks/wallets/useActiveWallet.js";
import { useSetActiveWallet } from "../../../hooks/wallets/useSetActiveWallet.js";
import { useSetSelectionData } from "../../../providers/wallet-ui-states-provider.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import type { LocaleId } from "../../types.js";
import type { ConnectButton_connectModalOptions } from "../ConnectButtonProps.js";
import { WalletSelector } from "../WalletSelector.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import type { ConnectLocale } from "../locale/types.js";
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
  wallets: Wallet[];
  accountAbstraction: SmartWalletOptions | undefined;
  auth: SiweAuthOptions | undefined;
  onConnect: ((wallet: Wallet) => void) | undefined;
  connectModal: Omit<ConnectButton_connectModalOptions, "size"> & {
    size: "compact" | "wide";
  };
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  isEmbed: boolean;
  recommendedWallets: Wallet[] | undefined;
  localeId: LocaleId;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  showAllWallets: boolean | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
}) => {
  const { setModalVisibility, onClose, shouldSetActive } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;
  const setActiveWallet = useSetActiveWallet();
  const setSelectionData = useSetSelectionData();

  const activeWallet = useActiveWallet();
  const siweAuth = useSiweAuth(activeWallet, props.auth);
  const showSignatureScreen = siweAuth.requiresAuth && !siweAuth.isLoggedIn;

  const handleConnected = useCallback(
    (wallet: Wallet) => {
      if (shouldSetActive) {
        setActiveWallet(wallet);
      }

      if (props.onConnect) {
        props.onConnect(wallet);
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
      props.onConnect,
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
      title={props.connectModal.title || props.connectLocale.defaultModalTitle}
      wallets={props.wallets}
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
      goBack={props.wallets.length > 1 ? handleBack : undefined}
      setModalVisibility={setModalVisibility}
      client={props.client}
      connectLocale={props.connectLocale}
      connectModal={props.connectModal}
      isEmbed={props.isEmbed}
      recommendedWallets={props.recommendedWallets}
      accountAbstraction={props.accountAbstraction}
      localeId={props.localeId}
      chain={props.chain}
      showAllWallets={props.showAllWallets}
      chains={props.chains}
      walletConnect={props.walletConnect}
    />
  );

  const showAll = (
    <Suspense fallback={<LoadingScreen />}>
      <AllWalletsUI
        onBack={handleBack}
        onSelect={setScreen}
        client={props.client}
        connectLocale={props.connectLocale}
        connectModal={props.connectModal}
        recommendedWallets={props.recommendedWallets}
        specifiedWallets={props.wallets}
      />
    </Suspense>
  );

  const getStarted = (
    <StartScreen
      client={props.client}
      connectLocale={props.connectLocale}
      connectModal={props.connectModal}
    />
  );

  const goBack = props.wallets.length > 1 ? handleBack : undefined;

  const getWalletUI = (wallet: Wallet) => {
    if (props.accountAbstraction) {
      return (
        <SmartConnectUI
          key={wallet.id}
          accountAbstraction={props.accountAbstraction}
          done={(smartWallet) => {
            handleConnected(smartWallet);
          }}
          personalWallet={wallet}
          onBack={goBack}
          setModalVisibility={props.setModalVisibility}
          connectModal={props.connectModal}
          localeId={props.localeId}
          chain={props.chain}
          chains={props.chains}
          client={props.client}
          walletConnect={props.walletConnect}
          connectLocale={props.connectLocale}
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
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        connectModal={props.connectModal}
        localeId={props.localeId}
        walletConnect={props.walletConnect}
        connectLocale={props.connectLocale}
      />
    );
  };

  const signatureScreen = (
    <SignatureScreen
      onDone={onClose}
      modalSize={props.connectModal.size}
      termsOfServiceUrl={props.connectModal.termsOfServiceUrl}
      privacyPolicyUrl={props.connectModal.privacyPolicyUrl}
      auth={props.auth}
      client={props.client}
      connectLocale={props.connectLocale}
    />
  );

  return (
    <ScreenSetupContext.Provider value={props.screenSetup}>
      {props.connectModal.size === "wide" ? (
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
