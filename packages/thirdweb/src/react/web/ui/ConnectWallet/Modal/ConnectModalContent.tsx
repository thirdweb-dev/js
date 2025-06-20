"use client";
import { lazy, Suspense, useCallback } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import {
  type SiweAuthOptions,
  useSiweAuth,
} from "../../../../core/hooks/auth/useSiweAuth.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useSetActiveWallet } from "../../../../core/hooks/wallets/useSetActiveWallet.js";
import { useConnectionManager } from "../../../../core/providers/connection-manager.js";
import { useSetSelectionData } from "../../../providers/wallet-ui-states-provider.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import type { ConnectLocale } from "../locale/types.js";
import { SignatureScreen } from "../screens/SignatureScreen.js";
import { StartScreen } from "../screens/StartScreen.js";
import type { WelcomeScreen } from "../screens/types.js";
import { WalletSelector } from "../WalletSelector.js";
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
  onClose: (() => void) | undefined;
  isOpen: boolean;
  setModalVisibility: (value: boolean) => void;
  shouldSetActive: boolean;
  wallets: Wallet[];
  accountAbstraction: SmartWalletOptions | undefined;
  auth: SiweAuthOptions | undefined;
  onConnect: ((wallet: Wallet) => void) | undefined;
  size: "compact" | "wide";
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    requireApproval?: boolean;
  };
  welcomeScreen: WelcomeScreen | undefined;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  hideHeader: boolean;
  recommendedWallets: Wallet[] | undefined;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  showAllWallets: boolean | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  modalHeader:
    | {
        title: string;
        onBack: () => void;
      }
    | undefined;
  walletIdsToHide: WalletId[] | undefined;
}) => {
  const { setModalVisibility, onClose, shouldSetActive } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;
  const setActiveWallet = useSetActiveWallet();
  const setSelectionData = useSetSelectionData();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(activeWallet, activeAccount, props.auth);
  const showSignatureScreen = siweAuth.requiresAuth && !siweAuth.isLoggedIn;
  const connectionManager = useConnectionManager();

  const handleConnected = useCallback(
    (wallet: Wallet) => {
      if (shouldSetActive) {
        setActiveWallet(wallet);
      } else {
        connectionManager.addConnectedWallet(wallet);
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
        setScreen(initialScreen);
        onClose?.();
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
      initialScreen,
      connectionManager,
    ],
  );

  const handleBack = useCallback(() => {
    setSelectionData({});
    setScreen(initialScreen);
  }, [setScreen, initialScreen, setSelectionData]);

  const walletList = (
    <WalletSelector
      accountAbstraction={props.accountAbstraction}
      chain={props.chain}
      chains={props.chains}
      client={props.client}
      connectLocale={props.connectLocale}
      done={handleConnected}
      goBack={props.wallets.length > 1 ? handleBack : undefined}
      hideHeader={props.hideHeader}
      meta={props.meta}
      modalHeader={props.modalHeader}
      onShowAll={() => {
        setScreen(reservedScreens.showAll);
      }}
      recommendedWallets={props.recommendedWallets}
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
      setModalVisibility={setModalVisibility}
      showAllWallets={props.showAllWallets}
      size={props.size}
      title={props.meta.title || props.connectLocale.defaultModalTitle}
      walletConnect={props.walletConnect}
      walletIdsToHide={props.walletIdsToHide}
      wallets={props.wallets}
    />
  );

  const showAll = (
    <Suspense fallback={<LoadingScreen />}>
      <AllWalletsUI
        client={props.client}
        connectLocale={props.connectLocale}
        onBack={handleBack}
        onSelect={setScreen}
        recommendedWallets={props.recommendedWallets}
        size={props.size}
        specifiedWallets={props.wallets}
      />
    </Suspense>
  );

  const getStarted = (
    <StartScreen
      client={props.client}
      connectLocale={props.connectLocale}
      meta={props.meta}
      welcomeScreen={props.welcomeScreen}
    />
  );

  const goBack = props.wallets.length > 1 ? handleBack : undefined;

  const getWalletUI = (wallet: Wallet) => {
    if (props.accountAbstraction) {
      return (
        <SmartConnectUI
          accountAbstraction={props.accountAbstraction}
          chain={props.chain}
          chains={props.chains}
          client={props.client}
          connectLocale={props.connectLocale}
          done={(smartWallet) => {
            handleConnected(smartWallet);
          }}
          key={wallet.id}
          meta={props.meta}
          onBack={goBack}
          personalWallet={wallet}
          setModalVisibility={props.setModalVisibility}
          size={props.size}
          walletConnect={props.walletConnect}
        />
      );
    }

    return (
      <AnyWalletConnectUI
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        connectLocale={props.connectLocale}
        done={() => {
          handleConnected(wallet);
        }}
        key={wallet.id}
        meta={props.meta}
        onBack={goBack}
        setModalVisibility={props.setModalVisibility}
        size={props.size}
        wallet={wallet}
        walletConnect={props.walletConnect}
      />
    );
  };

  const signatureScreen = (
    <SignatureScreen
      auth={props.auth}
      client={props.client}
      connectLocale={props.connectLocale}
      modalSize={props.size}
      onClose={onClose}
      onDone={onClose}
      privacyPolicyUrl={props.meta.privacyPolicyUrl}
      termsOfServiceUrl={props.meta.termsOfServiceUrl}
    />
  );

  return (
    <ScreenSetupContext.Provider value={props.screenSetup}>
      {props.size === "wide" ? (
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
